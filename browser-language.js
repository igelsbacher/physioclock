'use strict';

(() => {
  const languages = new Set(['de', 'en', 'fr', 'it']);
  const languageLinks = [...document.querySelectorAll('.pc-language a[hreflang]')];
  const checks = [...document.querySelectorAll('.pc-checklist input[type=checkbox], [data-learning-check]')];
  const toggle = document.querySelector('[data-session-preferences]');
  const status = document.querySelector('[data-session-status]');
  const storageKey = 'physioclock.website.preferences.v1';
  const page = location.pathname.replace(/\/$/, '/index.html');
  let preferences = null;

  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
    if (saved?.enabled === true) preferences = saved;
  } catch {
    // The site remains usable when browser storage is blocked.
  }

  function updateControl() {
    if (!toggle) return;
    toggle.hidden = false;
    toggle.textContent = preferences ? toggle.dataset.disable : toggle.dataset.enable;
    toggle.setAttribute('aria-pressed', String(Boolean(preferences)));
    status.textContent = preferences ? toggle.dataset.active : '';
  }

  function persist() {
    try {
      if (preferences) sessionStorage.setItem(storageKey, JSON.stringify(preferences));
      else sessionStorage.removeItem(storageKey);
      return true;
    } catch {
      return false;
    }
  }

  function rememberChecks() {
    if (!preferences || !checks.length) return;
    preferences.checks[page] = checks.map(check => check.checked);
    persist();
  }

  const savedChecks = preferences?.checks?.[page];
  if (Array.isArray(savedChecks)) checks.forEach((check, index) => {
    if (typeof savedChecks[index] === 'boolean') check.checked = savedChecks[index];
    check.dispatchEvent(new Event('change'));
  });
  checks.forEach(check => check.addEventListener('change', rememberChecks));
  document.querySelectorAll('[data-reset]').forEach(button => button.addEventListener('click', () => queueMicrotask(rememberChecks)));

  toggle?.addEventListener('click', () => {
    const previous = preferences;
    if (previous) {
      preferences = null;
    } else {
      const language = document.documentElement.lang.slice(0, 2);
      preferences = { enabled: true, language, checks: {} };
      if (checks.length) preferences.checks[page] = checks.map(check => check.checked);
    }
    const stored = persist();
    if (!stored) preferences = previous;
    updateControl();
    if (!stored) status.textContent = toggle.dataset.error;
  });

  languageLinks.forEach(link => link.addEventListener('click', () => {
    if (!preferences || !languages.has(link.hreflang)) return;
    preferences.language = link.hreflang;
    persist();
  }));

  function preferredLanguage() {
    if (languages.has(preferences?.language)) return preferences.language;
    const browser = navigator.languages?.length ? navigator.languages : [navigator.language];
    return browser.map(item => String(item).toLowerCase().split(/[-_]/)[0]).find(item => languages.has(item)) || 'en';
  }

  for (const brand of document.querySelectorAll('a.site-brand')) {
    brand.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const root = location.pathname.replace(/\/(?:de|en|fr|it)\/[^/]*$/, '/').replace(/\/index\.html$/, '/');
      const base = root.endsWith('/') ? root : root + '/';
      location.assign(base + preferredLanguage() + '/index.html');
    });
  }

  const header = document.querySelector('.pc-topbar');
  if (header && document.querySelector('.pc-privacy')) {
    const updateAnchorOffset = () => {
      document.documentElement.style.setProperty('--pc-anchor-offset', Math.ceil(header.getBoundingClientRect().height + 20) + 'px');
    };
    updateAnchorOffset();
    if ('ResizeObserver' in window) new ResizeObserver(updateAnchorOffset).observe(header);
  }
  updateControl();
})();
