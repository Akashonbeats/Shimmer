// Lightweight haptics helper for macOS via IPC
(function () {
  if (typeof require !== "function") return;
  const { ipcRenderer } = require("electron");

  function haptic(kind) {
    ipcRenderer.invoke("haptic", kind).catch(() => {});
  }

  // Simple throttle to avoid spawning too many helper processes
  let lastAt = 0;
  function hapticThrottled(payload, minInterval = 120) {
    const now = Date.now();
    if (now - lastAt < minInterval) return;
    lastAt = now;
    ipcRenderer.invoke("haptic", payload).catch(() => {});
  }

  function bindHaptics() {
    const nodes = document.querySelectorAll(
      ".format-bar button, .dial-checkbox, .info"
    );
    nodes.forEach((el) => {
      if (el.dataset.hapticsBound) return;
      el.dataset.hapticsBound = "1";
      // Light tick on hover (throttled)
      el.addEventListener("mouseenter", () =>
        hapticThrottled("alignment", 200)
      );
      // Immediate press feedback; avoid double-firing by not also calling on click
      el.addEventListener("mousedown", () =>
        hapticThrottled({ pattern: "generic", count: 2, intervalMs: 25 }, 120)
      );
    });
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", bindHaptics, { once: true });
  } else {
    // DOM already loaded when script runs at end of body
    bindHaptics();
  }
})();
