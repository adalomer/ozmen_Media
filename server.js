import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import multer from 'multer';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(process.env.DATA_DIR || path.join(rootDir, '.data'));
const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(rootDir, 'uploads'));
const clientsFile = path.join(dataDir, 'clients.json');
const seedFile = path.join(rootDir, 'data', 'clients.seed.json');
const port = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';
const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || (isProduction ? '' : 'admin123');
const sessionSecret = process.env.SESSION_SECRET || (isProduction ? '' : 'development-only-session-secret-change-me');

if (!adminPassword || !sessionSecret || (isProduction && (adminPassword.length < 12 || sessionSecret.length < 32))) {
  console.error('Production requires an ADMIN_PASSWORD of at least 12 characters and a SESSION_SECRET of at least 32 characters.');
  process.exit(1);
}

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(clientsFile)) fs.copyFileSync(seedFile, clientsFile);

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (req.path.startsWith('/admin')) res.setHeader('Cache-Control', 'no-store');
  next();
});

function readClients() {
  return JSON.parse(fs.readFileSync(clientsFile, 'utf8'));
}

function writeClients(clients) {
  const temporary = `${clientsFile}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(clients, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temporary, clientsFile);
}

function safeEqual(valueA, valueB) {
  const a = Buffer.from(String(valueA));
  const b = Buffer.from(String(valueB));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function parseCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').map(part => part.trim().split('=').map(decodeURIComponent)).filter(pair => pair.length === 2));
}

function sessionToken(expires) {
  const payload = `${adminUsername}.${expires}`;
  const signature = crypto.createHmac('sha256', sessionSecret).update(payload).digest('base64url');
  return Buffer.from(`${payload}.${signature}`).toString('base64url');
}

function hasValidSession(req) {
  try {
    const raw = Buffer.from(parseCookies(req).ozmen_admin || '', 'base64url').toString();
    const pieces = raw.split('.');
    if (pieces.length !== 3 || pieces[0] !== adminUsername || Number(pieces[1]) < Date.now()) return false;
    const expected = crypto.createHmac('sha256', sessionSecret).update(`${pieces[0]}.${pieces[1]}`).digest('base64url');
    return safeEqual(pieces[2], expected);
  } catch {
    return false;
  }
}

function requireAdmin(req, res, next) {
  if (!hasValidSession(req)) return res.status(401).json({ error: 'Oturum süresi doldu. Lütfen yeniden giriş yapın.' });
  next();
}

function sameOrigin(req, res, next) {
  const origin = req.get('origin');
  if (origin && origin !== `${req.protocol}://${req.get('host')}`) return res.status(403).json({ error: 'Geçersiz istek kaynağı.' });
  next();
}

const loginAttempts = new Map();
function loginRateLimit(req, res, next) {
  const now = Date.now();
  const state = loginAttempts.get(req.ip) || { count: 0, reset: now + 15 * 60_000 };
  if (state.reset < now) Object.assign(state, { count: 0, reset: now + 15 * 60_000 });
  if (state.count >= 10) return res.status(429).json({ error: 'Çok fazla deneme. 15 dakika sonra tekrar deneyin.' });
  req.loginState = state;
  next();
}

const allowedTypes = new Map([
  ['image/jpeg', { extension: '.jpg', signatures: [[0xff, 0xd8, 0xff]] }],
  ['image/png', { extension: '.png', signatures: [[0x89, 0x50, 0x4e, 0x47]] }],
  ['image/webp', { extension: '.webp', signatures: [['RIFF', 0], ['WEBP', 8]] }]
]);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 }, fileFilter: (_req, file, callback) => callback(null, allowedTypes.has(file.mimetype)) });

function validImageBuffer(file) {
  if (!file) return false;
  if (file.mimetype === 'image/webp') return file.buffer.toString('ascii', 0, 4) === 'RIFF' && file.buffer.toString('ascii', 8, 12) === 'WEBP';
  return allowedTypes.get(file.mimetype).signatures[0].every((byte, index) => file.buffer[index] === byte);
}

function validateClient(body, requireImage) {
  const value = {
    name: String(body.name || '').trim(),
    handle: String(body.handle || '').trim().replace(/^@?/, '@'),
    followers: String(body.followers || '').trim(),
    instagramUrl: String(body.instagramUrl || '').trim(),
    categoryTr: String(body.categoryTr || '').trim(),
    categoryEn: String(body.categoryEn || '').trim(),
    active: body.active === 'true' || body.active === true,
    order: Number(body.order || 0)
  };
  if (!value.name || value.name.length > 80) throw new Error('Müşteri adı zorunludur (en fazla 80 karakter).');
  if (!/^@[A-Za-z0-9._]{1,30}$/.test(value.handle)) throw new Error('Geçerli bir Instagram kullanıcı adı girin.');
  if (!value.followers || value.followers.length > 20) throw new Error('Takipçi sayısı zorunludur.');
  let url;
  try { url = new URL(value.instagramUrl); } catch { throw new Error('Geçerli bir Instagram bağlantısı girin.'); }
  if (url.protocol !== 'https:' || !/(^|\.)instagram\.com$/i.test(url.hostname)) throw new Error('Bağlantı instagram.com üzerinde ve HTTPS olmalıdır.');
  if (value.categoryTr.length > 80 || value.categoryEn.length > 80) throw new Error('Kategori en fazla 80 karakter olabilir.');
  if (!Number.isInteger(value.order) || value.order < 0 || value.order > 9999) throw new Error('Sıra 0–9999 arasında olmalıdır.');
  if (requireImage && !body.imageUrl) throw new Error('Müşteri görseli zorunludur.');
  return value;
}

