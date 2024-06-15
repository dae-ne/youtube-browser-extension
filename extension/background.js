'use strict';

import {
  loopVideo,
  addShortsUiUpdates,
  removeShortsCssClasses,
  removeShortsGlobalCssClasses
} from './content/injected-scripts';

/**
 * The options loaded from the storage.
 *
 * @type {Object}
 */
const options = {};

/**
 * The tab IDs of the tabs that are looping videos after opening them from the
 * shorts page.
 *
 * @type {number[]}
 */
const loopVideoTabIds = [];

/**
 * Updates the app based on the URL and the tab ID. It will send messages
 * to the content scripts and inject scripts based on the URL and the options.
 *
 * @param {string} url - The URL of the tab.
 * @param {number} tabId - The ID of the tab.
 */
function updateApp(url, tabId) {
  // TODO: handle switching options off

  const { sendMessage } = chrome.tabs;
  const { executeScript } = chrome.scripting;

  const {
    autoSkipAds,
    showShortsToVideoButton,
    loopShortsToVideo,
    updateShortsUI,
    // TODO: handle the removeAds option
  } = options;

  if (url.includes('youtube.com')) {
    updateShortsUI || executeScript({ target: { tabId }, func: removeShortsCssClasses });
  }

  if (url.includes('youtube.com/shorts')) {
    showShortsToVideoButton && sendMessage(tabId, { action: 'display-shorts-to-video-button' });
    updateShortsUI && executeScript({ target: { tabId }, func: addShortsUiUpdates });
  }

  if (url.includes('youtube.com/watch') && loopVideoTabIds.includes(tabId)) {
    loopShortsToVideo && executeScript({ target: { tabId }, func: loopVideo });
    loopVideoTabIds.splice(loopVideoTabIds.indexOf(tabId), 1);
  }

  if (url.includes('youtube.com') && !url.includes('watch')) {
    // The content script checks if a miniplayer is opened.
    // If it is, it will not disconnect the observer.
    sendMessage(tabId, { action: 'disconnect-advertisements-observer' });
  }

  if (url.includes('youtube.com') && !url.includes('shorts')) {
    autoSkipAds && sendMessage(tabId, { action: 'auto-skip-advertisements' });
    sendMessage(tabId, { action: 'shorts-to-video-button-cleanup' });
    executeScript({ target: { tabId }, func: removeShortsGlobalCssClasses });
  }
}

/**
 * Loads the options from the storage and assigns them to the options object.
 * If the options don't exist in the storage, it will create them with the
 * default values.
 */
chrome.storage.sync.get().then((data) => {
  const dataExists = data && Object.keys(data).length;

  if (dataExists){
    Object.assign(options, data);
    return;
  }

  const initialOptions = {
    autoSkipAds: true,
    showShortsToVideoButton: true,
    loopShortsToVideo: true,
    updateShortsUI: true,
    removeAds: true
  };

  chrome.storage.sync.set(initialOptions);
  Object.assign(options, data);
});

/**
 * Listens for storage changes and updates the options object. Triggers the
 * app update function with the new options for each youtube tab.
 */
chrome.storage.onChanged.addListener((changes) => {
  for (const [name, { newValue }] of Object.entries(changes)) {
    options[name] = newValue;
  }

  chrome.tabs.query({ url: 'https://www.youtube.com/*' }, (tabs) => {
    tabs.forEach(({ id, url }) => updateApp(url, id));
  });
});

/**
 * Listens for tab updates and triggers the app update function. The app update
 * function will update the content scripts and the injected scripts based on
 * the tab URL, options, and the tab ID.
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const { url } = tab;

  if (changeInfo.status !== 'complete' || !url) {
    return;
  }

  updateApp(url, tabId);
});

/**
 * Listens for content script messages and triggers the corresponding actions.
 */
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
