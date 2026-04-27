/* Özmen Media — Scroll-Driven Storytelling Animations
   GSAP + ScrollTrigger (CDN) — dontboardme.com style
*/

gsap.registerPlugin(ScrollTrigger);

// ========== PRELOADER ==========
var preloader = document.getElementById('preloader');
var progress = document.getElementById('preloaderProgress');
var loaded = 0;
var loadInterval = setInterval(function () {
	loaded += Math.random() * 30 + 10;
	if (loaded >= 100) { loaded = 100; clearInterval(loadInterval); }
	progress.style.width = loaded + '%';
	if (loaded >= 100) {
		setTimeout(function () {
			preloader.classList.add('done');
			runAnimations();
		}, 300);
	}
}, 120);

// ========== NAV ==========
var navbar = document.getElementById('navbar');
var lastScroll = 0;

window.addEventListener('scroll', function () {
	var current = window.scrollY;
	navbar.classList.toggle('scrolled', current > 80);
	if (current > 400 && current > lastScroll) {
		navbar.classList.add('hidden');
	} else {
		navbar.classList.remove('hidden');
	}
	lastScroll = current;
}, { passive: true });

// ========== MOBILE MENU ==========
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', function () {
	hamburger.classList.toggle('active');
	mobileMenu.classList.toggle('active');
});

document.querySelectorAll('.mobile-link').forEach(function (link, i) {
	link.style.transitionDelay = (i * 0.08) + 's';
	link.addEventListener('click', function () {
		hamburger.classList.remove('active');
		mobileMenu.classList.remove('active');
	});
});

// ========== WHATSAPP FAB ==========
var waBtn = document.getElementById('waBtn');
var waMenu = document.getElementById('waMenu');
var waOpen = false;

waBtn.addEventListener('click', function () {
	waOpen = !waOpen;
	waMenu.classList.toggle('active', waOpen);
});

document.addEventListener('click', function (e) {
	if (!e.target.closest('#waFab') && waOpen) {
		waOpen = false;
		waMenu.classList.remove('active');
	}
});

// ========== MAIN SCROLL ANIMATIONS ==========
function runAnimations() {

	// --- HERO PANEL entrance ---
	var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

	heroTl
		.to('#hero .reveal-up', { opacity: 1, y: 0, duration: 1, stagger: 0.15 })
		.to('#hero .reveal-scale', { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.4)' }, '-=0.6');

	// Blobs float
	gsap.utils.toArray('.bg-blob').forEach(function (blob, i) {
		gsap.to(blob, {
			x: (i % 2 === 0) ? 30 : -25,
			y: (i % 2 === 0) ? -20 : 25,
			duration: 5 + i * 1.5, yoyo: true, repeat: -1, ease: 'sine.inOut'
		});
	});

	// Hero parallax on scroll
	gsap.to('#hero .hero-text', {
		scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
		y: -80, opacity: 0.2
	});
	gsap.to('#hero .hero-illustration', {
		scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
		y: -40, opacity: 0.3
	});

	// --- STATS COUNTER ---
	document.querySelectorAll('.stat-number').forEach(function (el) {
		var target = parseInt(el.getAttribute('data-count'));
		ScrollTrigger.create({
			trigger: el,
			start: 'top 85%',
			once: true,
			onEnter: function () {
				gsap.to(el, {
					innerText: target, duration: 2, snap: { innerText: 1 },
					ease: 'power2.out',
					modifiers: { innerText: function (v) { return Math.round(v); } }
				});
			}
		});
	});

	gsap.to('.stats-inner', {
		scrollTrigger: { trigger: '.stats-bar', start: 'top 85%', once: true },
		opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.4)'
	});

	// --- PANEL-BY-PANEL REVEALS (dontboardme style) ---
	// Each .panel gets its children animated on scroll

	var panels = document.querySelectorAll('.panel:not(.hero-panel)');
	panels.forEach(function (panel) {

		// Reveal-up elements
		var revealUp = panel.querySelectorAll('.reveal-up');
		if (revealUp.length) {
			gsap.to(revealUp, {
				scrollTrigger: {
					trigger: panel,
					start: 'top 70%',
					end: 'top 20%',
					scrub: 0.8
				},
				opacity: 1, y: 0, stagger: 0.08
			});
		}

		// Reveal-left elements
		var revealLeft = panel.querySelectorAll('.reveal-left');
		if (revealLeft.length) {
			gsap.to(revealLeft, {
				scrollTrigger: {
					trigger: panel,
					start: 'top 70%',
					end: 'top 20%',
					scrub: 0.8
				},
				opacity: 1, x: 0, stagger: 0.08
			});
		}

		// Reveal-right elements
		var revealRight = panel.querySelectorAll('.reveal-right');
		if (revealRight.length) {
			gsap.to(revealRight, {
				scrollTrigger: {
					trigger: panel,
					start: 'top 70%',
					end: 'top 20%',
					scrub: 0.8
				},
				opacity: 1, x: 0, stagger: 0.08
			});
		}

		// Reveal-scale elements
		var revealScale = panel.querySelectorAll('.reveal-scale');
		if (revealScale.length) {
			gsap.to(revealScale, {
				scrollTrigger: {
					trigger: panel,
					start: 'top 70%',
					end: 'top 20%',
					scrub: 0.8
				},
				opacity: 1, scale: 1, stagger: 0.08
			});
		}
	});

	// --- PORTFOLIO CARDS special stagger ---
	gsap.utils.toArray('.p-card').forEach(function (card, i) {
		gsap.to(card, {
			scrollTrigger: { trigger: card, start: 'top 85%', once: true },
			opacity: 1, y: 0, duration: 0.7, delay: i * 0.12, ease: 'back.out(1.4)'
		});
	});

	// --- WHY CARDS bounce ---
	gsap.utils.toArray('.why-card').forEach(function (card, i) {
		gsap.to(card, {
			scrollTrigger: { trigger: card, start: 'top 85%', once: true },
			opacity: 1, y: 0, duration: 0.7, delay: i * 0.12, ease: 'back.out(1.4)'
		});
	});

	// --- TESTIMONIAL CARDS ---
	gsap.utils.toArray('.test-card').forEach(function (card, i) {
		gsap.to(card, {
			scrollTrigger: { trigger: card, start: 'top 85%', once: true },
			opacity: 1, y: 0, duration: 0.7, delay: i * 0.1, ease: 'back.out(1.4)'
		});
	});

	// --- SERVICE CHIPS sequential bounce ---
	gsap.utils.toArray('.service-chip').forEach(function (chip, i) {
		gsap.to(chip, {
			scrollTrigger: { trigger: chip, start: 'top 88%', once: true },
			opacity: 1, y: 0, duration: 0.5, delay: i * 0.06, ease: 'back.out(1.7)'
		});
	});

	// --- SMOOTH SCROLL LINKS ---
	document.querySelectorAll('a[href^="#"]').forEach(function (link) {
		link.addEventListener('click', function (e) {
			var target = document.querySelector(link.getAttribute('href'));
			if (target) {
				e.preventDefault();
				target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		});
	});

	// Refresh scroll triggers
	setTimeout(function () { ScrollTrigger.refresh(); }, 300);
}
