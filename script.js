/* ===============================================
   OZMEN AGENCY — SLUSH.APP STYLE GSAP ANIMATIONS
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
		document.fonts.ready.then(layout).catch(function () { });
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
		l.onclick = function (e) {
			var href = l.getAttribute('href');
			if (isMobileOpen) toggleMenu();
			if (href && href.startsWith('#') && href !== '#') {
				var target = document.querySelector(href);
				if (target) {
					e.preventDefault();
					setTimeout(function () {
						var navHeight = 90;
						var elementPosition = target.getBoundingClientRect().top;
						var offsetPosition = elementPosition + window.pageYOffset - navHeight;
						window.scrollTo({
							top: offsetPosition,
							behavior: 'smooth'
						});
					}, 150);
				}
			}
		};
	});
}

initPillNav();

/* --- SCROLL FLOAT TEXT --- */
function wrapCharacters(node) {
	if (node.nodeType === 3) { // Text node
		var text = node.nodeValue;
		if (!text.trim()) return;
		var fragment = document.createDocumentFragment();
		var words = text.split(/(\s+)/);
		words.forEach(function (word) {
			if (!word) return;
			if (word.trim() === '') {
				fragment.appendChild(document.createTextNode(word));
			} else {
				var wordSpan = document.createElement('span');
				wordSpan.className = 'word';
				wordSpan.style.display = 'inline-block';
				wordSpan.style.whiteSpace = 'nowrap';
				for (var i = 0; i < word.length; i++) {
					var charSpan = document.createElement('span');
					charSpan.className = 'char';
					charSpan.style.display = 'inline-block';
					charSpan.textContent = word[i];
					wordSpan.appendChild(charSpan);
				}
				fragment.appendChild(wordSpan);
			}
		});
		node.parentNode.replaceChild(fragment, node);
	} else if (node.nodeType === 1) { // Element node
		if (node.classList.contains('char') || node.classList.contains('word')) return;
		var child = node.firstChild;
		while (child) {
			var next = child.nextSibling;
			wrapCharacters(child);
			child = next;
		}
	}
}

function initScrollFloat() {
	var floaters = document.querySelectorAll('.scroll-float');
	floaters.forEach(function (el) {
		var textWrap = el.querySelector('.scroll-float-text');
		if (!textWrap) return;

		wrapCharacters(textWrap);

		var chars = el.querySelectorAll('.char');
		if (chars.length === 0) return;

		var isHero = el.classList.contains('hero-title') || el.classList.contains('hero-desc');

		gsap.fromTo(chars,
			{
				willChange: 'opacity, transform',
				opacity: 0,
				yPercent: isHero ? -120 : 120, // Hero drops from top, others come from bottom
				scaleY: 2.3,
				scaleX: 0.7,
				transformOrigin: '50% 50%'
			},
			{
				duration: 1,
				ease: 'back.inOut(2)',
				opacity: 1,
				yPercent: 0,
				scaleY: 1,
				scaleX: 1,
				stagger: 0.03,
				scrollTrigger: isHero ? null : {
					trigger: el,
					start: 'top 90%',
					toggleActions: 'play none none reverse'
				}
			}
		);
	});
}

