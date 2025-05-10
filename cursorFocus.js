document.addEventListener("DOMContentLoaded", () => {
  const notepad = document.querySelector(".notepad");

  function placeCaretAtEnd(element) {
    if (!element.lastChild) {
      element.appendChild(document.createTextNode(""));
    }
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  notepad.focus();
  placeCaretAtEnd(notepad);

  window.addEventListener("pageshow", () => {
    notepad.focus();
    placeCaretAtEnd(notepad);
  });
});
