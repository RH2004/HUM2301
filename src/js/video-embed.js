// video-embed.js : lazy YouTube embedder and click-to-load behavior
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.youtubeId;
      if (!id) return;
      // Open the YouTube video in a new tab
      window.open(`https://www.youtube.com/watch?v=${id}`, '_blank');
    });

    // also allow keyboard activation
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
});