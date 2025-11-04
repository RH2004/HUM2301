// main.js : UI helpers (nav toggle, mobile drawer, smooth scroll, QR audio)
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------
     1) Existing nav-toggle buttons (desktop/header compact toggles)
     --------------------------- */
  document.querySelectorAll('button[id^="nav-toggle"]').forEach(btn => {
    const listId = btn.getAttribute('aria-controls') || btn.nextElementSibling?.id;
    const list = listId ? document.getElementById(listId) : null;
    const nav = btn.closest('.main-nav');

    btn.addEventListener('click', () => {
      if (nav) {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        nav.classList.toggle('is-active');

        // Close the nav when any link inside it is clicked
        nav.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
            btn.setAttribute('aria-expanded', 'false');
            nav.classList.remove('is-active');
          });
        });
      }
    });
  });

  /* ---------------------------
     2) Mobile drawer (hamburger) behavior
     --------------------------- */
  (function setupMobileDrawer() {
    const hamburger = document.getElementById('nav-hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const closeBtn = document.getElementById('nav-close');

    if (!hamburger || !mobileNav) return; // nothing to do if mobile UI not present

    let lastFocused = null;

    // create overlay element once
    let overlay = document.querySelector('.page-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'page-overlay';
      document.body.appendChild(overlay);
    }

    function openNav() {
      lastFocused = document.activeElement;
      mobileNav.classList.add('open');
      mobileNav.setAttribute('aria-hidden', 'false');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
      overlay.classList.add('visible');

      // focus first focusable link in the mobile nav
      const firstLink = mobileNav.querySelector('.mobile-nav-list a, button, [tabindex]:not([tabindex="-1"])');
      if (firstLink) firstLink.focus();

      // add focus trap
      document.addEventListener('focus', trapFocus, true);
      // prevent body scroll while open
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('visible');

      // remove focus trap
      document.removeEventListener('focus', trapFocus, true);
      // restore focus
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      // restore body scroll
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    function trapFocus(e) {
      // If focus goes outside the mobile nav, redirect it back to the first link
      if (!mobileNav.contains(e.target)) {
        const firstLink = mobileNav.querySelector('.mobile-nav-list a, button, [tabindex]:not([tabindex="-1"])');
        if (firstLink) firstLink.focus();
        e.stopPropagation();
      }
    }

    // Toggle when hamburger clicked
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      if (expanded) closeNav(); else openNav();
    });

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeNav());
    }

    // Overlay click closes nav
    overlay.addEventListener('click', () => closeNav());

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (mobileNav.classList.contains('open')) closeNav();
      }
    });

    // Close the mobile nav when a mobile link is clicked (gives time for navigation)
    mobileNav.querySelectorAll('.mobile-nav-list a').forEach(a => {
      a.addEventListener('click', () => {
        // small timeout so link navigation can start before UI closes
        setTimeout(() => closeNav(), 160);
      });
    });
  })();


  /* ---------------------------
     3) Smooth scroll for same-page anchors (internal links starting with '#')
     --------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '';
      // allow if href is exactly '#' (scroll to top) or a real id
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  /* ---------------------------
     4) Play QR audio button wiring (if present)
     --------------------------- */
  const playBtn = document.getElementById('play-qr-audio');
  if (playBtn) {
    playBtn.addEventListener('click', async () => {
      const audioPlayed = window.QR_AUDIO && typeof window.QR_AUDIO.play === 'function';
      if (audioPlayed) {
        window.QR_AUDIO.play().catch(() => { console.warn('Audio playback prevented by browser policy'); });
      } else {
        // fallback path relative to the HTML file — keep your original path if different
        const audio = new Audio('../../assets/audio/narration-qr.mp3');
        audio.play().catch(()=>{ console.warn('Audio playback prevented by browser policy'); });
      }
    });
  }

});
