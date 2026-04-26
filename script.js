// ===== CURSOR GLOW =====
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
	glow.style.left = e.clientX + 'px';
	glow.style.top = e.clientY + 'px';
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
	navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
	mobileMenu.classList.toggle('active');
	const spans = hamburger.querySelectorAll('span');
	if (mobileMenu.classList.contains('active')) {
		spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
		spans[1].style.opacity = '0';
		spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
	} else {
		spans[0].style.transform = '';
		spans[1].style.opacity = '1';
		spans[2].style.transform = '';
	}
});

function closeMenu() {
	mobileMenu.classList.remove('active');
	const spans = hamburger.querySelectorAll('span');
	spans[0].style.transform = '';
	spans[1].style.opacity = '1';
	spans[2].style.transform = '';
}

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry, index) => {
		if (entry.isIntersecting) {
			setTimeout(() => {
				entry.target.classList.add('visible');
			}, index * 100);
			revealObserver.unobserve(entry.target);
		}
	});
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounters() {
	const stats = document.querySelectorAll('.hero-stats .stat h3');
	stats.forEach(stat => {
		const text = stat.textContent;
		const hasPercent = text.includes('%');
		const hasPlus = text.includes('+');
		const num = parseInt(text.replace(/[^0-9]/g, ''));
		let current = 0;
		const step = Math.ceil(num / 60);
		const timer = setInterval(() => {
			current += step;
			if (current >= num) {
				current = num;
				clearInterval(timer);
			}
			let display = current.toString();
			if (hasPercent) display = '%' + display;
			if (hasPlus) display = display + '+';
			if (!hasPercent && !hasPlus) display = display + '+';
			stat.textContent = display;
		}, 25);
	});
}

const heroObserver = new IntersectionObserver((entries) => {
	if (entries[0].isIntersecting) {
		animateCounters();
		heroObserver.disconnect();
	}
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
	link.addEventListener('click', (e) => {
		const target = document.querySelector(link.getAttribute('href'));
		if (target) {
			e.preventDefault();
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	});
});

// ===== TILT ON PORTFOLIO CARDS =====
document.querySelectorAll('.portfolio-card').forEach(card => {
	card.addEventListener('mousemove', (e) => {
		const rect = card.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;
		card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
	});
	card.addEventListener('mouseleave', () => {
		card.style.transform = '';
	});
});

// ===== PARALLAX HERO BG =====
window.addEventListener('scroll', () => {
	const heroBg = document.querySelector('.hero-bg');
	if (heroBg) {
		heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
	}
});
