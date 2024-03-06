let isShortsContentScriptLoaded = false;
let isVideoContentScriptLoaded = false;

function sendMessages(tabId, changeInfo, tab) {
  if (changeInfo.status !== 'complete' || !tab.url) {
    return;
  }

  if (tab.url.includes('youtube.com') && !tab.url.includes('watch')) {
    chrome.tabs.sendMessage(tabId, { action: 'disconnect-ads-observer' });
  }

  if (tab.url.includes('youtube.com/shorts')) {
    chrome.tabs.sendMessage(tabId, { action: 'show-shorts-to-video-button' });
    return;
  }

  if (tab.url.includes('youtube.com/watch')) {
    chrome.tabs.sendMessage(tabId, { action: 'auto-skip-ads' });
    return;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'shorts-content-script-loaded':
      isShortsContentScriptLoaded = true;
      break;
    case 'video-content-script-loaded':
      isVideoContentScriptLoaded = true;
      break;
  }

  if (isShortsContentScriptLoaded && isVideoContentScriptLoaded) {
    const { tab } = sender;
    sendMessages(tab.id, { status: 'complete' }, tab);
    chrome.tabs.onUpdated.addListener(sendMessages);
  }

  sendResponse({ status: 'success' });
});
