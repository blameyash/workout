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

// Bright phase fills on every marker, with the plan's original theme-aware outline.
(() => {
  const style = document.createElement('style');
  const marker = 'i[style*="--c:var(--c-"], .dot[style*="--c:var(--c-"]';
  style.textContent = [
    `${marker}{outline:1px solid var(--phase-edge)!important;outline-offset:0!important;box-shadow:none!important}`,
    'i.m-dots, .m-dots i{width:8px!important;height:8px!important}',
    '[style*="--c:var(--c-start)"]{background-color:#3b9cff!important}',
    '[style*="--c:var(--c-build)"]{background-color:#22d65e!important}',
    '[style*="--c:var(--c-strength)"]{background-color:#a78bfa!important}',
    '[style*="--c:var(--c-heavy)"]{background-color:#ff8a32!important}',
    '[style*="--c:var(--c-easy)"]{background-color:#ffd21f!important}',
    '[style*="--c:var(--c-peak)"]{background-color:#ff5f91!important}'
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
