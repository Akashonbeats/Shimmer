// Performance optimization for animations and event handlers

// Throttle function to limit how often a function can execute
function throttle(callback, delay = 100) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback.apply(this, args);
    }
  };
}

// Debounce function to postpone execution until after a wait period
function debounce(callback, wait = 300) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(this, args), wait);
  };
}

// Throttle save operation
document.querySelector('.notepad').addEventListener('input', debounce(function(e) {
  const notepad = document.querySelector('.notepad');
  const content = notepad.innerHTML;
  require('electron').ipcRenderer.send('save-file', content);
}, 500));