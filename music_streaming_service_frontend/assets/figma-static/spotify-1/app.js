(function () {
  'use strict';

  // Minimal helpers
  function qs(sel, el = document) { return el.querySelector(sel); }
  function qsa(sel, el = document) { return Array.from(el.querySelectorAll(sel)); }

  // Tab-like behavior for "Show all" buttons (no navigation, demo only)
  qsa('[data-action="show-all"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const section = btn.getAttribute('data-section') || 'section';
      alert('Show all clicked for: ' + section);
    });
  });

  // Mock play action on any element with data-action="play"
  qsa('[data-action="play"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const card = el.closest('.card');
      const title = card ? qs('.card__title', card)?.textContent?.trim() : 'Unknown';
      el.classList.toggle('is-playing');
      if (el.classList.contains('is-playing')) {
        el.textContent = '⏸ Playing...';
      } else {
        el.textContent = '▶️ Play';
      }
      console.log('Toggled play for', title);
      // Reset label back after short delay to retain original description
      setTimeout(() => {
        if (!card) return;
        const desc = qs('.card__desc', card);
        if (desc && desc.contains(el)) {
          el.textContent = 'The original chill instrumental beats playlist.';
        }
      }, 1200);
    });
  });

  // Buttons: sign up, login, create playlist, lang
  const btnSignup = qs('#btn-signup');
  const btnLogin = qs('#btn-login');
  const btnSignupFree = qs('#btn-signup-free');
  const btnCreatePl = qs('#btn-create-playlist');
  const btnLang = qs('#btn-lang');

  btnSignup?.addEventListener('click', () => alert('Sign up clicked'));
  btnLogin?.addEventListener('click', () => alert('Log in clicked'));
  btnSignupFree?.addEventListener('click', () => alert('Sign up free clicked'));
  btnCreatePl?.addEventListener('click', () => alert('Create Playlist clicked'));
  btnLang?.addEventListener('click', () => alert('Language selector clicked'));

  // Example: inject sample cards programmatically (kept minimal; real data would fetch then render)
  // For now, static HTML reflects the Figma layout; hook present for future integration.
})();
