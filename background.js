const scroll = (tab, amount, smooth = false) => {
  const behavior = smooth ? 'smooth' : 'auto';
  browser.tabs.executeScript(tab.id, {
    code: `window.scrollBy({ top: ${amount}, behavior: '${behavior}' });`
  });
};

const switchTab = (tabs, currentIndex, delta) => {
  const newIndex = (currentIndex + delta + tabs.length) % tabs.length;
  browser.tabs.update(tabs[newIndex].id, { active: true });
};

browser.commands.onCommand.addListener(async (command) => {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const activeTab = tabs.find(t => t.active);
  const activeIndex = tabs.indexOf(activeTab);

  const commands = {
    "previous-tab": () => switchTab(tabs, activeIndex, -1),
    "next-tab": () => switchTab(tabs, activeIndex, 1),
    "close-tab": () => activeTab && browser.tabs.remove(activeTab.id),
    "new-tab": () => browser.tabs.create({}),
    "scroll-down-30": () => activeTab && scroll(activeTab, "window.innerHeight * 0.3", true),
    "scroll-up-30": () => activeTab && scroll(activeTab, "-window.innerHeight * 0.3", true),
    "scroll-down-20px": () => activeTab && scroll(activeTab, 20),
    "scroll-up-20px": () => activeTab && scroll(activeTab, -20),
  };

  commands[command]?.();
});
