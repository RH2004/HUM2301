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
     2) Mobile drawer (hamburger) behavior — improved (no focus event interception)
     --------------------------- */
  (function setupMobileDrawer() {
    const hamburger = document.getElementById('nav-hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const closeBtn = document.getElementById('nav-close');

    if (!hamburger || !mobileNav) return; // nothing to do if mobile UI not present

    let lastFocused = null;

    // create overlay element once (or reuse)
    let overlay = document.querySelector('.page-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'page-overlay';
      document.body.appendChild(overlay);
    }

    // helper: get focusable elements inside mobile nav (for Tab trap)
    function getFocusableElements(container) {
      if (!container) return [];
      const selectors = 'a[href], button:not([disabled]), textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])';
      return Array.from(container.querySelectorAll(selectors)).filter(el => el.offsetParent !== null);
    }

    function openNav() {
      lastFocused = document.activeElement;
      mobileNav.classList.add('open');
      mobileNav.setAttribute('aria-hidden', 'false');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
      overlay.classList.add('visible');

      // focus the first link inside the mobile nav
      const focusables = getFocusableElements(mobileNav);
      if (focusables.length) focusables[0].focus();

      // prevent body scroll while menu open
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      // attach Tab trapping handler
      document.addEventListener('keydown', handleKeydownTrap);
    }

    function closeNav() {
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('visible');

      // restore focus
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();

      // restore body scroll
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';

      // detach Tab trapping handler
      document.removeEventListener('keydown', handleKeydownTrap);
    }

    // Tab/Shift+Tab key trap handler — keeps focus cycling inside mobileNav
    function handleKeydownTrap(e) {
      if (e.key !== 'Tab') return;
      const focusables = getFocusableElements(mobileNav);
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        // Shift+Tab
        if (active === first || !mobileNav.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    // Toggle when hamburger clicked
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      if (expanded) closeNav(); else openNav();
    });

    // Close button inside nav
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

    function closeNavAndFollowLink(e) {
      e.preventDefault();
      const href = e.currentTarget.href;
      closeNav();
      window.location.href = href;
    }

    // Close the mobile nav when a mobile link is clicked
    mobileNav.querySelectorAll('.mobile-nav-list a').forEach(a => {
      a.addEventListener('click', closeNavAndFollowLink);
    });

    // Safety: ensure mobile nav is clickable (z-index/pointer-events)
    mobileNav.style.pointerEvents = 'auto';
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
