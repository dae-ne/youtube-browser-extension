const options = {};
const loopVideoTabIds = [];

chrome.storage.sync.get().then((data) => {
  const dataExists = data && Object.keys(data).length;

  if (dataExists){
    Object.assign(options, data);
    return;
  }

  const initialOptions = {
    autoSkipAds: true,
    showShortsToVideoButton: true,
    loopShortsToVideo: false,
    updateShortsUI: true,
    removeAds: true,
  };

  chrome.storage.sync.set(initialOptions);
  Object.assign(options, data);
});

chrome.storage.onChanged.addListener((changes) => {
  for (const [name, { newValue }] of Object.entries(changes)) {
    options[name] = newValue;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) {
    return;
  }

  const { sendMessage } = chrome.tabs;

  const {
    loopShortsToVideo,
    showShortsToVideoButton,
    updateShortsUI,
    autoSkipAds
  } = options;

  if (tab.url.includes('youtube.com/shorts')) {
    showShortsToVideoButton && sendMessage(tabId, { action: 'show-shorts-to-video-button' });
    updateShortsUI && sendMessage(tabId, { action: 'add-shorts-ui-updates' });
  }

  if (tab.url.includes('youtube.com/watch')) {
    autoSkipAds && sendMessage(tabId, { action: 'auto-skip-ads' });
  }

  if (tab.url.includes('youtube.com/watch') && loopVideoTabIds.includes(tabId)) {
    loopShortsToVideo && sendMessage(tabId, { action: 'loop-video' });
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
  const { create } = chrome.tabs;

  if (request.action === 'open-video-from-shorts') {
    create({
      url: request.url,
      index: sender.tab.index + 1,
      openerTabId: sender.tab.id
    }, (tab) => loopVideoTabIds.push(tab.id));
  }
});
