// Remember the last selected page, week, day, and weight-table view locally.
(() => {
  const stateKey = 'yash-strength-navigation-v1';
  const names = ['page', 'week', 'day', 'lift', 'row'];
  function restoreNavigation() {
    try {
      const saved = JSON.parse(localStorage.getItem(stateKey) || '{}');
      for (const name of names) {
        const id = saved[name];
        const input = id && document.getElementById(id);
        if (input && input.type === 'radio' && input.name === name) input.checked = true;
      }
    } catch (error) { console.warn('Navigation restore failed:', error); }
  }
  function saveNavigation() {
    try {
      const state = {};
      for (const name of names) {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        if (selected) state[name] = selected.id;
      }
      localStorage.setItem(stateKey, JSON.stringify(state));
    } catch (error) { console.warn('Navigation save failed:', error); }
  }
  restoreNavigation();
  for (const name of names) {
    document.querySelectorAll(`input[name="${name}"]`).forEach(input => input.addEventListener('change', saveNavigation));
  }
})();

// Map each phase variable to its own bright fill. Set both --c and background
// because the original stylesheet paints month markers with background:var(--c).
(() => {
  const style = document.createElement('style');
  const phases = {
    start: '#3b9cff',
    build: '#22d65e',
    strength: '#a78bfa',
    heavy: '#ff8a32',
    easy: '#ffd21f',
    peak: '#ff5f91'
  };
  const rules = [
    '.m-dots i[style*="--c:var(--c-"], .dot[style*="--c:var(--c-"]{box-shadow:0 0 0 1px var(--phase-edge)!important}'
  ];
  for (const [phase, color] of Object.entries(phases)) {
    const selector = `.m-dots i[style*="--c:var(--c-${phase})"], .dot[style*="--c:var(--c-${phase})"]`;
    rules.push(`${selector}{--c:${color}!important;background:${color}!important;background-color:${color}!important}`);
  }
  rules.push('.m-dots i{width:8px!important;height:8px!important;min-width:8px!important;flex:0 0 8px!important;border-radius:50%!important}');
  rules.push('.dot[style*="--c:var(--c-"]{display:inline-block!important;width:8px!important;height:8px!important;min-width:8px!important;min-height:8px!important;flex:0 0 8px!important;aspect-ratio:1/1!important;border-radius:50%!important}');
  style.textContent = rules.join('\n');
  document.head.appendChild(style);
})();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', {scope:'./'})
      .catch(error => console.warn('Offline setup failed:', error));
  });
}
