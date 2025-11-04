// main.js : small UI helpers (nav toggle, smooth scroll)
document.addEventListener('DOMContentLoaded', () => {
  // nav toggles (for multiple headers)
  document.querySelectorAll('button[id^="nav-toggle"]').forEach(btn => {
    const listId = btn.getAttribute('aria-controls') || btn.nextElementSibling?.id;
    const list = listId ? document.getElementById(listId) : null;
    btn.addEventListener('click', () => {
      if (list) {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        list.classList.toggle('is-active');
      }
    });
  });

  // Smooth scroll for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Play QR audio button wiring (if present)
  const playBtn = document.getElementById('play-qr-audio');
  if (playBtn) {
    playBtn.addEventListener('click', async () => {
      const audioPlayed = window.QR_AUDIO && typeof window.QR_AUDIO.play === 'function';
      if (audioPlayed) {
        window.QR_AUDIO.play();
      } else {
        // load fallback audio
        const audio = new Audio('../../assets/audio/narration-qr.mp3');
        audio.play().catch(()=>{ console.warn('Audio playback prevented by browser policy'); });
      }
    });
  }
});
