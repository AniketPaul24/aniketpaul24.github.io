/* =============================================
   ANIKET PAUL — PORTFOLIO SCRIPTS v2
   Motion Design System — Premium UX
   ============================================= */

// ---- YEAR ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- REDUCED MOTION CHECK ----
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- SCROLL PROGRESS BAR ----
const scrollProgress = document.getElementById('scroll-progress');

function updateScrollProgress() {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ---- NAV SCROLL STATE ----
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateScrollProgress();
}, { passive: true });

// ---- MOBILE MENU ----
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// ---- REVEAL ON SCROLL ----
// Upgraded: scale + blur, intentional stagger by sibling index
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el       = entry.target;
      const parent   = el.parentElement;
      // Get all .reveal siblings (including already-visible ones for index calc)
      const siblings = [...parent.querySelectorAll('.reveal')];
      const idx      = siblings.indexOf(el);
      // Only count NOT-YET-visible for delay: find position among pending siblings
      const pending  = siblings.filter(s => !s.classList.contains('visible'));
      const delayIdx = pending.indexOf(el);
      const delay    = prefersReducedMotion ? 0 : Math.max(0, delayIdx) * 65;

      setTimeout(() => {
        el.classList.add('visible');
        // Release will-change after animation completes to free compositor
        if (!prefersReducedMotion) {
          setTimeout(() => { el.style.willChange = 'auto'; }, 620);
        }
      }, delay);

      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.06, rootMargin: '0px 0px -32px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- SECTION HEAD RULE ANIMATION ----
// Triggers the expanding underline on each section title
const sectionHeadObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        sectionHeadObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.section-head').forEach(el => sectionHeadObserver.observe(el));

// ---- ACTIVE NAV LINK (class-based, not inline styles) ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const matches = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', matches);
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

// ---- CV DOWNLOAD ----
function downloadCV() {
  const cvUrl = 'https://raw.githubusercontent.com/AniketPaul24/aniketpaul24.github.io/main/Aniket_Paul_CV.pdf';

  const link = document.createElement('a');
  link.href = cvUrl;
  link.download = 'Aniket_Paul_CV.pdf';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ---- SMOOTH ANCHOR SCROLL (offset for fixed nav) ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
      ) || 64;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile menu if open
      if (mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', false);
      }
    }
  });
});

// ---- BUTTON PRESS RIPPLE (subtle tactile feedback) ----
// Adds a brief scale-down on mousedown for all interactive buttons
if (!prefersReducedMotion) {
  document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta').forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.transition = 'transform 80ms ease, box-shadow 80ms ease';
    });
    btn.addEventListener('mouseup', () => {
      // Restore transition after brief delay
      setTimeout(() => { btn.style.transition = ''; }, 200);
    });
  });
}

// ---- KEYBOARD ACCESSIBILITY: Close mobile menu on Escape ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
    hamburger.focus();
  }
});

// ---- HERO CONTENT: Sequence reveals on load ----
// Override default stagger for hero elements — tighter, more intentional
if (!prefersReducedMotion) {
  const heroReveals = document.querySelectorAll('#hero .reveal');
  heroReveals.forEach((el, i) => {
    // Detach from intersection observer — hero is always in view on load
    revealObserver.unobserve(el);
    setTimeout(() => {
      el.classList.add('visible');
      setTimeout(() => { el.style.willChange = 'auto'; }, 620);
    }, 120 + i * 90);
  });
}
