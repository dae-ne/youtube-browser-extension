import { Actions } from 'actions';
import { initialOptions, Options, OptionsNames } from 'options';

/**
 * The base URL of the YouTube website.
 */
const YOUTUBE_BASE_URL = 'https://www.youtube.com/';

/**
 * The base URL of the YouTube TV website.
 *
 * @remarks
 * The YouTube TV is a simplified version of YouTube specifically designed for TVs (smart TVs).
 */
const YOUTUBE_TV_BASE_URL = 'https://www.youtube.com/tv';

/**
 * The options object that stores the features' preferences. The initial options are overridden
 * after being loaded from the storage.
 */
const options = initialOptions;

/**
 * List of tab IDs to auto loop videos on the watch page.
 *
 * @remarks
 * It's a part of the auto-loop-video feature. After reciving a signal about the video being opened
 * from the shorts page, the tab ID is added to the list. The content script will then auto-loop
 * the video on the watch page by sending a message to the injected script and triggering the
 * setup function of the feature.
 */
const loopVideoTabIds: number[] = [];

/**
 * Sends actions to the content scripts to set up or clean up features. The actions depend on
 * the tab URL and options. Messages are sent to the tab with the specified ID.
 *
 * @param url - The URL of the tab.
 * @param tabId - The ID of the tab.
 */
function notifyContentScripts(url: string, tabId: number) {
  const { sendMessage } = chrome.tabs;
  const {
    showShortsToVideoButton,
    loopShortsToVideo,
    updateShortsUI,
    autoSkipAds,
    hideSponsoredShorts,
    hideMastheadAds,
    hideInFeedAds,
    hidePlayerAds,
    removeAdblockErrorMessage
  }: Options = options;

  const isYouTubeTab = url.includes(YOUTUBE_BASE_URL);
  const isYouTubeTvTab = url.includes(YOUTUBE_TV_BASE_URL);

  if (!isYouTubeTab || isYouTubeTvTab) {
    return;
  }

  hideInFeedAds && sendMessage(tabId, { action: Actions.HIDE_IN_FEED_ADS });
  hideMastheadAds && sendMessage(tabId, { action: Actions.HIDE_MASTHEAD_ADS });
  hidePlayerAds && sendMessage(tabId, { action: Actions.HIDE_PLAYER_ADS });
  hideSponsoredShorts && sendMessage(tabId, { action: Actions.HIDE_SPONSORED_SHORTS });

  sendMessage(tabId, { action: Actions.AUTO_SKIP_ADS_CLEANUP });
  sendMessage(tabId, { action: Actions.REMOVE_ADBLOCK_ERROR_MESSAGE_CLEANUP });
  sendMessage(tabId, { action: Actions.SHORTS_TO_VIDEO_BUTTON_CLEANUP });

  // Always triggered in case the video is opened in a miniplayer.
  autoSkipAds && sendMessage(tabId, { action: Actions.AUTO_SKIP_ADS });
  removeAdblockErrorMessage && sendMessage(tabId, { action: Actions.REMOVE_ADBLOCK_ERROR_MESSAGE });

  if (url.includes('shorts')) {
    showShortsToVideoButton && sendMessage(tabId, { action: Actions.SHORTS_TO_VIDEO_BUTTON });
    updateShortsUI && sendMessage(tabId, { action: Actions.SHORTS_UI_TWEAKS });
  }

  if (url.includes('watch') && loopVideoTabIds.includes(tabId)) {
    loopShortsToVideo && sendMessage(tabId, { action: Actions.AUTO_LOOP_VIDEO });
    loopVideoTabIds.splice(loopVideoTabIds.indexOf(tabId), 1);
  }

  if (!url.includes('shorts')) {
    sendMessage(tabId, { action: Actions.SHORTS_UI_TWEAKS_CLEANUP });
  }
}

/**
 * Sends actions to the content scripts to disable switched off features.
 *
 * @param url - The URL of the tab.
 * @param tabId - The ID of the tab.
 */
function disableFeatures(url: string, tabId: number) {
  const { sendMessage } = chrome.tabs;
  const {
    showShortsToVideoButton,
    updateShortsUI,
    autoSkipAds,
    hideMastheadAds,
    hideInFeedAds,
    hidePlayerAds,
    hideSponsoredShorts,
    removeAdblockErrorMessage
  }: Options = options;

  if (!url.includes('youtube.com')) {
    return;
  }

  autoSkipAds || sendMessage(tabId, { action: Actions.AUTO_SKIP_ADS_DISABLE });
  removeAdblockErrorMessage ||
    sendMessage(tabId, { action: Actions.REMOVE_ADBLOCK_ERROR_MESSAGE_DISABLE });
  updateShortsUI || sendMessage(tabId, { action: Actions.SHORTS_UI_TWEAKS_DISABLE });
  hideMastheadAds || sendMessage(tabId, { action: Actions.HIDE_MASTHEAD_ADS_DISABLE });
  hideInFeedAds || sendMessage(tabId, { action: Actions.HIDE_IN_FEED_ADS_DISABLE });
  hidePlayerAds || sendMessage(tabId, { action: Actions.HIDE_PLAYER_ADS_DISABLE });
  hideSponsoredShorts || sendMessage(tabId, { action: Actions.HIDE_SPONSORED_SHORTS_DISABLE });
  showShortsToVideoButton || sendMessage(tabId, { action: Actions.SHORTS_TO_VIDEO_BUTTON_DISABLE });
}

/**
 * Loads the options from the storage and assigns them to the options object. If the options don't
 * exist in the storage, it will create them with the initial values.
 */
chrome.storage.sync.get().then(data => {
  const dataExists = data && Object.keys(data).length;
  dataExists ? Object.assign(options, data) : chrome.storage.sync.set(options);
});

/**
 * Listens for storage changes and updates the options object effectively. The function will
 * trigger the content scripts update based on the new options so that the features can be enabled
 * or disabled dynamically.
 */
chrome.storage.onChanged.addListener(changes => {
  for (const [name, { newValue }] of Object.entries(changes)) {
    options[name as OptionsNames] = newValue;
  }

  chrome.tabs.query({ url: `${YOUTUBE_BASE_URL}*` }, tabs => {
    tabs.forEach(({ id, url }) => {
      if (!url || !id) {
        return;
      }

      notifyContentScripts(url, id);
      disableFeatures(url, id);
    });
  });
});

/**
 * Listens for tab updates and notifies the content scripts to update the features.
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const { url } = tab;

  if (changeInfo.status !== 'complete' || !url) {
    return;
  }

  notifyContentScripts(url, tabId);
});

/**
 * Reloads all YouTube tabs when the extension is installed or updated.
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ url: `${YOUTUBE_BASE_URL}*` }, tabs => {
    // TODO: Check if it's a video page. Pause the videos and reload with the same time.
    tabs.forEach(({ id }) => id && chrome.tabs.reload(id));
  });
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
 * If YouTube is already opened, it will open the options page.
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
