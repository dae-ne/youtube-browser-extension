/* eslint-disable @typescript-eslint/no-unused-expressions */

import { Actions, type ActionTypes } from 'actions';
import { getDynamicRules } from 'dynamic-rules';
import { initialOptions, type Options, type OptionsNames } from 'options';

const YOUTUBE_BASE_URL = 'https://www.youtube.com/';
const YOUTUBE_TV_BASE_URL = 'https://www.youtube.com/tv';

const options: Options = { ...initialOptions };

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
 * Sends a message to the content script with the specified action and tab ID.
 *
 * @param tabId - The ID of the tab to send the message to.
 * @param action - The action to send.
 * @param force - Whether to force the action to be executed.
 */
function send(tabId: number, action: ActionTypes, force = false): void {
    chrome.tabs.sendMessage(tabId, { action, force });
}

/**
 * Sends actions to the content scripts to set up or clean up features. The actions depend on
 * the tab URL and options. Messages are sent to the tab with the specified ID.
 *
 * @param url - The URL of the tab.
 * @param tabId - The ID of the tab.
 */
function notifyContentScripts(url: string, tabId: number, force = false): void {
    const { showShortsToVideoButton, loopShortsToVideo, updateShortsUI, smartTv }: Options =
        options;

    const isYouTubeTab = url.includes(YOUTUBE_BASE_URL);
    const isYouTubeTvTab = url.includes(YOUTUBE_TV_BASE_URL);

    if (!isYouTubeTab || isYouTubeTvTab) {
        return;
    }

    smartTv && send(tabId, Actions.SMART_TV, force);
    send(tabId, Actions.SHORTS_TO_VIDEO_BUTTON_CLEANUP, force);

    if (url.includes('shorts')) {
        showShortsToVideoButton && send(tabId, Actions.SHORTS_TO_VIDEO_BUTTON, force);
        updateShortsUI && send(tabId, Actions.SHORTS_UI_TWEAKS, force);
    }

    if (url.includes('watch') && loopVideoTabIds.includes(tabId)) {
        loopShortsToVideo && send(tabId, Actions.AUTO_LOOP_VIDEO, force);
        loopVideoTabIds.splice(loopVideoTabIds.indexOf(tabId), 1);
    }

    if (!url.includes('shorts')) {
        send(tabId, Actions.SHORTS_UI_TWEAKS_CLEANUP, force);
    }
}

/**
 * Sends actions to the content scripts to disable switched off features.
 *
 * @param url - The URL of the tab.
 * @param tabId - The ID of the tab.
 */
function disableFeatures(url: string, tabId: number): void {
    const { showShortsToVideoButton, updateShortsUI, smartTv }: Options = options;

    if (!url.includes('youtube.com')) {
        return;
    }

    updateShortsUI || send(tabId, Actions.SHORTS_UI_TWEAKS_DISABLE, true);
    showShortsToVideoButton || send(tabId, Actions.SHORTS_TO_VIDEO_BUTTON_DISABLE, true);
    smartTv || send(tabId, Actions.SMART_TV_DISABLE, true);
}

/**
 * Loads the options from the storage and assigns them to the options object. If the options don't
 * exist in the storage, it will create them with the initial values.
 */
chrome.storage.sync.get().then(data => {
    const dataExists = Object.keys(data).length;

    if (dataExists) {
        Object.assign(options, data);
        return;
    }

    chrome.storage.sync.set(options);
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

            notifyContentScripts(url, id, true);
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

chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({ url: `${YOUTUBE_BASE_URL}*` }, tabs => {
        // TODO: Check if it's a video page. Pause the videos and reload with the same time.
        // eslint-disable-next-line @typescript-eslint/promise-function-async
        tabs.forEach(({ id }) => id && chrome.tabs.reload(id));
    });

    chrome.declarativeNetRequest.updateDynamicRules(getDynamicRules(1));
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
        return;
    }

    if (request.action === Actions.OPEN_SMART_TV) {
        chrome.windows.create({
            url: YOUTUBE_TV_BASE_URL,
            type: 'popup',
            state: 'fullscreen'
        });
        return;
    }
});

/**
 * Listens for the browser action click (the extension icon) and opens YouTube in a new tab.
 * If YouTube is already opened, it will open the options page.
 */
chrome.action.onClicked.addListener(async tab => {
    const { id, url, index } = tab;

    if (url?.includes(YOUTUBE_BASE_URL)) {
        await chrome.runtime.openOptionsPage();
        return;
    }

    await chrome.tabs.create({
        openerTabId: id,
        index: index + 1,
        url: YOUTUBE_BASE_URL
    });
});
