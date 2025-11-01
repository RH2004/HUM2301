// video-embed.js : lazy YouTube embedder and click-to-load behavior
document.addEventListener('DOMContentLoaded', () => {
  function createIframe(youtubeId) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    iframe.width = '100%';
    iframe.height = '280';
    iframe.src = `https://www.youtube.com/embed/${youtubeId}?rel=0&autoplay=1`;
    iframe.title = 'YouTube video player';
    return iframe;
  }

  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.youtubeId;
      if (!id) return;
      // replace content with iframe
      const iframe = createIframe(id);
      card.innerHTML = '';
      card.appendChild(iframe);
      card.setAttribute('aria-pressed', 'true');
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
