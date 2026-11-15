'use strict';
// Checkmarks update the visible count. The shared footer controls optional tab-only storage.
document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));
const checks = Array.from(document.querySelectorAll('[data-learning-check]'));
function updateCount() {
  const count = document.querySelector('[data-count]');
  if (count) count.textContent = String(checks.filter(input => input.checked).length);
}
checks.forEach(input => input.addEventListener('change', updateCount));
document.querySelectorAll('[data-reset]').forEach(button => button.addEventListener('click', () => {
  checks.forEach(input => { input.checked = false; });
  updateCount();
}));
updateCount();
