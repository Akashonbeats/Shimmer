const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const notepad = document.querySelector(".notepad");

  // Load the content of the text file on startup
  ipcRenderer.invoke("read-file").then((content) => {
    notepad.innerHTML = content || ""; // Set content or empty if file is empty
  });

  // Function to check if content is empty and reset formatting if needed
  function checkAndResetFormatting() {
    // Check if content is empty (accounting for possible HTML artifacts)
    if (!notepad.textContent.trim() && notepad.innerHTML.replace(/<br>|&nbsp;/g, '').trim() === '') {
      // Clear all HTML to reset formatting
      notepad.innerHTML = '';
      
      // Explicitly remove all formatting states
      document.execCommand("removeFormat", false, null);
      document.execCommand("outdent", false, null);
      
      // Reset list formatting if any
      document.execCommand("insertText", false, "");
      
      // Reset selection to avoid carrying over formatting
      const selection = window.getSelection();
      selection.removeAllRanges();
      
      // Create a new range at the start of the notepad
      const range = document.createRange();
      range.setStart(notepad, 0);
      range.collapse(true);
      selection.addRange(range);
    }
  }

  // Save content to the text file on input
  notepad.addEventListener("input", () => {
    checkAndResetFormatting(); // Check and reset formatting if empty
    ipcRenderer.send("save-file", notepad.innerHTML);
  });

  // Handle paste event to strip hyperlinks and ensure plain text
  notepad.addEventListener("paste", (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const text = clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text); // Insert plain text
  });

  // Handle copy event to strip color data
  notepad.addEventListener("copy", (event) => {
    event.preventDefault();
    const selection = window.getSelection();
    if (selection) {
      const plainText = selection.toString(); // Get plain text
      event.clipboardData.setData("text/plain", plainText); // Set plain text to clipboard
    }
  });

  // Also check formatting when notepad regains focus
  notepad.addEventListener("focus", checkAndResetFormatting);
});
