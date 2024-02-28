chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('youtube.com/shorts')) {
    chrome.tabs.sendMessage(tabId, { action: 'showButton' });
  }
});
