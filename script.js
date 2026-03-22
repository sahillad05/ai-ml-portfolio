/* ═══════════════════════════════════════════════════════════
   SAHIL LAD PORTFOLIO — script.js
   Particles · Typing · Tilt · Scroll Reveal · Dark Mode
   Works on both index.html and project detail pages.
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── LOADER (index.html only) ───────────────────────────── */
const loader = document.getElementById('loader');

if (loader) {
  document.body.style.overflow = 'hidden'; // lock scroll during loading screen
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 900);
  });
}

/* ─── DARK / LIGHT MODE ──────────────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeIcon) {
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ─── STICKY NAVBAR ──────────────────────────────────────── */
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ─── HAMBURGER MENU ─────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const mobileOverlay = document.getElementById('mobile-overlay');

function openMenu() {
  if (!hamburger || !navLinks || !mobileOverlay) return;
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  mobileOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  if (!hamburger || !navLinks || !mobileOverlay) return;
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ─── ACTIVE NAV ON SCROLL ───────────────────────────────── */
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

if (sections.length) {
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* ─── TYPING ANIMATION (index.html only) ─────────────────── */
const typingEl = document.getElementById('typing-text');

if (typingEl) {
  const roles = [
    'ML Engineer',
    'AI Developer',
    'Deep Learning Engineer',
    'Data Scientist',
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function type() {
    const currentRole = roles[roleIdx];
    if (!deleting) {
      typingEl.textContent = currentRole.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === currentRole.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      typingEl.textContent = currentRole.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? 50 : 80);
  }

  setTimeout(type, 1400);
}

/* ─── CANVAS PARTICLE SYSTEM (index.html only) ───────────── */
const canvas = document.getElementById('particles-canvas');

if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '139,92,246' : '6,182,212';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }

  particles = Array.from({ length: 120 }, () => new Particle());
  animateParticles();
}

/* ─── MOUSE PARALLAX ON HERO (index.html only) ───────────── */
const heroContent = document.querySelector('[data-parallax]');
const shapes = document.querySelectorAll('.shape');

if (heroContent || shapes.length) {
  document.addEventListener('mousemove', e => {
    const xRatio = (e.clientX / window.innerWidth - 0.5);
    const yRatio = (e.clientY / window.innerHeight - 0.5);
    if (heroContent) {
      heroContent.style.transform = `translate(${xRatio * 12}px, ${yRatio * 8}px)`;
    }
    shapes.forEach((shape, i) => {
      const depth = (i + 1) * 6;
      shape.style.transform = `translate(${xRatio * depth}px, ${yRatio * depth}px)`;
    });
  }, { passive: true });
}

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

/* ─── 3D CARD TILT ───────────────────────────────────────── */
function addTilt(card) {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px) translateY(-8px)`;
    card.style.transition = 'transform 0.05s linear';
    const glow = card.querySelector('.card-glow');
    if (glow) {
      glow.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      glow.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
  });
}

document.querySelectorAll('[data-tilt]').forEach(addTilt);

/* ─── CONTACT FORM ────────────── */
// Form submission is now handled natively via mailto: action in HTML.

/* ─── BACK TO TOP ────────────────────────────────────────── */
const backToTop = document.getElementById('back-to-top');

if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── SMOOTH SCROLL FOR NAV LINKS ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
