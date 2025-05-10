document.addEventListener("DOMContentLoaded", () => {
  const notepad = document.querySelector(".notepad");

  // Load saved text from localStorage
  const savedText = localStorage.getItem("notepadContent");
  if (savedText) {
    notepad.textContent = savedText;
  }

  // Save text to localStorage on input
  notepad.addEventListener("input", () => {
    localStorage.setItem("notepadContent", notepad.textContent);
  });
});
