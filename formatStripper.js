// Start - sanitizeHTML function
function sanitizeHTML(html) {
  const allowedTags = ['B','STRONG','I','EM','U','S','STRIKE','UL','OL','LI'];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  function traverse(node) {
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      const child = node.childNodes[i];
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (!allowedTags.includes(child.nodeName)) {
          // Unwrap child, preserving its text or nested tags
          while (child.firstChild) {
            node.insertBefore(child.firstChild, child);
          }
          node.removeChild(child);
        } else {
          // Remove attributes
          while (child.attributes.length) {
            child.removeAttribute(child.attributes[0].name);
          }
          traverse(child);
        }
      } else if (child.nodeType !== Node.TEXT_NODE) {
        node.removeChild(child);
      }
    }
  }
  
  traverse(doc.body);
  return doc.body.innerHTML;
}
// End - sanitizeHTML function

// Start - paste event listener
document.querySelector(".notepad").addEventListener("paste", (event) => {
  event.preventDefault();
  let clipboardHtml = (event.clipboardData || window.clipboardData).getData("text/html");
  if (!clipboardHtml) {
    clipboardHtml = (event.clipboardData || window.clipboardData).getData("text/plain");
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(clipboardHtml));
  } else {
    clipboardHtml = sanitizeHTML(clipboardHtml);
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    selection.deleteFromDocument();
    const range = selection.getRangeAt(0);
    const fragment = range.createContextualFragment(clipboardHtml);
    range.insertNode(fragment);
  }
});
// End - paste event listener
