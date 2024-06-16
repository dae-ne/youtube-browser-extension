import { ACTIONS } from '../shared/actions';

import {
  autoSkipAdvertisementsFeature as ft1,
  shortsToVideoButtonFeature as ft2
} from './features';

/**
 * The action handlers for messages from the background script.
 *
 * @type {Object<string, Function>}
 */
const actionHandlers = {
  // auto-skip-advertisements feature
  [ACTIONS.AUTO_SKIP_ADVERTISEMENTS]: ft1.autoSkipAdvertisements,
  [ACTIONS.AUTO_SKIP_ADVERTISEMENTS_CLEANUP]: ft1.cleanUp,

  // shorts-to-video-button feature
  [ACTIONS.DISPLAY_SHORTS_TO_VIDEO_BUTTON]: ft2.displayShortsToVideoButton,
  [ACTIONS.SHORTS_TO_VIDEO_BUTTON_CLEANUP]: ft2.cleanUp
};

/**
 * Listens for messages from the background script and calls the appropriate
 * action handler.
 */
chrome.runtime.onMessage.addListener(({ action }) => {
  console.log(action);
  actionHandlers[action]?.()
});
