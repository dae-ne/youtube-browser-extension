chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) {
    return;
  }

  if (tab.url.includes('youtube.com/shorts')) {
    chrome.tabs.sendMessage(tabId, { action: 'show-shorts-to-video-button' });
    return;
  }

  if (tab.url.includes('youtube.com/watch')) {
    chrome.tabs.sendMessage(tabId, { action: 'skip-ads' });
    return;
  } else {
    chrome.tabs.sendMessage(tabId, { action: 'disconnect-ads-observer' });
  }
});
