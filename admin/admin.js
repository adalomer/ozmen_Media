const state = { clients: [], editing: null };
const $ = selector => document.querySelector(selector);
const loginView = $('#loginView');
const dashboard = $('#dashboard');
const dialog = $('#clientDialog');
const form = $('#clientForm');
const preview = $('#imagePreview');
const placeholderImage = '/img/mascot.png';

async function api(url, options = {}) {
  const response = await fetch(url, { credentials: 'same-origin', ...options });
  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && !url.endsWith('/login')) showLogin();
    throw new Error(payload.error || 'İşlem tamamlanamadı.');
  }
  return payload;
}

function showLogin() {
  loginView.classList.remove('hidden');
  dashboard.classList.add('hidden');
}

function showDashboard() {
  loginView.classList.add('hidden');
  dashboard.classList.remove('hidden');
}

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove('show'), 2600);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

async function loadClients() {
  state.clients = await api('/api/admin/clients');
  render();
}

function render() {
  const query = $('#searchInput').value.trim().toLocaleLowerCase('tr');
  const filter = $('#statusFilter').value;
  const visible = state.clients.filter(client => {
    const matchesText = `${client.name} ${client.handle} ${client.categoryTr}`.toLocaleLowerCase('tr').includes(query);
    const matchesStatus = filter === 'all' || (filter === 'active' ? client.active : !client.active);
    return matchesText && matchesStatus;
  });
  $('#totalCount').textContent = state.clients.length;
  $('#activeCount').textContent = state.clients.filter(client => client.active).length;
  $('#passiveCount').textContent = state.clients.filter(client => !client.active).length;
  $('#emptyState').classList.toggle('hidden', visible.length > 0);
  $('#clientList').innerHTML = visible.map(client => `
    <article class="client-row" data-id="${escapeHtml(client.id)}">
      <div class="identity"><img src="${escapeHtml(client.imageUrl)}" alt=""><div><strong>${escapeHtml(client.name)}</strong><span>${escapeHtml(client.handle)} · ${escapeHtml(client.categoryTr || 'Kategori yok')}</span></div></div>
      <div class="followers">${escapeHtml(client.followers)}</div>
      <span class="status-pill ${client.active ? '' : 'passive'}">${client.active ? '● Aktif' : '● Pasif'}</span>
      <div class="row-actions">
        <button class="switch ${client.active ? 'on' : ''}" data-action="status" aria-label="${client.active ? 'Pasif yap' : 'Aktif yap'}" title="${client.active ? 'Pasif yap' : 'Aktif yap'}"></button>
        <button class="mini-button" data-action="edit" aria-label="Düzenle" title="Düzenle">✎</button>
        <button class="mini-button delete" data-action="delete" aria-label="Sil" title="Sil">×</button>
      </div>
    </article>`).join('');
}

function openDialog(client = null) {
  state.editing = client;
  form.reset();
  form.elements.id.value = client?.id || '';
  form.elements.name.value = client?.name || '';
  form.elements.handle.value = client?.handle || '';
  form.elements.followers.value = client?.followers || '';
  form.elements.instagramUrl.value = client?.instagramUrl || '';
  form.elements.categoryTr.value = client?.categoryTr || '';
  form.elements.categoryEn.value = client?.categoryEn || '';
  form.elements.order.value = client?.order ?? state.clients.length + 1;
  form.elements.active.checked = client?.active ?? true;
  form.elements.image.required = !client;
  preview.src = client?.imageUrl || placeholderImage;
  $('#dialogTitle').textContent = client ? 'Müşteriyi düzenle' : 'Yeni müşteri';
  $('#clientError').textContent = '';
  dialog.showModal();
}

function closeDialog() {
  if (dialog.open) dialog.close();
  state.editing = null;
}

$('#loginForm').addEventListener('submit', async event => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  const body = Object.fromEntries(new FormData(event.currentTarget));
  button.disabled = true;
  $('#loginError').textContent = '';
  try {
    await api('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    showDashboard();
    await loadClients();
  } catch (error) {
    $('#loginError').textContent = error.message;
  } finally {
    button.disabled = false;
  }
});

$('#logoutButton').addEventListener('click', async () => {
  await api('/api/admin/logout', { method: 'POST' }).catch(() => {});
  showLogin();
});
$('#addButton').addEventListener('click', () => openDialog());
$('#closeDialog').addEventListener('click', closeDialog);
$('#cancelDialog').addEventListener('click', closeDialog);
$('#searchInput').addEventListener('input', render);
$('#statusFilter').addEventListener('change', render);
$('#imageInput').addEventListener('change', event => {
  const file = event.target.files[0];
  if (file) preview.src = URL.createObjectURL(file);
});

$('#clientList').addEventListener('click', async event => {
  const button = event.target.closest('[data-action]');
  const row = event.target.closest('[data-id]');
  if (!button || !row) return;
  const client = state.clients.find(item => item.id === row.dataset.id);
  if (!client) return;
  if (button.dataset.action === 'edit') return openDialog(client);
  if (button.dataset.action === 'status') {
    button.disabled = true;
    try {
      const updated = await api(`/api/admin/clients/${encodeURIComponent(client.id)}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !client.active }) });
      Object.assign(client, updated);
      render();
      toast(updated.active ? 'Müşteri canlıda yayınlandı.' : 'Müşteri canlıdan kaldırıldı.');
    } catch (error) { toast(error.message); }
    return;
  }
  if (button.dataset.action === 'delete' && confirm(`${client.name} kalıcı olarak silinsin mi?`)) {
    try {
      await api(`/api/admin/clients/${encodeURIComponent(client.id)}`, { method: 'DELETE' });
      state.clients = state.clients.filter(item => item.id !== client.id);
      render();
      toast('Müşteri silindi.');
    } catch (error) { toast(error.message); }
  }
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  const saveButton = $('#saveButton');
  saveButton.disabled = true;
  saveButton.textContent = 'Kaydediliyor...';
  $('#clientError').textContent = '';
  try {
    const data = new FormData(form);
    data.set('active', String(form.elements.active.checked));
    if (!form.elements.image.files.length) data.delete('image');
    const id = form.elements.id.value;
    await api(id ? `/api/admin/clients/${encodeURIComponent(id)}` : '/api/admin/clients', { method: id ? 'PUT' : 'POST', body: data });
    closeDialog();
    await loadClients();
    toast(id ? 'Müşteri güncellendi.' : 'Yeni müşteri eklendi.');
  } catch (error) {
    $('#clientError').textContent = error.message;
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = 'Kaydet';
  }
});

dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });

(async function init() {
  try {
    await api('/api/admin/session');
    showDashboard();
    await loadClients();
  } catch {
    showLogin();
  }
})();