function deleteUploadedImage(imageUrl) {
  if (!imageUrl?.startsWith('/uploads/')) return;
  const target = path.join(uploadDir, path.basename(imageUrl));
  if (target.startsWith(`${uploadDir}${path.sep}`) && fs.existsSync(target)) fs.unlinkSync(target);
}

app.get('/api/clients', (_req, res) => {
  const clients = readClients().filter(client => client.active).sort((a, b) => a.order - b.order).map(({ active: _active, ...client }) => client);
  res.setHeader('Cache-Control', 'no-store');
  res.json(clients);
});

app.post('/api/admin/login', sameOrigin, loginRateLimit, (req, res) => {
  const valid = safeEqual(req.body.username || '', adminUsername) && safeEqual(req.body.password || '', adminPassword);
  if (!valid) {
    req.loginState.count += 1;
    loginAttempts.set(req.ip, req.loginState);
    return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı.' });
  }
  loginAttempts.delete(req.ip);
  const expires = Date.now() + 8 * 60 * 60_000;
  res.cookie('ozmen_admin', sessionToken(expires), { httpOnly: true, secure: isProduction, sameSite: 'strict', maxAge: 8 * 60 * 60_000, path: '/' });
  res.json({ username: adminUsername });
});

app.post('/api/admin/logout', sameOrigin, (_req, res) => {
  res.clearCookie('ozmen_admin', { path: '/' });
  res.status(204).end();
});

app.get('/api/admin/session', requireAdmin, (_req, res) => res.json({ username: adminUsername }));
app.get('/api/admin/clients', requireAdmin, (_req, res) => res.json(readClients().sort((a, b) => a.order - b.order)));

app.post('/api/admin/clients', sameOrigin, requireAdmin, upload.single('image'), (req, res) => {
  let imageUrl = '';
  try {
    if (!validImageBuffer(req.file)) throw new Error('JPG, PNG veya WebP formatında geçerli bir görsel yükleyin.');
    const extension = allowedTypes.get(req.file.mimetype).extension;
    const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;
    fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer, { mode: 0o644 });
    imageUrl = `/uploads/${filename}`;
    const client = { id: crypto.randomUUID(), ...validateClient({ ...req.body, imageUrl }, true), imageUrl, createdAt: new Date().toISOString() };
    const clients = readClients();
    clients.push(client);
    writeClients(clients);
    res.status(201).json(client);
  } catch (error) {
    if (imageUrl) deleteUploadedImage(imageUrl);
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/admin/clients/:id', sameOrigin, requireAdmin, upload.single('image'), (req, res) => {
  let newImageUrl = '';
  try {
    const clients = readClients();
    const index = clients.findIndex(client => client.id === req.params.id);
    if (index < 0) return res.status(404).json({ error: 'Müşteri bulunamadı.' });
    if (req.file) {
      if (!validImageBuffer(req.file)) throw new Error('JPG, PNG veya WebP formatında geçerli bir görsel yükleyin.');
      const filename = `${Date.now()}-${crypto.randomUUID()}${allowedTypes.get(req.file.mimetype).extension}`;
      fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer, { mode: 0o644 });
      newImageUrl = `/uploads/${filename}`;
    }
    const previous = clients[index];
    const updated = { ...previous, ...validateClient({ ...req.body, imageUrl: newImageUrl || previous.imageUrl }, true), imageUrl: newImageUrl || previous.imageUrl, updatedAt: new Date().toISOString() };
    clients[index] = updated;
    writeClients(clients);
    if (newImageUrl) deleteUploadedImage(previous.imageUrl);
    res.json(updated);
  } catch (error) {
    if (newImageUrl) deleteUploadedImage(newImageUrl);
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/admin/clients/:id/status', sameOrigin, requireAdmin, (req, res) => {
  const clients = readClients();
  const client = clients.find(item => item.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Müşteri bulunamadı.' });
  if (typeof req.body.active !== 'boolean') return res.status(400).json({ error: 'Geçersiz durum.' });
  client.active = req.body.active;
  client.updatedAt = new Date().toISOString();
  writeClients(clients);
  res.json(client);
});

app.delete('/api/admin/clients/:id', sameOrigin, requireAdmin, (req, res) => {
  const clients = readClients();
  const index = clients.findIndex(client => client.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: 'Müşteri bulunamadı.' });
  const [deleted] = clients.splice(index, 1);
  writeClients(clients);
  deleteUploadedImage(deleted.imageUrl);
  res.status(204).end();
});

app.use('/uploads', express.static(uploadDir, { fallthrough: false, maxAge: '7d', immutable: true }));
app.get('/admin', (_req, res) => res.sendFile(path.join(rootDir, 'admin', 'index.html')));
app.use('/admin', express.static(path.join(rootDir, 'admin'), { index: false }));
app.use((req, res, next) => {
  const blocked = ['/server.js', '/package.json', '/package-lock.json', '/compose.yaml', '/.env', '/.env.example', '/Dockerfile'];
  if (blocked.includes(req.path) || req.path.startsWith('/data/') || req.path.startsWith('/.data/')) return res.status(404).end();
  next();
});
app.use(express.static(rootDir, { extensions: ['html'], dotfiles: 'deny', index: 'index.html' }));

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) return res.status(400).json({ error: error.code === 'LIMIT_FILE_SIZE' ? 'Görsel en fazla 5 MB olabilir.' : 'Görsel yüklenemedi.' });
  console.error(error);
  res.status(500).json({ error: 'Beklenmeyen bir sunucu hatası oluştu.' });
});

app.listen(port, () => console.log(`OzmenAgency running on http://localhost:${port}`));
