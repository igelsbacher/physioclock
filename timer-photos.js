'use strict';
(() => {
  const photo = document.getElementById('hero-photo');
  if (!photo) return;
  const photos = [photo.getAttribute('src'), photo.dataset.second];
  let selected = 0;
  const show = () => { photo.src = photos[selected]; };
  const change = () => { selected = 1 - selected; show(); };
  document.querySelector('[data-photo-prev]')?.addEventListener('click', change);
  document.querySelector('[data-photo-next]')?.addEventListener('click', change);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(change, 7000);
})();
