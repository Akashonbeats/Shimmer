document.addEventListener("DOMContentLoaded", () => {
  const notepad = document.querySelector(".notepad");
  notepad.addEventListener("input", (e) => {
    if (!e.target.innerText.trim()) {
      e.target.innerHTML = "";
    }
  });
  notepad.focus();
  window.addEventListener("pageshow", () => {
    notepad.focus();
  });
});
