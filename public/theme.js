/* Apply the saved theme before paint and enhance the navigation toggle. */
(() => {
  const {document} = globalThis;
  const root = document.documentElement;
  const key = 'portfolio-theme';

  function restoreTheme() {
    try {
      const saved = globalThis.localStorage.getItem(key);
      root.dataset.theme = saved === 'light' ? 'light' : 'dark';
    } catch {
      // Storage can be disabled. The toggle still works for this page.
    }
  }

  restoreTheme();

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('[data-theme-toggle]');
    if (!(button instanceof globalThis.HTMLButtonElement)) return;

    function syncButton() {
      button.setAttribute(
        'aria-pressed',
        String(root.dataset.theme === 'light'),
      );
    }

    syncButton();
    button.hidden = false;
    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      syncButton();
      try {
        globalThis.localStorage.setItem(key, root.dataset.theme);
      } catch {
        // The current page already reflects the visitor's choice.
      }
    });
    globalThis.addEventListener('pageshow', () => {
      restoreTheme();
      syncButton();
    });
  });
})();
