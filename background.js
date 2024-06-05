const options = {};
const loopVideoTabIds = [];

function updateApp(url, tabId) {
  // TODO: handle switching options off

  const { sendMessage } = chrome.tabs;

  const {
    autoSkipAds,
    showShortsToVideoButton,
    loopShortsToVideo,
    updateShortsUI,
    // TODO: handle the removeAds option
  } = options;

  if (url.includes('youtube.com/shorts')) {
    showShortsToVideoButton && sendMessage(tabId, { action: 'show-shorts-to-video-button' });
    updateShortsUI && sendMessage(tabId, { action: 'add-shorts-ui-updates' });
  }

  if (url.includes('youtube.com/watch')) {
    autoSkipAds && sendMessage(tabId, { action: 'auto-skip-ads' });
  }

  if (url.includes('youtube.com/watch') && loopVideoTabIds.includes(tabId)) {
    loopShortsToVideo && sendMessage(tabId, { action: 'loop-video' });
    loopVideoTabIds.splice(loopVideoTabIds.indexOf(tabId), 1);
  }

  if (url.includes('youtube.com') && !url.includes('watch')) {
    sendMessage(tabId, { action: 'disconnect-ads-observer' });
  }

  if (url.includes('youtube.com') && !url.includes('shorts')) {
    sendMessage(tabId, { action: 'remove-shorts-global-css-classes' });
  }
}

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
    removeAds: true
  };

  chrome.storage.sync.set(initialOptions);
  Object.assign(options, data);
});

chrome.storage.onChanged.addListener((changes) => {
  for (const [name, { newValue }] of Object.entries(changes)) {
    options[name] = newValue;
  }

  chrome.tabs.query({ url: 'https://www.youtube.com/*' }, (tabs) => {
    tabs.forEach(({ id, url }) => updateApp(url, id));
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const { url } = tab;

  if (changeInfo.status !== 'complete' || !url) {
    return;
  }

  updateApp(url, tabId);
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
