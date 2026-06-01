/* ==========================================================================
   EGA · Site script
   ========================================================================== */

(function () {
  'use strict';

  // ---------- 1. Mobile menu toggle ----------
  const toggle = document.querySelector('.menu-toggle');
  const nav    = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open);
    });
    // Close menu when clicking a link
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
      });
    });
  }

  // ---------- 2. Highlight current nav link ----------
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (href === here || (here === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

  // ---------- 3. Contact form ----------
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const requiredFields = ['nombre', 'email', 'empresa', 'mensaje'];
      const missing = requiredFields.filter(k => !data[k] || !String(data[k]).trim());
      const msgEl = document.getElementById('form-msg');

      if (missing.length) {
        msgEl.textContent = 'Por favor complete los campos requeridos: ' + missing.join(', ') + '.';
        msgEl.classList.add('is-visible');
        return;
      }

      // Build mailto link (no backend required)
      const subject = encodeURIComponent('Nuevo mensaje desde el sitio web — ' + (data.empresa || data.nombre));
      const body    = encodeURIComponent(
        'Nombre: '  + data.nombre   + '\n' +
        'Cargo: '   + (data.cargo || 'No especificado') + '\n' +
        'Empresa: ' + data.empresa  + '\n' +
        'Email: '   + data.email    + '\n' +
        'Teléfono: ' + (data.telefono || 'No proporcionado') + '\n\n' +
        'Mensaje:\n' + data.mensaje
      );
      window.location.href = 'mailto:egarcia.acevedo@hotmail.com?subject=' + subject + '&body=' + body;

      msgEl.textContent = 'Abriendo su cliente de correo… Si no se abre automáticamente, escríbame directamente a egarcia.acevedo@hotmail.com';
      msgEl.classList.add('is-visible');
      form.reset();
    });
  }

  // ---------- 4. Diagnostic CTA — log intent in localStorage ----------
  document.querySelectorAll('[data-track]').forEach(el => {
    el.addEventListener('click', () => {
      try {
        const intents = JSON.parse(localStorage.getItem('ega_intents') || '[]');
        intents.push({ action: el.getAttribute('data-track'), ts: new Date().toISOString() });
        localStorage.setItem('ega_intents', JSON.stringify(intents.slice(-50)));
      } catch (_) { /* ignore */ }
    });
  });

  // ---------- 5. Cookie banner ----------
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    if (!localStorage.getItem('ega_cookie_ok')) {
      setTimeout(() => banner.classList.add('is-visible'), 800);
    }
    banner.querySelectorAll('[data-cookie]').forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem('ega_cookie_ok', btn.getAttribute('data-cookie'));
        banner.classList.remove('is-visible');
      });
    });
  }

  // ---------- 6. Update copyright year ----------
  const yearEls = document.querySelectorAll('[data-year]');
  const year = new Date().getFullYear();
  yearEls.forEach(el => { el.textContent = year; });

  // ---------- 7. Reveal-on-scroll (intersection observer) ----------
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));
  }
})();
