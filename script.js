/* ===============================================
   ÖZMEN MEDIA — SLUSH.APP STYLE GSAP ANIMATIONS
   =============================================== */
gsap.registerPlugin(ScrollTrigger);

/* --- PRELOADER --- */
var pre = document.getElementById('preloader');
var fill = document.getElementById('preloaderFill');
var loaded = 0;
var preInt = setInterval(function () {
	loaded += Math.random() * 20 + 10;
	if (loaded >= 100) { loaded = 100; clearInterval(preInt); }
	fill.style.width = loaded + '%';
	
	if (loaded >= 100) setTimeout(function () {
		pre.classList.add('done');
		document.body.style.overflow = '';
		startAnimations();
	}, 400);
}, 60);
document.body.style.overflow = 'hidden';

/* --- PILLNAV --- */
function initPillNav() {
	var ease = 'power3.easeOut';
	var circles = document.querySelectorAll('.hover-circle');
	var tlMap = new Map();
	var activeTweens = new Map();

	function layout() {
		circles.forEach(function (circle, i) {
			var pill = circle.parentElement;
			if (!pill) return;

			var rect = pill.getBoundingClientRect();
			var w = rect.width, h = rect.height;
			var R = ((w * w) / 4 + h * h) / (2 * h);
			var D = Math.ceil(2 * R) + 2;
			var delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
			var originY = D - delta;

			circle.style.width = D + 'px';
			circle.style.height = D + 'px';
			circle.style.bottom = -delta + 'px';

			gsap.set(circle, {
				xPercent: -50,
				scale: 0,
				transformOrigin: '50% ' + originY + 'px'
			});

			var label = pill.querySelector('.pill-label');
			var white = pill.querySelector('.pill-label-hover');

			if (label) gsap.set(label, { y: 0 });
			if (white) gsap.set(white, { y: h + 12, opacity: 0 });

			var tl = tlMap.get(circle);
			if (tl) tl.kill();

			tl = gsap.timeline({ paused: true });
			tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.5, ease: ease, overwrite: 'auto' }, 0);

			if (label) {
				tl.to(label, { y: -(h + 8), duration: 0.5, ease: ease, overwrite: 'auto' }, 0);
			}

			if (white) {
				gsap.set(white, { y: Math.ceil(h + 10), opacity: 0 });
				tl.to(white, { y: 0, opacity: 1, duration: 0.5, ease: ease, overwrite: 'auto' }, 0);
			}

			tlMap.set(circle, tl);

			// Event listeners
			pill.onmouseenter = function () {
				var anim = tlMap.get(circle);
				if (!anim) return;
				if (activeTweens.get(circle)) activeTweens.get(circle).kill();
				activeTweens.set(circle, anim.tweenTo(anim.duration(), { duration: 0.3, ease: ease, overwrite: 'auto' }));
			};

			pill.onmouseleave = function () {
				var anim = tlMap.get(circle);
				if (!anim) return;
				if (activeTweens.get(circle)) activeTweens.get(circle).kill();
				activeTweens.set(circle, anim.tweenTo(0, { duration: 0.2, ease: ease, overwrite: 'auto' }));
			};
		});
	}

	layout();
	window.addEventListener('resize', layout);
	if (document.fonts && document.fonts.ready) {
		document.fonts.ready.then(layout).catch(function () {});
	}

	// Logo Spin
	var logoImg = document.querySelector('#pillLogo img');
	var logoTween;
	document.getElementById('pillLogo').onmouseenter = function () {
		if (logoTween) logoTween.kill();
		gsap.set(logoImg, { rotate: 0 });
		logoTween = gsap.to(logoImg, { rotate: 360, duration: 0.4, ease: ease, overwrite: 'auto' });
	};

	// Mobile Menu
	var isMobileOpen = false;
	var ham = document.getElementById('pillHamburger');
	var menu = document.getElementById('pillMobileMenu');
	gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1 });

	function toggleMenu() {
		isMobileOpen = !isMobileOpen;
		if (ham) {
			var lines = ham.querySelectorAll('.hamburger-line');
			if (isMobileOpen) {
				gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease: ease });
				gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease: ease });
			} else {
				gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: ease });
				gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: ease });
			}
		}

		if (isMobileOpen) {
			gsap.set(menu, { visibility: 'visible' });
			gsap.fromTo(menu,
				{ opacity: 0, y: 10 },
				{ opacity: 1, y: 0, duration: 0.3, ease: ease, transformOrigin: 'top center' }
			);
		} else {
			gsap.to(menu, {
				opacity: 0, y: 10, duration: 0.2, ease: ease,
				onComplete: function () { gsap.set(menu, { visibility: 'hidden' }); }
			});
		}
	}

	if (ham) ham.onclick = toggleMenu;

	document.querySelectorAll('.mobile-menu-link').forEach(function (l) {
		l.onclick = function () { if (isMobileOpen) toggleMenu(); };
	});
}

