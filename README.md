# The Year of Sorrow — Tribute to Khadija (RA)

Project: a short website and exhibit for a 3D model representing the death of Khadija bint Khuwaylid (RA), the Prophet's grief, and psychological reflection.

## Structure
- `src/html/` — source HTML pages (index, story, psyche, model, sources, team)
- `src/css/` — stylesheets (base, layout, components)
- `src/js/` — small JavaScript utilities (nav, lazy video, QR audio)
- `assets/` — images, optional video, audio, data (sources.json)
- `public/` — simple redirect to src/html

## Quick start
1. Make sure the folder structure exists (you created it before).
2. Place images under `assets/images/` and the narration mp3 under `assets/audio/`.
3. Open `src/html/index.html` in a browser for development preview.

## Notes
- The website uses a gold & black palette suitable for the project's aesthetic.
- YouTube embeds are lazy-loaded when clicking the preview cards (script in `video-embed.js`).
- Replace placeholder images and the logo with your final files.

## Next steps
- Optionally generate the QR code that links to `assets/audio/narration-qr.mp3`.
- If you want, ask me to generate printable QR PNGs and a short script for the narration audio.
