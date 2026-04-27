/* ===============================================
   ÖZMEN MEDIA — SCROLL STORY ANIMATIONS
   Unique, playful, cartoon feel
   =============================================== */
gsap.registerPlugin(ScrollTrigger);

/* --- PRELOADER --- */
var pre = document.getElementById('preloader');
var fill = document.getElementById('preloaderFill');
var loaded = 0;
var preInt = setInterval(function () {
	loaded += Math.random() * 25 + 8;
	if (loaded >= 100) { loaded = 100; clearInterval(preInt) }
	fill.style.width = loaded + '%';
	if (loaded >= 100) setTimeout(function () { pre.classList.add('done'); startAnimations() }, 400);
}, 100);

/* --- NAVBAR --- */
var nav = document.getElementById('navbar');
var lastY = 0;
window.addEventListener('scroll', function () {
	var y = window.scrollY;
	nav.classList.toggle('scrolled', y > 80);
	nav.classList.toggle('hide', y > 400 && y > lastY);
	lastY = y;
}, { passive: true });

/* --- HAMBURGER --- */
var ham = document.getElementById('hamburger');
var mob = document.getElementById('mobMenu');
ham.addEventListener('click', function () { ham.classList.toggle('active'); mob.classList.toggle('active') });
document.querySelectorAll('.mob-link').forEach(function (l, i) {
	l.style.transitionDelay = i * 0.08 + 's';
	l.addEventListener('click', function () { ham.classList.remove('active'); mob.classList.remove('active') });
});

/* --- WA FAB --- */
var waBtn = document.getElementById('waBtn');
var waMenu = document.getElementById('waMenu');
var waOn = false;
waBtn.addEventListener('click', function () { waOn = !waOn; waMenu.classList.toggle('active', waOn) });
document.addEventListener('click', function (e) { if (!e.target.closest('#waFab') && waOn) { waOn = false; waMenu.classList.remove('active') } });

/* --- FIXED MASCOT parallax (subtle Y shift based on scroll) --- */
var mascot = document.getElementById('fixedMascot');
var rocket = document.getElementById('fixedRocket');

window.addEventListener('scroll', function () {
	var y = window.scrollY;
	var max = document.body.scrollHeight - window.innerHeight;
	var pct = y / max;
	// Mascot subtly rises as you scroll
	mascot.style.transform = 'translateY(' + (-pct * 60) + 'px)';
	// Mascot fades slightly in middle of page, returns at bottom
	var fade = 1 - Math.sin(pct * Math.PI) * 0.4;
	mascot.style.opacity = fade;
}, { passive: true });

/* ==========================
   MAIN ANIMATIONS
   ========================== */