initPillNav();

/* ==========================
   MAIN ANIMATIONS
   ========================== */
function startAnimations() {

	/* ========== HERO ENTRANCE ========== */
	// Bouncy Slush style entrance
	var heroTl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } });
	
	heroTl
		.to('.hero-badge', { opacity: 1, scale: 1, duration: 0.7 })
		.to('.hero-title .rev-text', { y: '0%', duration: 0.8, stagger: 0.1, ease: 'power4.out' }, '-=0.4')
		.to('.hero-desc', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
		.to('.hero-btns', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
		.to('.hero-illust-wrapper', { opacity: 1, scale: 1, duration: 1, ease: 'elastic.out(1, 0.6)' }, '-=0.7')
		.to('.fb-1', { opacity: 1, scale: 1, duration: 0.6 }, '-=0.6')
		.to('.fb-2', { opacity: 1, scale: 1, duration: 0.6 }, '-=0.4')
		.to('.scroll-indicator', { opacity: 1, duration: 0.5, ease: 'none' }, '-=0.2');

	/* ========== HERO FADE OUT ON SCROLL ========== */
	// The user requested: "üst taraftaki sabit sıçrama sayfaları aşşağa kaydırıken kaansa daha iyi olabilir"
	gsap.to('.hero-fade-elem', {
		scrollTrigger: {
			trigger: '.hero-section',
			start: 'top top',
			end: 'bottom top',
			scrub: true
		},
		y: -100,
		opacity: 0,
		stagger: 0.1
	});

	/* ========== FLOATING GRAFFITI ========== */
	// Graffiti comes in from sides and stays sticky/parallax
	gsap.to('.graffiti-left', {
		scrollTrigger: {
			trigger: 'body',
			start: '200px top',
			end: '1000px top',
			scrub: 1
		},
		opacity: 1,
		x: 0,
		rotation: 5,
		y: 200
	});

	gsap.to('.graffiti-right', {
		scrollTrigger: {
			trigger: 'body',
			start: '400px top',
			end: '1400px top',
			scrub: 1
		},
		opacity: 1,
		x: 0,
		rotation: -5,
		y: 300
	});

	/* ========== SCROLL REVEALS ========== */
	var sections = gsap.utils.toArray('.story-section:not(#hero)');
	
	sections.forEach(function(sec) {
		var tl = gsap.timeline({
			scrollTrigger: {
				trigger: sec,
				start: 'top 75%',
				toggleActions: 'play none none none' // Play once, bouncy
			}
		});

		var tags = sec.querySelectorAll('.tag-slush');
		if(tags.length) tl.to(tags, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' });

		var revTexts = sec.querySelectorAll('.rev-text');
		if(revTexts.length) tl.to(revTexts, { y: '0%', duration: 0.7, stagger: 0.1, ease: 'power3.out' }, '-=0.3');
		
		var desc = sec.querySelectorAll('.section-desc');
		if(desc.length) tl.to(desc, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');

		var pops = sec.querySelectorAll('.anim-pop');
		if(pops.length) tl.to(pops, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.15, ease: 'back.out(1.7)' }, '-=0.3');

		var slides = sec.querySelectorAll('.anim-slide-right');
		if(slides.length) tl.to(slides, { opacity: 1, x: 0, duration: 0.7, stagger: 0.15, ease: 'back.out(1.2)' }, '-=0.5');
		
		var fades = sec.querySelectorAll('.anim-fade-up');
		if(fades.length) tl.to(fades, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }, '-=0.5');
	});

	/* ========== STATS COUNTER ========== */
	document.querySelectorAll('.stat-num').forEach(function (el) {
		var t = parseInt(el.getAttribute('data-count'));
		ScrollTrigger.create({
			trigger: el, 
			start: 'top 85%', 
			once: true,
			onEnter: function () {
				gsap.to(el, {
					innerText: t, 
					duration: 2, 
					snap: { innerText: 1 }, 
					ease: 'power2.out',
					modifiers: { innerText: function (v) { return Math.round(v); } }
				});
			}
		});
	});

	/* ========== SMOOTH ANCHOR SCROLL ========== */
	document.querySelectorAll('a[href^="#"]').forEach(function (a) {
		a.addEventListener('click', function (e) {
			var target = document.querySelector(a.getAttribute('href'));
			if (target) {
				e.preventDefault();
				gsap.to(window, {
					scrollTo: { y: target, offsetY: 70 },
					duration: 1, 
					ease: 'power3.inOut'
				});
			}
		});
	});

	setTimeout(function () { ScrollTrigger.refresh(); }, 500);
}
