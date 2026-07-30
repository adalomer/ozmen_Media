(function () {
  var grid = document.querySelector('.clients-grid');
  if (!grid) return;

  var isTurkish = document.documentElement.lang.toLowerCase().startsWith('tr') || /(^|\/)tr\.html$/.test(location.pathname);
  var instagramIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>';

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function createCard(client, index) {
    var card = element('a', 'client-card anim-pop' + (index % 4 ? ' delay-' + (index % 4) : ''));
    card.href = client.instagramUrl;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    var avatar = element('div', 'client-avatar');
    var image = element('img');
    image.src = client.imageUrl;
    image.alt = client.name;
    image.loading = 'lazy';
    image.onerror = function () { this.onerror = null; this.src = '/img/mascot.png'; };
    avatar.appendChild(image);

    var followers = element('div', 'client-followers');
    followers.appendChild(element('span', 'cf-num', client.followers));
    followers.appendChild(element('span', 'cf-text', isTurkish ? 'Takipçi' : 'Followers'));
    avatar.appendChild(followers);
    var instagram = element('div', 'client-instagram');
    instagram.innerHTML = instagramIcon;
    avatar.appendChild(instagram);

    var info = element('div', 'client-info');
    info.appendChild(element('span', 'client-name', client.handle));
    info.appendChild(element('span', 'client-category', (isTurkish ? client.categoryTr : client.categoryEn) || client.categoryTr || client.categoryEn || ''));
    card.appendChild(avatar);
    card.appendChild(info);
    return card;
  }

  fetch('/api/clients', { headers: { Accept: 'application/json' } })
    .then(function (response) { if (!response.ok) throw new Error('API unavailable'); return response.json(); })
    .then(function (clients) {
      var fragment = document.createDocumentFragment();
      clients.forEach(function (client, index) { fragment.appendChild(createCard(client, index)); });
      grid.replaceChildren(fragment);
      if (window.gsap && document.getElementById('preloader')?.classList.contains('done')) {
        gsap.to(grid.querySelectorAll('.anim-pop'), { opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(1.5)' });
      }
      if (window.ScrollTrigger) setTimeout(function () { ScrollTrigger.refresh(); }, 0);
    })
    .catch(function () {
      // Sunucu API'si geçici olarak erişilemezse HTML içindeki mevcut kartlar yedek olarak kalır.
    });
})();
