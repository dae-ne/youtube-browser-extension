const loopVideoTabIds = [];
const { create, sendMessage } = chrome.tabs;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) {
    return;
  }

  if (tab.url.includes('youtube.com/shorts')) {
    sendMessage(tabId, { action: 'show-shorts-to-video-button' });
    sendMessage(tabId, { action: 'add-shorts-ui-updates' });
  }

  if (tab.url.includes('youtube.com/watch')) {
    sendMessage(tabId, { action: 'auto-skip-ads' });
  }

  if (tab.url.includes('youtube.com/watch') && loopVideoTabIds.includes(tabId)) {
    sendMessage(tabId, { action: 'loop-video' });
    loopVideoTabIds.splice(loopVideoTabIds.indexOf(tabId), 1);
  }

  if (tab.url.includes('youtube.com') && !tab.url.includes('watch')) {
    sendMessage(tabId, { action: 'disconnect-ads-observer' });
  }

  if (tab.url.includes('youtube.com') && !tab.url.includes('shorts')) {
    sendMessage(tabId, { action: 'remove-shorts-global-css-classes' });
  }
});

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === 'open-video-from-shorts') {
    create({ url: request.url }, (tab) => loopVideoTabIds.push(tab.id));
  }
});
