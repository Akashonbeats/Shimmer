// Lightweight haptics helper for macOS via IPC
(function () {
  if (typeof require !== "function") return;
  const { ipcRenderer } = require("electron");

  function haptic(kind) {
    ipcRenderer.invoke("haptic", kind).catch(() => {});
  }

  function bindHaptics() {
    const nodes = document.querySelectorAll(
      ".format-bar button, .dial-checkbox, .info"
    );
    nodes.forEach((el) => {
      if (el.dataset.hapticsBound) return;
      el.dataset.hapticsBound = "1";
      el.addEventListener('mouseenter', () => haptic({ pattern: 'generic' }));
      // el.addEventListener('mousedown', () => haptic({ pattern: 'levelChange', count: 1, intervalMs: 25, time: 'now' }));
      el.addEventListener("click", () => haptic({ pattern: 'alignment' }));
    });
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", bindHaptics, { once: true });
  } else {
    // DOM already loaded when script runs at end of body
    bindHaptics();
  }
})();
