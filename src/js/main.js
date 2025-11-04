// main.js — simple, robust UI helpers (nav toggle, mobile drawer, smooth scroll, QR audio)
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------
     1) Smooth scroll for internal anchors
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