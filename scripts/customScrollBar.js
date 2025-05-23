
// Custom scrolling behavior with grab cursor

document.addEventListener('DOMContentLoaded', function() {
  const notepad = document.querySelector('.notepad');
  let isScrolling = false;
  let startY;
  let scrollTop;
  
  // Create a custom scroll handle
  const scrollHandle = document.createElement('div');
  scrollHandle.className = 'custom-scroll-handle';
  notepad.parentElement.appendChild(scrollHandle);
  
  // Style for custom scroll handle
  const style = document.createElement('style');
  style.textContent = `
    .custom-scroll-handle {
      position: absolute;
      right: 27px;
      top: 0;
      width: 8px;
      height: 100%;
      cursor: default;
      z-index: 100;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .custom-scroll-handle:hover, .custom-scroll-handle.active {
      opacity: 1;
      cursor: grab;
    }
    .custom-scroll-handle.active {
      cursor: grabbing;
    }
    body.grabbing {
      cursor: grabbing !important;
    }
  `;
  document.head.appendChild(style);
  
  // Handle mousedown on the scrollbar area
  scrollHandle.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return; // Only handle left clicks
    
    isScrolling = true;
    startY = e.clientY;
    scrollTop = notepad.scrollTop;
    scrollHandle.classList.add('active');
    document.body.classList.add('grabbing');
    
    e.preventDefault();
  });
  
  // Handle mousemove to scroll
  document.addEventListener('mousemove', function(e) {
    if (!isScrolling) return;
    
    const deltaY = e.clientY - startY;
    const scrollFactor = 1.5; // Adjust scrolling speed
    notepad.scrollTop = scrollTop + deltaY * scrollFactor;
  });
  
  // Handle mouseup to stop scrolling
  document.addEventListener('mouseup', function() {
    if (isScrolling) {
      isScrolling = false;
      scrollHandle.classList.remove('active');
      document.body.classList.remove('grabbing');
    }
  });
  
  // Handle mouse leave to stop scrolling
  document.addEventListener('mouseleave', function() {
    if (isScrolling) {
      isScrolling = false;
      scrollHandle.classList.remove('active');
      document.body.classList.remove('grabbing');
    }
  });
  
  // Position the scroll handle
  function updateScrollHandlePosition() {
    const rect = notepad.getBoundingClientRect();
    scrollHandle.style.top = `${rect.top}px`;
    scrollHandle.style.height = `${rect.height}px`;
  }
  
  // Update handle position on resize
  window.addEventListener('resize', updateScrollHandlePosition);
  
  // Initial positioning
  updateScrollHandlePosition();
});