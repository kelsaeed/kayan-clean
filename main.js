/* ===== KAYAN CLEAN - main.js ===== */

(function () {
  'use strict';

  /* ── Language ── */
  let lang = localStorage.getItem('kayan_lang') || 'ar';

  function applyLang(l) {
    lang = l;
    localStorage.setItem('kayan_lang', l);
    const html = document.documentElement;
    const body = document.body;

    if (l === 'en') {
      html.setAttribute('lang', 'en');
      html.setAttribute('dir', 'ltr');
      body.classList.add('ltr');
      document.getElementById('lang-toggle').textContent = 'ع';
    } else {
      html.setAttribute('lang', 'ar');
      html.setAttribute('dir', 'rtl');
      body.classList.remove('ltr');
      document.getElementById('lang-toggle').textContent = 'EN';
    }

    // Update all data-ar / data-en text nodes
    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
      const text = l === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-ar');
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.innerHTML = text;
        }
      }
    });

    // Select options
    document.querySelectorAll('select option[data-ar]').forEach(opt => {
      const text = l === 'en' ? opt.getAttribute('data-en') : opt.getAttribute('data-ar');
      if (text) opt.textContent = text;
    });

    // Placeholders
    document.querySelectorAll('[data-placeholder-ar]').forEach(el => {
      el.placeholder = l === 'en'
        ? el.getAttribute('data-placeholder-en')
        : el.getAttribute('data-placeholder-ar');
    });
  }

  document.getElementById('lang-toggle').addEventListener('click', () => {
    applyLang(lang === 'ar' ? 'en' : 'ar');
  });

  // Initial apply
  applyLang(lang);

  /* ── Sticky Header ── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── Mobile Menu ── */
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('open');
  });

  // Close on link click
  mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mainNav.classList.remove('open');
    });
  });

  /* ── Active Nav on Scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY;
    sections.forEach(section => {
      const sTop = section.offsetTop - 100;
      const sBottom = sTop + section.offsetHeight;
      if (scrollY >= sTop && scrollY < sBottom) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + section.id);
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ── Reveal on Scroll ── */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger within a group
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-a').style.maxHeight = null;
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ── Contact Form ── */
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast() {
    clearTimeout(toastTimer);
    toast.classList.remove('hidden');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.classList.add('hidden'), 400);
    }, 4000);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Validate required fields
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    // Phone validation
    const phone = document.getElementById('phone');
    if (phone.value && !/^[0-9+]{9,15}$/.test(phone.value.trim())) {
      phone.classList.add('error');
      valid = false;
    }

if (valid) {
  if (typeof snaptr !== 'undefined') {
    snaptr('track', 'SIGN_UP');
  }

  showToast();
  form.reset();
} else {
  // Shake invalid fields
  form.querySelectorAll('.error').forEach(el => {
    el.style.animation = 'none';
    requestAnimationFrame(() => {
      el.style.animation = 'shake 0.4s ease';
    });
  });
}
  });

  // Remove error on input
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('error'));
  });

  /* ── Smooth scroll with offset ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Inject shake keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);

})();

/* ── Exit Intent ── */
(function() {
  const overlay = document.getElementById('exit-overlay');
  const closeBtn = document.getElementById('exit-close');
  const skipBtn = document.getElementById('exit-skip');
  if (!overlay) return;

  let shown = false;
  const dismissed = sessionStorage.getItem('exit_dismissed');
  if (dismissed) return;

  // Desktop: mouse leaves to top of page
  document.addEventListener('mouseleave', function(e) {
    if (!shown && e.clientY < 10) {
      shown = true;
      overlay.classList.remove('hidden');
    }
  });

  // Mobile: scroll up fast after scrolling 60% down
  let lastScrollY = 0;
  let maxScroll = 0;
  window.addEventListener('scroll', function() {
    const sy = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (sy > maxScroll) maxScroll = sy;
    if (!shown && maxScroll > docH * 0.6 && sy < lastScrollY - 120) {
      shown = true;
      overlay.classList.remove('hidden');
    }
    lastScrollY = sy;
  }, { passive: true });

  function dismiss() {
    overlay.classList.add('hidden');
    sessionStorage.setItem('exit_dismissed', '1');
  }
  closeBtn && closeBtn.addEventListener('click', dismiss);
  skipBtn && skipBtn.addEventListener('click', dismiss);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) dismiss();
  });
})();
