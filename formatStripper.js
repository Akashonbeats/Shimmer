document.querySelector(".notepad").addEventListener("paste", (event) => {
  event.preventDefault();
  const text = (event.clipboardData || window.clipboardData).getData(
    "text/plain"
  );
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  selection.deleteFromDocument();
  selection.getRangeAt(0).insertNode(document.createTextNode(text));
});
