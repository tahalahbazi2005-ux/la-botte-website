document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Page loader ---------- */
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-hidden'), 350);
  });

  /* ---------- Sticky header on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const link = document.querySelector(`[data-nav][href="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(section => sectionObserver.observe(section));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 70}ms`;
    revealObserver.observe(el);
  });

  /* ---------- Hero parallax ---------- */
  const heroImg = document.getElementById('heroImg');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY;
      if (offset < window.innerHeight) {
        heroImg.style.transform = `scale(1.08) translateY(${offset * 0.15}px)`;
      }
    }, { passive: true });
  }

  /* ---------- Menu tabs ---------- */
  const tabs = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-list');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(panel => {
        panel.classList.toggle('is-active', panel.dataset.panel === target);
      });
    });
  });

  /* ---------- Gallery lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = item.dataset.caption || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------- Reservation form ---------- */
  const form = document.getElementById('reservationForm');
  const successMsg = document.getElementById('formSuccess');

  // Prevent past dates
  const dateInput = document.getElementById('resDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  const showError = (field, message) => {
    const errorEl = form.querySelector(`[data-error-for="${field.id}"]`);
    field.setAttribute('data-touched', 'true');
    if (errorEl) errorEl.textContent = message;
  };

  const clearError = (field) => {
    const errorEl = form.querySelector(`[data-error-for="${field.id}"]`);
    if (errorEl) errorEl.textContent = '';
  };

  const phonePattern = /^[0-9+()\s/-]{6,}$/;

  const validateField = (field) => {
    if (field.validity.valueMissing) {
      showError(field, 'Dieses Feld wird benötigt.');
      return false;
    }
    if (field.id === 'resPhone' && !phonePattern.test(field.value)) {
      showError(field, 'Bitte eine gültige Telefonnummer angeben.');
      return false;
    }
    clearError(field);
    field.setAttribute('data-touched', 'true');
    return true;
  };

  form.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = form.querySelectorAll('input, select');
    let allValid = true;

    fields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      successMsg.classList.remove('is-visible');
      return;
    }

    // Simulate successful submission (no backend connected)
    successMsg.classList.add('is-visible');
    form.reset();
    fields.forEach(field => field.removeAttribute('data-touched'));
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
