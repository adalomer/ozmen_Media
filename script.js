/* ===============================================
   ÖZMEN MEDIA — PLAYFUL & PROFESSIONAL GSAP ANIMATIONS
   =============================================== */
gsap.registerPlugin(ScrollTrigger);

/* --- PRELOADER --- */
var pre = document.getElementById('preloader');
var fill = document.getElementById('preloaderFill');
var loaded = 0;
var preInt = setInterval(function () {
	loaded += Math.random() * 15 + 5;
	if (loaded >= 100) { loaded = 100; clearInterval(preInt); }
	fill.style.width = loaded + '%';
	
	if (loaded >= 100) setTimeout(function () {
		pre.classList.add('done');
		document.body.style.overflow = '';
		startAnimations();
	}, 500);
}, 80);
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
	var heroTl = gsap.timeline({ defaults: { ease: 'back.out(1.5)' } });
	
	heroTl
		.to('.hero-badge', { opacity: 1, scale: 1, duration: 0.8 })
		.to('.hero-title .rev-text', { y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out' }, '-=0.5')
		.to('.hero-desc', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
		.to('.hero-btns', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
		.to('.hero-illust-wrapper', { opacity: 1, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' }, '-=0.8')
		.to('.fb-1', { opacity: 1, scale: 1, duration: 0.8 }, '-=0.8')
		.to('.fb-2', { opacity: 1, scale: 1, duration: 0.8 }, '-=0.6');

	/* ========== SCROLL REVEALS ========== */
	var sections = gsap.utils.toArray('.story-section:not(#hero)');
	
	sections.forEach(function(sec) {
		var tl = gsap.timeline({
			scrollTrigger: {
				trigger: sec,
				start: 'top 80%',
				toggleActions: 'play none none none' // Play once playfully
			}
		});

		// Tags & Titles
		var tags = sec.querySelectorAll('.tag');
		if(tags.length) tl.to(tags, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' });

		var revTexts = sec.querySelectorAll('.rev-text');
		if(revTexts.length) tl.to(revTexts, { y: '0%', duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.4');
		
		var desc = sec.querySelectorAll('.section-desc');
		if(desc.length) tl.to(desc, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');

		// Staggered pop animations (icons, cards, images)
		var pops = sec.querySelectorAll('.anim-pop');
		if(pops.length) tl.to(pops, { opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.5)' }, '-=0.4');

		// Slide right elements (like service cards)
		var slides = sec.querySelectorAll('.anim-slide-right');
		if(slides.length) tl.to(slides, { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.6');
		
		// General fade ups
		var fades = sec.querySelectorAll('.anim-fade-up');
		if(fades.length) tl.to(fades, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.6');
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
					duration: 2.5, 
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
					duration: 1.2, 
					ease: 'power3.inOut'
				});
			}
		});
	});

	setTimeout(function () { ScrollTrigger.refresh(); }, 500);
}