/* --- RIBBONS (ogl WebGL) --- */
function initRibbons() {
	var container = document.getElementById('ribbons-container');
	if (!container || !window.ogl) return;

	var Renderer = window.ogl.Renderer;
	var Transform = window.ogl.Transform;
	var Vec3 = window.ogl.Vec3;
	var Color = window.ogl.Color;
	var Polyline = window.ogl.Polyline;

	var colors = ['#1A73E8', '#EA4335', '#F4B400', '#1558D6', '#C5221F'];
	var baseSpring = 0.03;
	var baseFriction = 0.9;
	var baseThickness = 30;
	var offsetFactor = 0.05;
	var maxAge = 500;
	var pointCount = 50;
	var speedMultiplier = 0.6;
	var enableFade = false;
	var enableShaderEffect = true;
	var effectAmplitude = 2;

	var renderer = new Renderer({ dpr: window.devicePixelRatio || 2, alpha: true });
	var gl = renderer.gl;
	gl.clearColor(0, 0, 0, 0);

	gl.canvas.style.position = 'absolute';
	gl.canvas.style.top = '0';
	gl.canvas.style.left = '0';
	gl.canvas.style.width = '100%';
	gl.canvas.style.height = '100%';
	container.appendChild(gl.canvas);

	var scene = new Transform();
	var lines = [];

	var vertex = `
	  precision highp float;
	  attribute vec3 position;
	  attribute vec3 next;
	  attribute vec3 prev;
	  attribute vec2 uv;
	  attribute float side;
	  uniform vec2 uResolution;
	  uniform float uDPR;
	  uniform float uThickness;
	  uniform float uTime;
	  uniform float uEnableShaderEffect;
	  uniform float uEffectAmplitude;
	  varying vec2 vUV;
	  vec4 getPosition() {
		  vec4 current = vec4(position, 1.0);
		  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
		  vec2 nextScreen = next.xy * aspect;
		  vec2 prevScreen = prev.xy * aspect;
		  vec2 tangent = normalize(nextScreen - prevScreen);
		  vec2 normal = vec2(-tangent.y, tangent.x);
		  normal /= aspect;
		  normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0));
		  float dist = length(nextScreen - prevScreen);
		  normal *= smoothstep(0.0, 0.02, dist);
		  float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
		  float pixelWidth = current.w * pixelWidthRatio;
		  normal *= pixelWidth * uThickness;
		  current.xy -= normal * side;
		  if(uEnableShaderEffect > 0.5) {
			current.xy += normal * sin(uTime + current.x * 10.0) * uEffectAmplitude;
		  }
		  return current;
	  }
	  void main() {
		  vUV = uv;
		  gl_Position = getPosition();
	  }
	`;

	var fragment = `
	  precision highp float;
	  uniform vec3 uColor;
	  uniform float uOpacity;
	  uniform float uEnableFade;
	  varying vec2 vUV;
	  void main() {
		  float fadeFactor = 1.0;
		  if(uEnableFade > 0.5) {
			  fadeFactor = 1.0 - smoothstep(0.0, 1.0, vUV.y);
		  }
		  gl_FragColor = vec4(uColor, uOpacity * fadeFactor);
	  }
	`;

	function resize() {
		var width = container.clientWidth;
		var height = container.clientHeight;
		renderer.setSize(width, height);
		lines.forEach(function (line) { line.polyline.resize(); });
	}
	window.addEventListener('resize', resize);

	var center = (colors.length - 1) / 2;
	colors.forEach(function (color, index) {
		var spring = baseSpring + (Math.random() - 0.5) * 0.05;
		var friction = baseFriction + (Math.random() - 0.5) * 0.05;
		var thickness = baseThickness + (Math.random() - 0.5) * 3;
		var mouseOffset = new Vec3(
			(index - center) * offsetFactor + (Math.random() - 0.5) * 0.01,
			(Math.random() - 0.5) * 0.1,
			0
		);

		var line = {
			spring: spring,
			friction: friction,
			mouseVelocity: new Vec3(),
			mouseOffset: mouseOffset
		};

		var points = [];
		for (var i = 0; i < pointCount; i++) {
			points.push(new Vec3());
		}
		line.points = points;

		line.polyline = new Polyline(gl, {
			points: points,
			vertex: vertex,
			fragment: fragment,
			uniforms: {
				uColor: { value: new Color(color) },
				uThickness: { value: thickness },
				uOpacity: { value: 1.0 },
				uTime: { value: 0.0 },
				uEnableShaderEffect: { value: enableShaderEffect ? 1.0 : 0.0 },
				uEffectAmplitude: { value: effectAmplitude },
				uEnableFade: { value: enableFade ? 1.0 : 0.0 }
			}
		});
		line.polyline.mesh.setParent(scene);
		lines.push(line);
	});

	resize();

	var mouse = new Vec3();
	function updateMouse(e) {
		var x, y;
		var rect = container.getBoundingClientRect();
		if (e.changedTouches && e.changedTouches.length) {
			x = e.changedTouches[0].clientX - rect.left;
			y = e.changedTouches[0].clientY - rect.top;
		} else {
			x = e.clientX - rect.left;
			y = e.clientY - rect.top;
		}
		var width = container.clientWidth;
		var height = container.clientHeight;
		mouse.set((x / width) * 2 - 1, (y / height) * -2 + 1, 0);
	}
	window.addEventListener('mousemove', updateMouse);
	window.addEventListener('touchstart', updateMouse, { passive: true });
	window.addEventListener('touchmove', updateMouse, { passive: true });

	var tmp = new Vec3();
	var lastTime = performance.now();

	function update() {
		requestAnimationFrame(update);
		var currentTime = performance.now();
		var dt = currentTime - lastTime;
		lastTime = currentTime;

		lines.forEach(function (line) {
			tmp.copy(mouse).add(line.mouseOffset).sub(line.points[0]).multiply(line.spring);
			line.mouseVelocity.add(tmp).multiply(line.friction);
			line.points[0].add(line.mouseVelocity);

			for (var i = 1; i < line.points.length; i++) {
				if (maxAge > 0) {
					var segmentDelay = maxAge / (line.points.length - 1);
					var alpha = Math.min(1, (dt * speedMultiplier) / segmentDelay);
					line.points[i].lerp(line.points[i - 1], alpha);
				} else {
					line.points[i].lerp(line.points[i - 1], 0.9);
				}
			}
			if (line.polyline.mesh.program.uniforms.uTime) {
				line.polyline.mesh.program.uniforms.uTime.value = currentTime * 0.001;
			}
			line.polyline.updateGeometry();
		});

		renderer.render({ scene: scene });
	}
	update();
}

