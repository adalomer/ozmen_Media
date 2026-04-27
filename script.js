/* Özmen Media — Scroll-Driven Animations
   GSAP + ScrollTrigger + Lenis (loaded via CDN)
*/

gsap.registerPlugin(ScrollTrigger);

// ========== LENIS SMOOTH SCROLL ==========
const lenis = new Lenis({ duration: 1.2, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// ========== PRELOADER ==========
var preloader = document.getElementById('preloader');
var progress = document.getElementById('preloaderProgress');
var loaded = 0;
var loadInterval = setInterval(function () {
	loaded += Math.random() * 25 + 5;
	if (loaded >= 100) { loaded = 100; clearInterval(loadInterval); }
	progress.style.width = loaded + '%';
	if (loaded >= 100) {
		setTimeout(function () {
			preloader.classList.add('done');
			initAnimations();
		}, 400);
	}
}, 150);

// ========== CUSTOM CURSOR ==========
var cursor = document.getElementById('cursor');
var follower = document.getElementById('cursorFollower');
var cx = 0, cy = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', function (e) {
	cx = e.clientX; cy = e.clientY;
	cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
});

function updateFollower() {
	fx += (cx - fx) * 0.12; fy += (cy - fy) * 0.12;
	follower.style.left = fx + 'px'; follower.style.top = fy + 'px';
	requestAnimationFrame(updateFollower);
}
updateFollower();

document.querySelectorAll('a, button, .bento-card, .portfolio-card, .why-card, .testimonial-card').forEach(function (el) {
	el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
	el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
});

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
	if (mobileMenu.classList.contains('active')) { lenis.stop(); } else { lenis.start(); }
});

document.querySelectorAll('.mobile-link').forEach(function (link, i) {
	link.style.transitionDelay = (i * 0.08) + 's';
	link.addEventListener('click', function () {
		hamburger.classList.remove('active');
		mobileMenu.classList.remove('active');
		lenis.start();
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

	// Hero orbs floating
	gsap.to('.hero-orb-1', { x: 40, y: -30, duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
	gsap.to('.hero-orb-2', { x: -30, y: 40, duration: 8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
	gsap.to('.hero-orb-3', { x: 20, y: -20, duration: 5, yoyo: true, repeat: -1, ease: 'sine.inOut' });

	// Hero parallax on scroll
	gsap.to('.hero-content', {
		scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
		y: -100, opacity: 0.3
	});
	gsap.to('.hero-bg', {
		scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
		y: 60
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
			opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
		});
	});

	document.querySelectorAll('.section-title .line-inner').forEach(function (line) {
		gsap.to(line, {
			scrollTrigger: { trigger: line, start: 'top 88%', once: true },
			opacity: 1, y: 0, duration: 1, ease: 'power4.out'
		});
	});

	// ========== BENTO CARDS STAGGER ==========
	gsap.utils.toArray('[data-service]').forEach(function (card, i) {
		gsap.to(card, {
			scrollTrigger: { trigger: card, start: 'top 88%', once: true },
			opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out'
		});
	});

	// ========== PORTFOLIO HORIZONTAL SCROLL ==========
	var track = document.getElementById('portfolioTrack');
	var wrapper = document.getElementById('portfolioWrapper');

	if (track && wrapper) {
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

	// ========== WHY US CARDS ==========
	gsap.utils.toArray('[data-why]').forEach(function (card, i) {
		gsap.to(card, {
			scrollTrigger: { trigger: card, start: 'top 88%', once: true },
			opacity: 1, y: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out'
		});
	});

	// ========== TESTIMONIALS ==========
	gsap.utils.toArray('[data-testimonial]').forEach(function (card, i) {
		gsap.to(card, {
			scrollTrigger: { trigger: card, start: 'top 88%', once: true },
			opacity: 1, y: 0, duration: 0.8, delay: i * 0.12, ease: 'power3.out'
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
				lenis.scrollTo(target, { offset: -40 });
			}
		});
	});

	// Refresh ScrollTrigger
	setTimeout(function () { ScrollTrigger.refresh(); }, 500);
}
