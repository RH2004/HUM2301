// main.js — simple, robust UI helpers (nav toggle, mobile drawer, smooth scroll, QR audio)
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------
     1) Desktop nav-toggle buttons (unchanged)
     --------------------------- */
  document.querySelectorAll('button[id^="nav-toggle"]').forEach(btn => {
    const nav = btn.closest('.main-nav');
    btn.addEventListener('click', () => {
      if (!nav) return;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-active');

      // close nav on link click
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          btn.setAttribute('aria-expanded', 'false');
          nav.classList.remove('is-active');
        });
      });
    });
  });

  /* ---------------------------
     2) Simple mobile drawer (minimal and reliable)
     --------------------------- */
  (function simpleMobileDrawer() {
    const hamburger = document.getElementById('nav-hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const closeBtn = document.getElementById('nav-close');

    if (!hamburger || !mobileNav) return;

    // create or reuse overlay
    let overlay = document.querySelector('.page-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'page-overlay';
      document.body.appendChild(overlay);
    }

    function openMenu() {
      mobileNav.classList.add('open');
      mobileNav.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
      overlay.classList.add('visible');
      // prevent background scroll
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('visible');
      // restore scroll
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    // Toggle on hamburger click
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      if (isOpen) closeMenu(); else openMenu();
    });

    // Close button
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // Overlay click closes menu
    overlay.addEventListener('click', closeMenu);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close menu immediately when a link is clicked (lets navigation continue)
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        // do not prevent default — allow navigation; close UI right away
        closeMenu();
      });
    });

    // Ensure mobileNav is interactive
    mobileNav.style.pointerEvents = 'auto';
  })();

  /* ---------------------------
     3) Smooth scroll for internal anchors
     --------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '';
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
     4) QR audio play handler (if present)
     --------------------------- */
  const playBtn = document.getElementById('play-qr-audio');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      const audioObj = window.QR_AUDIO;
      if (audioObj && typeof audioObj.play === 'function') {
        audioObj.play().catch(()=>{ console.warn('Audio playback prevented'); });
      } else {
        const audio = new Audio('../../assets/audio/narration-qr.mp3');
        audio.play().catch(()=>{ console.warn('Audio playback prevented'); });
      }
    });
  }

}); 
