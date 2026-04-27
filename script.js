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

/* --- NAVBAR & MOB MENU --- */
var nav = document.getElementById('navbar');
window.addEventListener('scroll', function () {
	nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

var ham = document.getElementById('hamburger');
var mob = document.getElementById('mobMenu');
ham.addEventListener('click', function () { 
	ham.classList.toggle('active'); 
	mob.classList.toggle('active'); 
});
document.querySelectorAll('.mob-link').forEach(function (l, i) {
	l.style.transitionDelay = (i * 0.08) + 's';
	l.addEventListener('click', function () { 
		ham.classList.remove('active'); 
		mob.classList.remove('active'); 
	});
});

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
