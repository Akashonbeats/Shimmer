
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

// Optimize animation rendering by checking if element is visible
function optimizeAnimations() {
  // Get all animated elements
  const animatedElements = document.querySelectorAll('.blobs div');
  
  // Check if app is in background or screensaver is active
  const isScreensaverActive = document.getElementById('screensaverCheckBox').checked;
  
  // Reduce animation complexity when not needed
  animatedElements.forEach(element => {
    if (isScreensaverActive || document.hidden) {
      element.style.animationPlayState = 'paused';
    } else {
      element.style.animationPlayState = 'running';
    }
  });
}

// Listen for visibility changes to pause animations when tab is not visible
document.addEventListener('visibilitychange', optimizeAnimations);

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function() {
  // Start monitoring for optimization opportunities
  optimizeAnimations();
  
  // Check if screensaver mode is on to optimize accordingly
  document.getElementById('screensaverCheckBox').addEventListener('change', optimizeAnimations);
});