/* ==========================
   MAIN ANIMATIONS
   ========================== */
function startAnimations() {

	initScrollFloat();
	if (window.ogl) {
		initRibbons();
	} else {
		window.addEventListener('ogl-ready', initRibbons);
	}

	/* ========== HERO ENTRANCE ========== */
	// Bouncy Slush style entrance
	var heroTl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } });

	heroTl
		.to('.hero-badge', { opacity: 1, scale: 1, duration: 0.7 })
		.to('.hero-btns', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
		.to('.hero-illust-wrapper', { opacity: 1, scale: 1, duration: 1, ease: 'elastic.out(1, 0.6)' }, '-=0.7')
		.to('.fb-1', { opacity: 1, scale: 1, duration: 0.6 }, '-=0.6')
		.to('.fb-2', { opacity: 1, scale: 1, duration: 0.6 }, '-=0.4');

	/* ========== HERO FADE OUT ON SCROLL ========== */
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

	/* ========== SCROLL REVEALS ========== */
	var sections = gsap.utils.toArray('.story-section:not(#hero)');

	sections.forEach(function (sec) {
		var tl = gsap.timeline({
			scrollTrigger: {
				trigger: sec,
				start: 'top 75%',
				toggleActions: 'play none none none' // Play once, bouncy
			}
		});

		var tags = sec.querySelectorAll('.tag-slush');
		if (tags.length) tl.to(tags, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' });

		var pops = sec.querySelectorAll('.anim-pop');
		if (pops.length) tl.to(pops, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.15, ease: 'back.out(1.7)' }, '-=0.3');

		var slides = sec.querySelectorAll('.anim-slide-right');
		if (slides.length) tl.to(slides, { opacity: 1, x: 0, duration: 0.7, stagger: 0.15, ease: 'back.out(1.2)' }, '-=0.5');

		var fades = sec.querySelectorAll('.anim-fade-up');
		if (fades.length) tl.to(fades, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }, '-=0.5');
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

	setTimeout(function () { ScrollTrigger.refresh(); }, 500);
}

/* ========== GLOBAL SMOOTH ANCHOR SCROLL ========== */
document.addEventListener('click', function (e) {
	var a = e.target.closest('a[href^="#"]');
	if (!a) return;
	var href = a.getAttribute('href');
	if (!href || href === '#') return;
	var target = document.querySelector(href);
	if (target) {
		e.preventDefault();
		var navHeight = 80;
		var elementPosition = target.getBoundingClientRect().top;
		var offsetPosition = elementPosition + window.pageYOffset - navHeight;

		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth'
		});
	}
});
