'use strict';
// Clicking the PhysioClock brand uses the visitor's browser language, not a stored preference.
(() => {
  const supported = new Set(['de', 'en', 'fr', 'it']);
  function browserLanguage() {
    const preferences = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]).filter(Boolean);
    for (const item of preferences) {
      const language = String(item).toLowerCase().split(/[-_]/)[0];
      if (supported.has(language)) return language;
    }
    return 'en';
  }
  for (const brand of document.querySelectorAll('a.site-brand')) {
    brand.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const root = location.pathname.replace(/\/(?:de|en|fr|it)\/[^/]*$/, '/').replace(/\/index\.html$/, '/');
      const base = root.endsWith('/') ? root : root + '/';
      location.assign(base + browserLanguage() + '/index.html');
    });
  }
})();
