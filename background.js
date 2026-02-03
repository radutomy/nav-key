const scroll = (tab, amount, smooth = false) => {
  browser.tabs.executeScript(tab.id, {
    code: `
      (() => {
        const opts = { top: ${amount}, behavior: '${smooth ? 'smooth' : 'auto'}' };
        if (document.documentElement.scrollHeight > innerHeight) return scrollBy(opts);

        const target = [...document.querySelectorAll('*')]
          .filter(el => {
            const s = getComputedStyle(el).overflowY;
            return (s === 'auto' || s === 'scroll') && el.scrollHeight > el.clientHeight;
          })
          .sort((a, b) => (b.clientWidth * b.clientHeight) - (a.clientWidth * a.clientHeight))[0];

        target?.scrollBy(opts);
      })();
    `
  });
};

const switchTab = (tabs, currentIndex, delta) => {
  const newIndex = (currentIndex + delta + tabs.length) % tabs.length;
  browser.tabs.update(tabs[newIndex].id, { active: true });
};

// ==================== Search Providers ====================

/**
 * Custom search providers with keyword shortcuts
 * Usage: Type keyword + space + query in the address bar
 * Examples: "aa wireless mouse", "m london", "y cat videos"
 */
const SEARCH_PROVIDERS = {
  aa: 'https://www.amazon.co.uk/s?k=',
  m: 'https://www.google.com/maps/search/',
  y: 'https://www.youtube.com/results?search_query='
};

// ==================== Keyboard Commands ====================

const handleCommand = async (command) => {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const activeTab = tabs.find(t => t.active);
  const activeIndex = tabs.indexOf(activeTab);

  const commands = {
    // Tab navigation (Vim-style HJKL)
    "previous-tab": () => switchTab(tabs, activeIndex, -1),
    "next-tab": () => switchTab(tabs, activeIndex, 1),
    "close-tab": () => activeTab && browser.tabs.remove(activeTab.id),
    "new-tab": () => browser.tabs.create({}),

    // Scrolling (Vim-style D/U and E/Y)
    "scroll-down-30": () => activeTab && scroll(activeTab, "window.innerHeight * 0.3", true),
    "scroll-up-30": () => activeTab && scroll(activeTab, "-window.innerHeight * 0.3", true),
    "scroll-down-20px": () => activeTab && scroll(activeTab, 20),
    "scroll-up-20px": () => activeTab && scroll(activeTab, -20),

    // Browser history (Vim-style O/I)
    "go-back": () => activeTab && browser.tabs.goBack(activeTab.id),
    "go-forward": () => activeTab && browser.tabs.goForward(activeTab.id),
  };

  commands[command]?.();
};

// Handle commands from manifest keyboard shortcuts (fallback for restricted pages)
browser.commands.onCommand.addListener(handleCommand);

// Handle commands from content script (for exclusive shortcut control)
browser.runtime.onMessage.addListener((message) => {
  if (message.command) {
    handleCommand(message.command);
  }
});

// ==================== Search Provider Redirect ====================

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    const query = url.searchParams.get('q');
    if (!query) return;

    // Check if query matches any search provider keyword pattern
    for (const [keyword, searchUrl] of Object.entries(SEARCH_PROVIDERS)) {
      const match = query.match(new RegExp(`^${keyword}\\s+(.+)$`));
      if (match) {
        return { redirectUrl: searchUrl + encodeURIComponent(match[1]) };
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
