document.addEventListener("DOMContentLoaded", () => {
  const notepad = document.querySelector(".notepad");
  notepad.focus();
  window.addEventListener("pageshow", () => {
    notepad.focus();
  });
});
