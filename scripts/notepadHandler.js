const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const notepad = document.querySelector(".notepad");

  // Load the content of the text file on startup
  ipcRenderer.invoke("read-file").then((content) => {
    notepad.innerHTML = content || ""; // Set content or empty if file is empty
  });

  // Save content to the text file on input
  notepad.addEventListener("input", () => {
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
});
