// qr-audio.js : attempts to pre-load narration audio used by the model
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    try {
      window.QR_AUDIO = new Audio('../../assets/audio/narration-qr.mp3');
      window.QR_AUDIO.preload = 'auto';
      // attach a small handler to resume audio on user gesture
      document.addEventListener('click', function initOnce() {
        window.QR_AUDIO.load();
        document.removeEventListener('click', initOnce);
      });
    } catch (e) {
      console.warn('Could not initialize QR audio', e);
    }
  });
})();
