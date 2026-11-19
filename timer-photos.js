'use strict';
(() => {
  const photo = document.getElementById('hero-photo');
  if (!photo) return;
  const photos = [photo.getAttribute('src'), photo.dataset.second];
  let selected = 0;
  const credit = document.querySelector('[data-photo-credit]');
  const show = () => {
    photo.src = photos[selected];
    if (credit) credit.textContent = selected === 0 ? credit.dataset.first : credit.dataset.second;
  };
  const change = () => { selected = 1 - selected; show(); };
  document.querySelector('[data-photo-prev]')?.addEventListener('click', change);
  document.querySelector('[data-photo-next]')?.addEventListener('click', change);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(change, 7000);
})();
