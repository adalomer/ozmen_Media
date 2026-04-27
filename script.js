/* Özmen Media — Scroll-Driven Animations
   GSAP + ScrollTrigger (CDN) — Native scroll only
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
			initAnimations();
		}, 300);
	}
}, 120);

// ========== NAVBAR ==========
var navbar = document.getElementById('navbar');

ScrollTrigger.create({
	start: 'top -80',
	onUpdate: function (self) {
		navbar.classList.toggle('scrolled', self.scroll() > 80);
		if (self.direction === 1 && self.scroll() > 400) {
			gsap.to(navbar, { y: -100, duration: 0.3, ease: 'power2.in' });
		} else {
			gsap.to(navbar, { y: 0, duration: 0.3, ease: 'power2.out' });
		}
	}
});

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

// ========== MAIN ANIMATIONS ==========
function initAnimations() {
	var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

	// Hero title lines
	tl.to('.title-line .line-inner', {
		y: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out'
	})
		.to('#heroBadge', { opacity: 1, y: 0, duration: 0.8 }, '-=0.8')
		.to('#heroDesc', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
		.to('#heroActions', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
		.to('#scrollIndicator', { opacity: 1, duration: 0.6 }, '-=0.3');

	// Floating cards bounce in
	gsap.utils.toArray('.hero-float').forEach(function (el, i) {
		gsap.from(el, { opacity: 0, scale: 0.5, duration: 0.8, delay: 1.2 + i * 0.15, ease: 'back.out(1.7)' });
	});

	// Blob gentle float
	gsap.utils.toArray('.blob').forEach(function (blob, i) {
		gsap.to(blob, {
			x: (i % 2 === 0) ? 30 : -25,
			y: (i % 2 === 0) ? -25 : 30,
			duration: 5 + i, yoyo: true, repeat: -1, ease: 'sine.inOut'
		});
	});

	// Hero parallax
	gsap.to('.hero-content', {
		scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
		y: -80, opacity: 0.3
	});

	// ========== STATS COUNTER ==========
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

	// ========== SECTION TAGS & TITLES ==========
	document.querySelectorAll('.section-tag').forEach(function (tag) {
		gsap.to(tag, {
			scrollTrigger: { trigger: tag, start: 'top 85%', once: true },
			opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)'
		});
	});

	document.querySelectorAll('.section-title .line-inner').forEach(function (line) {
		gsap.to(line, {
			scrollTrigger: { trigger: line, start: 'top 88%', once: true },
			opacity: 1, y: 0, duration: 1, ease: 'power4.out'
		});
	});

	// ========== BENTO CARDS ==========
	gsap.utils.toArray('[data-service]').forEach(function (card, i) {
		gsap.to(card, {
			scrollTrigger: { trigger: card, start: 'top 88%', once: true },
			opacity: 1, y: 0, duration: 0.7, delay: i * 0.08, ease: 'back.out(1.4)'
		});
	});

	// ========== PORTFOLIO HORIZONTAL SCROLL ==========
	var track = document.getElementById('portfolioTrack');
	if (track) {
		var trackWidth = track.scrollWidth;
		var viewWidth = window.innerWidth;

		gsap.to(track, {
			x: function () { return -(trackWidth - viewWidth + 48); },
			ease: 'none',
			scrollTrigger: {
				trigger: '#portfolio',
				start: 'top 10%',
				end: function () { return '+=' + (trackWidth - viewWidth); },
				scrub: 1.5,
				pin: true,
				anticipatePin: 1,
				invalidateOnRefresh: true
			}
		});
	}

	// ========== WHY US ==========
	gsap.utils.toArray('[data-why]').forEach(function (card, i) {
		gsap.to(card, {
			scrollTrigger: { trigger: card, start: 'top 88%', once: true },
			opacity: 1, y: 0, duration: 0.7, delay: i * 0.12, ease: 'back.out(1.4)'
		});
	});

	// ========== TESTIMONIALS ==========
	gsap.utils.toArray('[data-testimonial]').forEach(function (card, i) {
		gsap.to(card, {
			scrollTrigger: { trigger: card, start: 'top 88%', once: true },
			opacity: 1, y: 0, duration: 0.7, delay: i * 0.1, ease: 'back.out(1.4)'
		});
	});

	// ========== CTA ==========
	gsap.to('[data-cta]', {
		scrollTrigger: { trigger: '[data-cta]', start: 'top 80%', once: true },
		opacity: 1, y: 0, duration: 1, ease: 'power3.out'
	});

	// ========== SMOOTH SCROLL LINKS ==========
	document.querySelectorAll('a[href^="#"]').forEach(function (link) {
		link.addEventListener('click', function (e) {
			var target = document.querySelector(link.getAttribute('href'));
			if (target) {
				e.preventDefault();
				target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		});
	});

	setTimeout(function () { ScrollTrigger.refresh(); }, 300);
}