function startAnimations() {

	// --- HERO ENTRANCE (staggered, bouncy) ---
	var heroTl = gsap.timeline({ defaults: { ease: 'back.out(1.6)' } });
	heroTl
		.to('#hero .rv-up', { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 })
		.to('#hero .rv-scale', { opacity: 1, scale: 1, duration: 1.1, ease: 'elastic.out(1,0.5)' }, '-=0.5');

	// --- FLOATING BADGES bounce in ---
	gsap.utils.toArray('.float-badge').forEach(function (b, i) {
		gsap.fromTo(b,
			{ opacity: 0, scale: 0, rotation: -15 },
			{ opacity: 1, scale: 1, rotation: 0, duration: 0.6, delay: 1 + i * 0.2, ease: 'back.out(2)' }
		);
		// Continuous gentle float
		gsap.to(b, {
			y: (i % 2 === 0) ? -10 : 8,
			x: (i % 2 === 0) ? 6 : -5,
			duration: 2.5 + i * 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut',
			delay: 1.5 + i * 0.2
		});
	});

	// --- BLOBS gentle drift ---
	gsap.utils.toArray('.bg-blob').forEach(function (b, i) {
		gsap.to(b, {
			x: (i % 2 === 0) ? 35 : -30, y: (i % 2 === 0) ? -25 : 30,
			duration: 6 + i * 2, yoyo: true, repeat: -1, ease: 'sine.inOut'
		});
	});

	// --- HERO PARALLAX fading on scroll (text+illustration) ---
	gsap.to('#hero .hero-text', {
		scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
		y: -100, opacity: 0
	});
	gsap.to('#hero .hero-illust', {
		scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
		y: -50, opacity: 0
	});

	// --- STATS COUNTER ---
	gsap.to('.stats-card', {
		scrollTrigger: { trigger: '.stats-strip', start: 'top 85%', once: true },
		opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.4)'
	});
	document.querySelectorAll('.stat-num').forEach(function (el) {
		var t = parseInt(el.getAttribute('data-count'));
		ScrollTrigger.create({
			trigger: el, start: 'top 85%', once: true, onEnter: function () {
				gsap.to(el, {
					innerText: t, duration: 1.8, snap: { innerText: 1 }, ease: 'power2.out',
					modifiers: { innerText: function (v) { return Math.round(v) } }
				});
			}
		});
	});

	// ========== SCROLL-DRIVEN PANEL REVEALS ==========
	// Each panel's elements animate as you scroll into view (scrub)
	document.querySelectorAll('.panel:not(.hero)').forEach(function (panel) {

		// rv-up: slide up and fade in
		var ups = panel.querySelectorAll('.rv-up');
		if (ups.length) {
			gsap.to(ups, {
				scrollTrigger: { trigger: panel, start: 'top 75%', end: 'top 25%', scrub: 0.6 },
				opacity: 1, y: 0, stagger: 0.06
			});
		}

		// rv-left: slide from left
		var lefts = panel.querySelectorAll('.rv-left');
		if (lefts.length) {
			gsap.to(lefts, {
				scrollTrigger: { trigger: panel, start: 'top 75%', end: 'top 25%', scrub: 0.6 },
				opacity: 1, x: 0, stagger: 0.06
			});
		}

		// rv-right: slide from right
		var rights = panel.querySelectorAll('.rv-right');
		if (rights.length) {
			gsap.to(rights, {
				scrollTrigger: { trigger: panel, start: 'top 75%', end: 'top 25%', scrub: 0.6 },
				opacity: 1, x: 0, stagger: 0.06
			});
		}

		// rv-scale: scale up
		var scales = panel.querySelectorAll('.rv-scale');
		if (scales.length) {
			gsap.to(scales, {
				scrollTrigger: { trigger: panel, start: 'top 75%', end: 'top 25%', scrub: 0.6 },
				opacity: 1, scale: 1, stagger: 0.06
			});
		}

		// rv-rotate: rotate in
		var rots = panel.querySelectorAll('.rv-rotate');
		if (rots.length) {
			gsap.to(rots, {
				scrollTrigger: { trigger: panel, start: 'top 75%', end: 'top 25%', scrub: 0.6 },
				opacity: 1, rotation: 0, scale: 1, stagger: 0.06
			});
		}
	});

	// --- PORTFOLIO CARDS special entrance with tilt ---
	gsap.utils.toArray('.p-card').forEach(function (c, i) {
		gsap.fromTo(c,
			{ opacity: 0, y: 50, rotation: i % 2 === 0 ? -3 : 3 },
			{
				opacity: 1, y: 0, rotation: 0, duration: 0.7, delay: i * 0.1, ease: 'back.out(1.5)',
				scrollTrigger: { trigger: c, start: 'top 88%', once: true }
			}
		);
	});

	// --- SERVICE PILLS pop in stagger ---
	gsap.utils.toArray('.svc-pill').forEach(function (p, i) {
		gsap.fromTo(p,
			{ opacity: 0, scale: 0.7, y: 20 },
			{
				opacity: 1, scale: 1, y: 0, duration: 0.4, delay: i * 0.06, ease: 'back.out(2)',
				scrollTrigger: { trigger: p, start: 'top 90%', once: true }
			}
		);
	});

	// --- WHY CARDS bounce in ---
	gsap.utils.toArray('.w-card').forEach(function (c, i) {
		gsap.fromTo(c,
			{ opacity: 0, y: 40, scale: 0.9 },
			{
				opacity: 1, y: 0, scale: 1, duration: 0.6, delay: i * 0.1, ease: 'back.out(1.6)',
				scrollTrigger: { trigger: c, start: 'top 85%', once: true }
			}
		);
	});

	// --- SMOOTH ANCHOR SCROLL ---
	document.querySelectorAll('a[href^="#"]').forEach(function (a) {
		a.addEventListener('click', function (e) {
			var t = document.querySelector(a.getAttribute('href'));
			if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
		});
	});

	setTimeout(function () { ScrollTrigger.refresh() }, 300);
}
