// Content script to intercept keyboard shortcuts before the page can handle them
// This gives the extension exclusive control over these shortcuts

const SHORTCUTS = {
  'h': 'previous-tab',
  'l': 'next-tab',
  'j': 'close-tab',
  'k': 'new-tab',
  'd': 'scroll-down-30',
  'u': 'scroll-up-30',
  'e': 'scroll-down-20px',
  'y': 'scroll-up-20px',
  'o': 'go-back',
  'i': 'go-forward'
};

document.addEventListener('keydown', (event) => {
  // Only handle Ctrl+key (not Cmd on Mac, use MacCtrl)
  if (!event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
    return;
  }

  const key = event.key.toLowerCase();
  const command = SHORTCUTS[key];

  if (command) {
    // Stop the event from reaching the page
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    // Send command to background script
    browser.runtime.sendMessage({ command });
  }
}, true); // 'true' = capturing phase, intercepts before page handlers
