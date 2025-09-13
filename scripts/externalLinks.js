// scripts/externalLinks.js
// Handles opening <a class="browser" ...> links in the user's default browser.
(function () {
  if (window.__externalBrowserLinkHandlerInstalled) return;
  window.__externalBrowserLinkHandlerInstalled = true;
  const electron = (() => {
    try {
      return require("electron");
    } catch (_) {
      return null;
    }
  })();
  if (!electron || !electron.shell) {
    console.error("External link handler: electron.shell missing");
    return;
  }
  function isHttp(url) {
    return /^https?:\/\//i.test(url);
  }
  function openExternal(url) {
    Promise.resolve(electron.shell.openExternal(url)).catch((err) =>
      console.error("openExternal failed", err)
    );
  }
  function handler(e) {
    const a = e.currentTarget;
    if (!a.classList.contains("browser")) return;
    const href = a.getAttribute("href");
    if (!href || !isHttp(href)) return;
    e.preventDefault();
    e.stopPropagation();
    openExternal(href);
  }
  function attach(a) {
    if (a.__browserHandlerAttached) return;
    a.__browserHandlerAttached = true;
    a.setAttribute("rel", "noopener");
    a.addEventListener("click", handler, true);
    a.addEventListener("auxclick", handler, true);
    a.addEventListener(
      "keydown",
      function (e) {
        if (
          (e.key === "Enter" || e.key === " ") &&
          a.classList.contains("browser")
        )
          handler(e);
      },
      true
    );
  }
  document.querySelectorAll("a.browser").forEach(attach);
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      if (
        m.type === "attributes" &&
        m.target.tagName === "A" &&
        m.attributeName === "class"
      ) {
        if (m.target.classList.contains("browser")) attach(m.target);
      }
      m.addedNodes &&
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 1) {
            if (n.matches && n.matches("a.browser")) attach(n);
            n.querySelectorAll &&
              n.querySelectorAll("a.browser").forEach(attach);
          }
        });
    }
  });
  mo.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["class"],
  });
  console.log("External browser link handler installed");
})();
