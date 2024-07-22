import { Actions } from './actions';
import { Options } from './types';
import * as defaultSettings from './default-settings.json';

/**
 * The base URL of the YouTube website.
 */
const YOUTUBE_BASE_URL = 'https://www.youtube.com/';

/**
 * The options loaded from the storage.
 */
const options: Options = {};

/**
 * The tab IDs of the tabs that are looping videos after opening them from the shorts page.
 */
const loopVideoTabIds: number[] = [];

/**
 * Updates the app based on the URL and the tab ID. It will send messages to the content scripts
 * based on the URL and the options.
 *
 * @param url - The URL of the tab.
 * @param tabId - The ID of the tab.
 */
function updateApp(url: string, tabId: number) {
  // TODO: handle switching options off

  const { sendMessage } = chrome.tabs;
  const { autoSkipAds, showShortsToVideoButton, loopShortsToVideo, updateShortsUI } = options;

  // Homepage only
  if (url === YOUTUBE_BASE_URL) {
    sendMessage(tabId, { action: Actions.HIDE_MASTERHEAD_ADS }); // TODO: add to options
  }

  if (url.includes('youtube.com')) {
    updateShortsUI || sendMessage(tabId, { action: Actions.SHORTS_UI_TWEAKS_DISABLE });
  }

  if (url.includes('youtube.com/shorts')) {
    showShortsToVideoButton && sendMessage(tabId, { action: Actions.SHORTS_TO_VIDEO_BUTTON });
    updateShortsUI && sendMessage(tabId, { action: Actions.SHORTS_UI_TWEAKS });
    sendMessage(tabId, { action: Actions.REMOVE_SPONSORED_SHORTS }); // TODO: add to options
  }

  if (url.includes('youtube.com/watch') && loopVideoTabIds.includes(tabId)) {
    loopShortsToVideo && sendMessage(tabId, { action: Actions.AUTO_LOOP_VIDEO });
    loopVideoTabIds.splice(loopVideoTabIds.indexOf(tabId), 1);
  }

  if (url.includes('youtube.com') && url !== YOUTUBE_BASE_URL) {
    // Hiding all in-feed ads except the ones in the homepage.
    // Removing them from the home page would break the grid layout.
    sendMessage(tabId, { action: Actions.HIDE_IN_FEED_ADS });
  }

  if (url.includes('youtube.com') && !url.includes('watch')) {
    // The content script checks if a miniplayer is opened.
    // If it is, it will not disconnect the observer.
    sendMessage(tabId, { action: Actions.AUTO_SKIP_ADVERTISEMENTS_CLEANUP });
  }

  if (url.includes('youtube.com') && !url.includes('shorts')) {
    autoSkipAds && sendMessage(tabId, { action: Actions.AUTO_SKIP_ADVERTISEMENTS });
    sendMessage(tabId, { action: Actions.SHORTS_TO_VIDEO_BUTTON_CLEANUP });
    sendMessage(tabId, { action: Actions.SHORTS_UI_TWEAKS_CLEANUP });
  }
}

/**
 * Loads the options from the storage and assigns them to the options object. If the options don't
 * exist in the storage, it will create them with the default values.
 */
chrome.storage.sync.get().then(data => {
  const dataExists = data && Object.keys(data).length;

  if (dataExists) {
    Object.assign(options, data);
    return;
  }

  const initialOptions: Options = defaultSettings.settings;
  chrome.storage.sync.set(initialOptions);
  Object.assign(options, data);
});

/**
 * Listens for storage changes and updates the options object. Triggers the app update function
 * with the new options for each youtube tab.
 */
chrome.storage.onChanged.addListener(changes => {
  for (const [name, { newValue }] of Object.entries(changes)) {
    options[name] = newValue;
  }

  chrome.tabs.query({ url: `${YOUTUBE_BASE_URL}*` }, tabs => {
    tabs.forEach(({ id, url }) => {
      if (!url || !id) {
        return;
      }

      updateApp(url, id);
    });
  });
});

/**
 * Listens for tab updates and triggers the app update function. The app update function will
 * update the content scripts and the injected scripts based on the tab URL, options,
 * and the tab ID.
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
  if (!sender.tab) {
    return;
  }

  if (request.action === Actions.OPEN_VIDEO_FROM_SHORTS) {
    chrome.tabs.create(
      {
        url: request.url,
        index: sender.tab.index + 1,
        openerTabId: sender.tab.id
      },
      tab => tab.id && loopVideoTabIds.push(tab.id)
    );
  }
});

/**
 * Listens for the browser action click (the extension icon) and opens YouTube in a new tab.
 * If YouTube is already opened in a tab, it will open the options page.
 */
chrome.action.onClicked.addListener(async tab => {
  const { id, url, index } = tab;

  if (url && url.includes(YOUTUBE_BASE_URL)) {
    await chrome.runtime.openOptionsPage();
    return;
  }

  await chrome.tabs.create({
    openerTabId: id,
    index: index + 1,
    url: YOUTUBE_BASE_URL
  });
});
