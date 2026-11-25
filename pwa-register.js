// Remember the last selected page, week, day, and weight-table view locally.
(() => {
  const stateKey = 'yash-strength-navigation-v1';
  const names = ['page', 'week', 'day', 'lift', 'row'];

  function restoreNavigation() {
    try {
      const saved = JSON.parse(localStorage.getItem(stateKey) || '{}');
      for (const name of names) {
        const id = saved[name];
        if (!id) continue;
        const input = document.getElementById(id);
        if (input && input.type === 'radio' && input.name === name) input.checked = true;
      }
    } catch (error) {
      console.warn('Yash Strength navigation restore failed:', error);
    }
  }

  function saveNavigation() {
    try {
      const state = {};
      for (const name of names) {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        if (selected) state[name] = selected.id;
      }
      localStorage.setItem(stateKey, JSON.stringify(state));
    } catch (error) {
      console.warn('Yash Strength navigation save failed:', error);
    }
  }

  restoreNavigation();
  for (const name of names) {
    document.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
      input.addEventListener('change', saveNavigation);
    });
  }
})();

// Give the month timeline markers brighter, more saturated versions of their phase colours.
(() => {
  const style = document.createElement('style');
// Month markers use explicit saturated colours, independent of the muted theme palette.
  style.textContent = [
    '.months .m-dots i[style*="c-start"]{background:#3b9cff!important;box-shadow:0 0 0 1px #3b9cff!important}',
    '.months .m-dots i[style*="c-build"]{background:#22d65e!important;box-shadow:0 0 0 1px #22d65e!important}',
    '.months .m-dots i[style*="c-strength"]{background:#a78bfa!important;box-shadow:0 0 0 1px #a78bfa!important}',
    '.months .m-dots i[style*="c-heavy"]{background:#ff8a32!important;box-shadow:0 0 0 1px #ff8a32!important}',
    '.months .m-dots i[style*="c-easy"]{background:#ffd21f!important;box-shadow:0 0 0 1px #ffd21f!important}',
    '.months .m-dots i[style*="c-peak"]{background:#ff5f91!important;box-shadow:0 0 0 1px #ff5f91!important}'
  ].join('');
  document.head.appendChild(style);
})();

// Register the offline service worker.
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .catch((error) => console.warn('Yash Strength offline setup failed:', error));
  });
}
