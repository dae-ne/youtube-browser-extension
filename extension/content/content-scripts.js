import {
  autoSkipAdvertisementsFeature as ft1,
  shortsToVideoButtonFeature as ft2
} from './content-features';

/**
 * The action handlers for messages from the background script.
 *
 * @type {Object<string, Function>}
 */
const actionHandlers = {
  // auto-skip-advertisements feature
  'auto-skip-advertisements': ft1.autoSkipAdvertisements,
  'disconnect-advertisements-observer': ft1.disconnectAdvertisementsObserver,

  // shorts-to-video-button feature
  'display-shorts-to-video-button': ft2.displayShortsToVideoButton,
  'shorts-to-video-button-cleanup': ft2.cleanUp
};

/**
 * Listens for messages from the background script and calls the appropriate
 * action handler.
 */
chrome.runtime.onMessage.addListener(({ action }) => {
  console.log(action);
  actionHandlers[action]?.()
});
