const loopVideoTabIds = [];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) {
    return;
  }

  if (tab.url.includes('youtube.com') && !tab.url.includes('watch')) {
    chrome.tabs.sendMessage(tabId, { action: 'disconnect-ads-observer' });
  }

  if (tab.url.includes('youtube.com/shorts')) {
    chrome.tabs.sendMessage(tabId, { action: 'show-shorts-to-video-button' });
  }

  if (tab.url.includes('youtube.com/watch')) {
    chrome.tabs.sendMessage(tabId, { action: 'auto-skip-ads' });
  }

  if (tab.url.includes('youtube.com/watch') && loopVideoTabIds.includes(tabId)) {
    chrome.tabs.sendMessage(tabId, { action: 'loop-video' });
    loopVideoTabIds.splice(loopVideoTabIds.indexOf(tabId), 1);
  }
});

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === 'open-video-from-shorts') {
    chrome.tabs.create({ url: request.url }, (tab) => loopVideoTabIds.push(tab.id));
  }
});
