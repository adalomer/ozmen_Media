# Özmen Media — Web Projesi Kapsamlı Geliştirme Yol Haritası
> Versiyon 2.0 · Nisan 2025 · Hazırlayan: Özmen Media Proje Ekibi

---

## İçindekiler

1. [Proje Özeti & Hedefler](#1-proje-özeti--hedefler)
2. [Marka Kimliği & Tasarım Dili](#2-marka-kimliği--tasarım-dili)
3. [Teknik Altyapı](#3-teknik-altyapı)
4. [Sayfa Mimarisi & Bileşen Detayları](#4-sayfa-mimarisi--bileşen-detayları)
5. [WhatsApp & İletişim Entegrasyonu](#5-whatsapp--iletişim-entegrasyonu)
6. [SEO & Performans Stratejisi](#6-seo--performans-stratejisi)
7. [Geliştirme Adımları (Sprint Planı)](#7-geliştirme-adımları-sprint-planı)
8. [Dosya & Klasör Yapısı](#8-dosya--klasör-yapısı)
9. [Komponent Kodu Örnekleri](#9-komponent-kodu-örnekleri)
10. [Yayın & Bakım Süreci](#10-yayın--bakım-süreci)
11. [Kontrol Listesi (Pre-Launch Checklist)](#11-kontrol-listesi-pre-launch-checklist)

---

## 1. Proje Özeti & Hedefler

### Ne İnşa Ediyoruz?

**Özmen Media** için Instagram ve Facebook sosyal medya destek hizmetlerini sergileyen, potansiyel müşterileri doğrudan WhatsApp'a yönlendiren, tek sayfalık (Single Page Application) bir landing page.

### Başarı Kriterleri

| Kriter | Hedef | Ölçüm Yöntemi |
|---|---|---|
| Sayfa Yükleme Süresi | < 1.5 saniye (LCP) | Google PageSpeed Insights |
| Mobil Uyumluluk Skoru | 95+ / 100 | Lighthouse |
| SEO Skoru | 90+ / 100 | Lighthouse |
| WhatsApp Tıklama Oranı | %8–12 | Google Analytics (Event) |
| Bounce Rate | < %55 | Google Analytics |

### Hedef Kitle

- **Birincil:** Küçük ve orta ölçekli işletme sahipleri (KOBİ), Instagram/Facebook reklamlarında zorlanan bireysel girişimciler
- **İkincil:** Sosyal medya varlığını profesyonelleştirmek isteyen markalar

---

## 2. Marka Kimliği & Tasarım Dili

### 2.1 Renk Paleti

```css
/* globals.css */
:root {
  /* Arka planlar */
  --bg-primary:    #0A0F1E;   /* En koyu — ana arka plan (Midnight Navy) */
  --bg-secondary:  #0F1629;   /* Bölüm arka planları */
  --bg-card:       #131D35;   /* Kart arka planları */
  --bg-card-hover: #192240;   /* Kart hover durumu */

  /* Vurgu renkleri */
  --accent-blue:   #3B82F6;   /* Elektrik mavisi — CTA, linkler */
  --accent-violet: #7C3AED;   /* Mor — gradient için */
  --accent-cyan:   #06B6D4;   /* Cyan — ikon vurguları */
  --accent-glow:   rgba(59, 130, 246, 0.15); /* Parlama efekti */

  /* Metin renkleri */
  --text-primary:   #F8FAFC;  /* Ana metin */
  --text-secondary: #94A3B8;  /* İkincil metin */
  --text-muted:     #475569;  /* Soluk metin */

  /* Kenarlıklar */
  --border-subtle:  rgba(148, 163, 184, 0.08);
  --border-default: rgba(148, 163, 184, 0.15);
  --border-accent:  rgba(59, 130, 246, 0.3);
}
```

### 2.2 Tipografi Sistemi

```css
/* Font kurulumu — layout.js içinde */
import { Outfit, DM_Sans } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500'],
});

/*
  Kullanım kuralları:
  - Başlıklar (H1, H2, H3): font-display, weight 700-800
  - Gövde metni: font-body, weight 400
  - Öne çıkan rakamlar / istatistikler: font-display, weight 800
  - Buton metinleri: font-display, weight 600
*/
```

### 2.3 Efekt Kütüphanesi

#### Glassmorphism Kart
```css
.glass-card {
  background: rgba(19, 29, 53, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-default);
  border-radius: 16px;
}
```

#### Glow (Parlama) Efekti
```css
.glow-blue {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2),
              0 0 60px rgba(59, 130, 246, 0.05);
}

.glow-violet {
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.2),
              0 0 60px rgba(124, 58, 237, 0.05);
}
```

#### Gradient Metin
```css
.gradient-text {
  background: linear-gradient(135deg, #3B82F6 0%, #7C3AED 50%, #06B6D4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 3. Teknik Altyapı

### 3.1 Tech Stack

| Katman | Teknoloji | Versiyon | Açıklama |
|---|---|---|---|
| Framework | Next.js | 15.x (App Router) | RSC desteği, otomatik optimizasyon |
| Styling | Tailwind CSS | 3.4.x | Utility-first CSS |
| UI Kit | Shadcn/UI | Latest | Özelleştirilebilir bileşenler |
| Animasyon | Framer Motion | 11.x | Yüksek performanslı animasyonlar |
| İkonlar | Lucide React | Latest | Minimalist ikon seti |
| Font | Google Fonts (next/font) | — | Outfit + DM Sans |
| Deploy | Vercel | — | Otomatik CI/CD |
| Analytics | Vercel Analytics + GA4 | — | Tıklama takibi |

### 3.2 Paket Kurulumu

```bash
# 1. Proje oluşturma
npx create-next-app@latest ozmen-media \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd ozmen-media

# 2. Gerekli paketler
npm install framer-motion lucide-react clsx tailwind-merge

# 3. Shadcn/UI kurulumu
npx shadcn-ui@latest init

# 4. Shadcn bileşenleri
npx shadcn-ui@latest add button badge card separator
```

### 3.3 Tailwind Konfigürasyonu

```js
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   '#0A0F1E',
          secondary: '#0F1629',
          card:      '#131D35',
        },
        accent: {
          blue:   '#3B82F6',
          violet: '#7C3AED',
          cyan:   '#06B6D4',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
      },
      animation: {
        'float':      'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59,130,246,0.2)' },
          '50%':      { boxShadow: '0 0 40px rgba(59,130,246,0.5)' },
        },
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient':    'radial-gradient(at 0% 0%, #3B82F620 0px, transparent 50%), radial-gradient(at 100% 100%, #7C3AED20 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 4. Sayfa Mimarisi & Bileşen Detayları

### 4.1 Genel Sayfa Akışı

```
┌─────────────────────────────────────┐
│           <Navbar />                │  — Sticky, blur backdrop
├─────────────────────────────────────┤
│           <HeroSection />           │  — Güçlü mesaj + CTA
├─────────────────────────────────────┤
│           <StatsBar />              │  — 3–4 anahtar rakam
├─────────────────────────────────────┤
│           <ServicesGrid />          │  — Bento grid hizmetler
├─────────────────────────────────────┤
│           <WhyUs />                 │  — Güven öğeleri
├─────────────────────────────────────┤
│           <Testimonials />          │  — Referanslar (statik)
├─────────────────────────────────────┤
│           <CTABanner />             │  — Son çağrı aksiyonu
├─────────────────────────────────────┤
│           <Footer />                │
└─────────────────────────────────────┘
│        <WhatsAppButton />           │  — Fixed, sağ alt köşe
```

---

### 4.2 Navbar

**Özellikler:**
- Sayfanın üstünde şeffaf, scroll sonrası `backdrop-blur` ile koyulaşır
- Logo solda, sağda tek CTA butonu: "Bize Ulaşın"
- Mobilde hamburger menü (Shadcn Sheet bileşeni)

```tsx
// src/components/Navbar.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg-primary/80 backdrop-blur-lg border-b border-white/5'
          : 'bg-transparent'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <span className="font-display font-700 text-xl text-white">
          Özmen<span className="text-accent-blue">Media</span>
        </span>
        <Link
          href="https://wa.me/905XXXXXXXXX?text=Merhaba,%20sosyal%20medya%20desteği%20hakkında%20bilgi%20almak%20istiyorum."
          target="_blank"
          className="bg-accent-blue hover:bg-blue-500 text-white text-sm font-display font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
        >
          Bize Ulaşın →
        </Link>
      </div>
    </motion.nav>
  );
}
```

---

### 4.3 Hero Section

**Tasarım Kararları:**
- Tam ekran yükseklik (`min-h-screen`)
- Arka planda animasyonlu mesh gradient (CSS, performanslı)
- Başlık: büyük, gradient, animasyonlu giriş
- Alt başlık: daha soluk, kısa ve net
- İki CTA: WhatsApp (birincil) + "Hizmetleri Gör" (ikincil)
- Hero altında sosyal kanıt: "50+ Müşteri · %98 Memnuniyet"

```tsx
// src/components/HeroSection.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const WA_LINK = "https://wa.me/905XXXXXXXXX?text=Merhaba,%20bilgi%20almak%20istiyorum.";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary">

      {/* Arka plan mesh gradient */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-60 pointer-events-none" />

      {/* Animasyonlu daire efektleri */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-violet/10 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">

        {/* Üst rozet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-sm px-4 py-1.5 rounded-full mb-8"
        >
          <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-pulse" />
          Instagram & Facebook Uzmanı
        </motion.div>

        {/* Ana başlık */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6"
        >
          Sosyal Medya{' '}
          <span className="gradient-text">Gücünüzü</span>
          <br />
          Yeniden Tanımlayın.
        </motion.h1>

        {/* Alt başlık */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Instagram ve Facebook yönetimini profesyonellere bırakın.
          Hesap güvenliğinden reklam optimizasyonuna, her adımda yanınızdayız.
        </motion.p>

        {/* CTA Butonları */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href={WA_LINK}
            target="_blank"
            className="flex items-center gap-3 bg-accent-blue hover:bg-blue-500 text-white font-display font-semibold px-8 py-4 rounded-full text-base transition-all duration-200 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M17.472 14.382..."/> {/* WhatsApp SVG path */}
            </svg>
            WhatsApp ile Hemen Ulaşın
          </Link>
          <a
            href="#hizmetler"
            className="text-slate-400 hover:text-white font-display font-medium px-6 py-4 rounded-full border border-white/10 hover:border-white/20 transition-all duration-200 w-full sm:w-auto text-center text-base"
          >
            Hizmetlerimizi Keşfedin ↓
          </a>
        </motion.div>

        {/* Sosyal kanıt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex items-center justify-center gap-6 text-sm text-slate-500"
        >
          <span>✦ 50+ Mutlu Müşteri</span>
          <span className="w-1 h-1 bg-slate-600 rounded-full" />
          <span>✦ %98 Memnuniyet Oranı</span>
          <span className="w-1 h-1 bg-slate-600 rounded-full" />
          <span>✦ 7/24 Destek</span>
        </motion.div>
      </div>
    </section>
  );
}
```

---

### 4.4 Stats Bar (İstatistik Şeridi)

Hızlı güven oluşturmak için sayısal veriler.

```tsx
const stats = [
  { value: '50+',   label: 'Aktif Müşteri' },
  { value: '200+',  label: 'Çözülen Sorun' },
  { value: '7/24',  label: 'Teknik Destek' },
  { value: '%98',   label: 'Memnuniyet' },
];
```

**Tasarım:** Koyu kart içinde, ortada ince dikey ayırıcı çizgiler. Mobilde 2×2 grid.

---

### 4.5 Services Grid (Bento Grid — Hizmetler)

**Bento Grid Düzeni (masaüstü):**

```
┌────────────────────┬───────────┬───────────┐
│                    │  Hesap    │  Reklam   │
│  Instagram Destek  │  Güvenlik │  Yönetimi │
│  (büyük kart)      ├───────────┤           │
│                    │  Etkileş. ├───────────┤
│                    │  Artırma  │  Analitik │
├───────────┬────────┴───────────┴───────────┤
│  Facebook │                                │
│  Yönetim  │   Özel Stratejik Danışmanlık   │
│           │   (geniş kart)                 │
└───────────┴────────────────────────────────┘
```

**Her Kart İçeriği:**

```tsx
const services = [
  {
    id: 'instagram',
    icon: 'Instagram',
    title: 'Instagram Destek',
    description: 'Hesabınızın tüm teknik sorunlarını çözüyor, büyümenizi hızlandırıyoruz.',
    features: ['Hesap kurtarma', 'Güvenlik ayarları', 'Shadowban temizleme'],
    color: 'from-pink-500 to-purple-600',
    size: 'large', // CSS grid: col-span-2
  },
  {
    id: 'security',
    icon: 'Shield',
    title: 'Hesap Güvenliği',
    description: '2FA kurulumu ve phishing koruması.',
    color: 'from-blue-500 to-cyan-500',
    size: 'small',
  },
  {
    id: 'ads',
    icon: 'TrendingUp',
    title: 'Reklam Yönetimi',
    description: 'Meta Ads optimizasyonu ile dönüşüm oranınızı artırın.',
    color: 'from-violet-500 to-purple-600',
    size: 'small',
  },
  {
    id: 'engagement',
    icon: 'Heart',
    title: 'Etkileşim Artırma',
    description: 'Organik büyüme stratejileri ve içerik planlaması.',
    color: 'from-orange-500 to-pink-500',
    size: 'small',
  },
  {
    id: 'facebook',
    icon: 'Facebook',
    title: 'Facebook Yönetimi',
    description: 'Sayfa yönetimi ve Business Suite kurulumu.',
    color: 'from-blue-600 to-blue-400',
    size: 'small',
  },
  {
    id: 'consulting',
    icon: 'Lightbulb',
    title: 'Stratejik Danışmanlık',
    description: 'Markanıza özel büyüme haritası ve rekabet analizi.',
    color: 'from-emerald-500 to-teal-500',
    size: 'wide', // CSS grid: col-span-2
  },
];
```

---

### 4.6 Why Us (Neden Özmen Media?)

**3 sütunlu kart düzeni**, her birinde büyük ikon, başlık ve kısa açıklama:

```tsx
const reasons = [
  {
    icon: 'Zap',
    title: 'Hızlı Çözüm',
    description: 'Ortalama 2 saat içinde ilk geri dönüş. Acil sorunlarda anında müdahale.',
    highlight: '< 2 saat',
  },
  {
    icon: 'Clock',
    title: '7/24 Destek',
    description: 'WhatsApp üzerinden gece gündüz ulaşabilir, sorularınızı sorabilirsiniz.',
    highlight: 'Her an yanınızda',
  },
  {
    icon: 'Eye',
    title: 'Şeffaf Süreç',
    description: 'Yaptığımız her adımı size bildiriyor, sizi sürecin içinde tutuyoruz.',
    highlight: 'Sıfır gizem',
  },
];
```

---

### 4.7 Testimonials (Referanslar — Statik)

```tsx
const testimonials = [
  {
    name: 'Ayşe Kaya',
    role: 'Butik Sahibi',
    avatar: 'AK',
    content: 'Instagram hesabım çalınmıştı, Özmen Media sayesinde 6 saatte geri aldım. Müthiş destek!',
    rating: 5,
  },
  {
    name: 'Mehmet Yılmaz',
    role: 'E-ticaret Girişimcisi',
    avatar: 'MY',
    content: 'Facebook reklam hesabım askıya alınmıştı. Profesyonel yaklaşımlarıyla sorunu çözdüler.',
    rating: 5,
  },
  {
    name: 'Selin Arslan',
    role: 'İçerik Üreticisi',
    avatar: 'SA',
    content: 'Shadowban sorunum 3 günde çözüldü. Artık erişimim %300 arttı. Kesinlikle tavsiye ederim.',
    rating: 5,
  },
];
```

**Tasarım:** Yatay kaydırmalı (scroll snap) kart listesi. Mobilde harika görünür.

---

### 4.8 CTA Banner

Sayfanın en altında güçlü bir kapanış:

```tsx
// Gradient arka plan, büyük metin, WhatsApp butonu
<section className="relative py-24 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 via-accent-violet/20 to-accent-cyan/20" />
  <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
    <h2 className="font-display text-4xl font-bold text-white mb-4">
      Sosyal Medyada Fark Yaratmaya Hazır Mısınız?
    </h2>
    <p className="text-slate-400 mb-8">
      İlk danışma tamamen ücretsiz. Hemen yazın, sorunuzu yanıtlayalım.
    </p>
    <Link href={WA_LINK} className="...">
      Ücretsiz Danışma Al
    </Link>
  </div>
</section>
```

---

## 5. WhatsApp & İletişim Entegrasyonu

### 5.1 Dinamik Mesaj Linkleri

Sayfanın farklı yerlerinden farklı ön tanımlı mesajlarla kullanıcı yönlendirmesi:

```ts
// src/lib/whatsapp.ts
const PHONE = '905XXXXXXXXX';

export const WA_LINKS = {
  general:   `https://wa.me/${PHONE}?text=${encodeURIComponent('Merhaba, sosyal medya desteği hakkında bilgi almak istiyorum.')}`,
  instagram: `https://wa.me/${PHONE}?text=${encodeURIComponent('Merhaba, Instagram desteği hakkında bilgi almak istiyorum.')}`,
  facebook:  `https://wa.me/${PHONE}?text=${encodeURIComponent('Merhaba, Facebook desteği hakkında bilgi almak istiyorum.')}`,
  urgent:    `https://wa.me/${PHONE}?text=${encodeURIComponent('Acil! Hesabımla ilgili kritik bir sorun yaşıyorum, yardım lazım.')}`,
  free:      `https://wa.me/${PHONE}?text=${encodeURIComponent('Merhaba, ücretsiz danışma hakkında bilgi almak istiyorum.')}`,
};
```

### 5.2 Sabit WhatsApp Butonu (Floating)

```tsx
// src/components/WhatsAppFAB.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { WA_LINKS } from '@/lib/whatsapp';
import Link from 'next/link';

export default function WhatsAppFAB() {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    { label: 'Instagram Destek', href: WA_LINKS.instagram },
    { label: 'Facebook Destek',  href: WA_LINKS.facebook },
    { label: '⚡ Acil Destek',   href: WA_LINKS.urgent },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Hızlı eylem menüsü */}
      <AnimatePresence>
        {isOpen && quickActions.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={action.href}
              target="_blank"
              className="flex items-center gap-2 bg-bg-card border border-border-default text-white text-sm px-4 py-2 rounded-full shadow-xl hover:border-accent-blue/50 transition-all"
            >
              {action.label}
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Ana buton */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 transition-all duration-200 animate-pulse-glow"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        aria-label="WhatsApp ile İletişim"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          {/* WhatsApp SVG path buraya */}
        </svg>
      </motion.button>
    </div>
  );
}
```

---

## 6. SEO & Performans Stratejisi

### 6.1 Metadata (layout.js)

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Özmen Media | Instagram & Facebook Sosyal Medya Desteği',
  description: 'Instagram hesap kurtarma, Facebook sayfa yönetimi ve sosyal medya reklam optimizasyonu. 7/24 profesyonel destek. WhatsApp ile hemen iletişime geçin.',
  keywords: [
    'instagram destek', 'facebook sayfa yönetimi', 'sosyal medya ajansı',
    'instagram hesap kurtarma', 'meta reklam yönetimi', 'sosyal medya danışmanlık',
  ],
  openGraph: {
    title: 'Özmen Media | Sosyal Medya Uzmanı',
    description: 'Instagram ve Facebook sorunlarınız için profesyonel destek.',
    type: 'website',
    locale: 'tr_TR',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Özmen Media | Sosyal Medya Desteği',
    description: '7/24 Instagram & Facebook destek hizmeti.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};
```

### 6.2 Performans Tavsiyeleri

| Konu | Önlem |
|---|---|
| Görseller | `next/image` bileşeni ile `.webp` formatı, otomatik lazy loading |
| Fontlar | `next/font/google` ile font-display: swap |
| Animasyonlar | `will-change: transform` sadece animasyon süresince |
| Kritik CSS | Tailwind JIT sadece kullanılan class'ları üretir |
| Bundle | `next/dynamic` ile büyük bileşenleri lazy load et |
| Core Web Vitals | LCP < 2.5s, FID < 100ms, CLS < 0.1 hedefi |

---

## 7. Geliştirme Adımları (Sprint Planı)

### Sprint 1 — Altyapı Kurulumu (1 gün)

- [ ] `create-next-app` ile proje oluştur
- [ ] Tailwind renk paletini ve konfigürasyonu ayarla
- [ ] Google Fonts entegrasyonu (Outfit + DM Sans)
- [ ] CSS değişkenlerini `globals.css`'e ekle
- [ ] Shadcn/UI kurulumu
- [ ] Temel klasör yapısını oluştur
- [ ] Vercel'e bağla, preview URL al

### Sprint 2 — Bileşen Geliştirme (2–3 gün)

- [ ] Navbar bileşeni (sticky + scroll efekti)
- [ ] HeroSection (animasyonlu başlık + CTA)
- [ ] StatsBar (sayaç animasyonu)
- [ ] ServicesGrid (Bento layout)
- [ ] WhyUs bölümü
- [ ] Testimonials (scroll carousel)
- [ ] CTABanner
- [ ] Footer

### Sprint 3 — Entegrasyonlar & Cila (1 gün)

- [ ] WhatsApp FAB bileşeni
- [ ] Tüm WhatsApp linkleri doğrula
- [ ] Framer Motion giriş animasyonları (stagger)
- [ ] Scroll reveal efektleri (`useInView`)
- [ ] Smooth scroll (`scroll-behavior: smooth`)

### Sprint 4 — Test & Yayın (1 gün)

- [ ] Lighthouse audit (her kategoride 90+)
- [ ] Mobil cihaz testleri (iPhone, Android)
- [ ] Çapraz tarayıcı testi (Chrome, Safari, Firefox)
- [ ] SEO meta etiketleri kontrol
- [ ] WhatsApp link testleri
- [ ] Google Analytics 4 kurulumu
- [ ] Production deploy → custom domain bağla

---

## 8. Dosya & Klasör Yapısı

```
ozmen-media/
├── public/
│   ├── og-image.png          # Open Graph görseli (1200×630)
│   ├── favicon.ico
│   └── icons/
│       └── whatsapp.svg
│
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout + metadata
│   │   ├── page.tsx           # Ana sayfa
│   │   └── globals.css        # CSS değişkenleri + reset
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── StatsBar.tsx
│   │   │   ├── ServicesGrid.tsx
│   │   │   ├── WhyUs.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── CTABanner.tsx
│   │   │
│   │   └── ui/
│   │       ├── WhatsAppFAB.tsx
│   │       ├── ServiceCard.tsx
│   │       └── AnimatedCounter.tsx
│   │
│   └── lib/
│       ├── whatsapp.ts        # WhatsApp link yönetimi
│       └── utils.ts           # clsx + tailwind-merge
│
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 9. Komponent Kodu Örnekleri

### AnimatedCounter (Sayaç Animasyonu)

```tsx
// src/components/ui/AnimatedCounter.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface Props {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export default function AnimatedCounter({ value, suffix = '', prefix = '', duration = 2000 }: Props) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="font-display font-extrabold text-4xl text-white">
      {prefix}{display}{suffix}
    </span>
  );
}
```

### Scroll Reveal Wrapper

```tsx
// src/components/ui/RevealOnScroll.tsx
'use client';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function RevealOnScroll({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 10. Yayın & Bakım Süreci

### Vercel Deploy

```bash
# Vercel CLI ile yayınlama
npm install -g vercel
vercel login
vercel --prod

# Ya da GitHub repo bağlantısı:
# vercel.com → New Project → GitHub repo seç → Deploy
```

### Çevre Değişkenleri (Vercel Dashboard)

```env
NEXT_PUBLIC_WA_PHONE=905XXXXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Bakım Takvimi

| Frekans | Görev |
|---|---|
| Haftalık | Google Analytics raporunu incele, WhatsApp link testleri |
| Aylık | Lighthouse skoru kontrol, içerik güncelleme (testimonials) |
| 3 Ayda bir | Paket güncellemeleri (`npm update`), güvenlik denetimi |

---

## 11. Kontrol Listesi (Pre-Launch Checklist)

### Teknik
- [ ] Lighthouse: Performance 90+, SEO 90+, Accessibility 85+
- [ ] Tüm sayfalar HTTPS
- [ ] 404 sayfası mevcut
- [ ] `robots.txt` oluşturuldu
- [ ] `sitemap.xml` oluşturuldu (`next-sitemap`)
- [ ] Open Graph görseli (og-image.png) test edildi

### İçerik
- [ ] WhatsApp numarası doğru ve aktif
- [ ] Tüm WhatsApp linkleri çalışıyor
- [ ] İletişim metinleri doğru
- [ ] Testimonial isimleri ve içerikler onaylandı

### Tasarım
- [ ] Mobil (320px–768px) → sorunsuz
- [ ] Tablet (768px–1024px) → sorunsuz
- [ ] Masaüstü (1024px+) → sorunsuz
- [ ] Dark mode tam destek
- [ ] Animasyonlar `prefers-reduced-motion` senaryosunda devre dışı

### Analitik
- [ ] Google Analytics 4 kurulu ve veri alıyor
- [ ] WhatsApp buton tıklamaları event olarak izleniyor
- [ ] Vercel Analytics aktif

---

*Özmen Media Web Projesi Yol Haritası v2.0 — nisan 2026*