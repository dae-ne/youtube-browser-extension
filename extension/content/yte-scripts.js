import { ACTIONS } from '../shared/actions';
import { handleRetries } from './retries';

import {
  autoLoopVideoFeature as ft1,
  autoSkipAdvertisementsFeature as ft2,
  shortsToVideoButtonFeature as ft3,
  shortsUiTweaksFeature as ft4
} from './features';

/**
 * The action handlers for messages from the background script.
 *
 * @type {Object<string, Function>}
 */
const actionHandlers = {
  // auto-loop-video feature
  [ACTIONS.AUTO_LOOP_VIDEO]: () => handleRetries(ft1.loopVideo),

  // auto-skip-advertisements feature
  [ACTIONS.AUTO_SKIP_ADVERTISEMENTS]: () => handleRetries(ft2.autoSkipAdvertisements),
  [ACTIONS.AUTO_SKIP_ADVERTISEMENTS_CLEANUP]: ft2.cleanUp,

  // shorts-to-video-button feature
  [ACTIONS.DISPLAY_SHORTS_TO_VIDEO_BUTTON]: () => handleRetries(ft3.displayShortsToVideoButton),
  [ACTIONS.SHORTS_TO_VIDEO_BUTTON_CLEANUP]: ft3.cleanUp,

  // shorts-ui-tweaks feature
  [ACTIONS.SHORTS_UI_TWEAKS]: () => handleRetries(ft4.addShortsUiUpdates),
  [ACTIONS.SHORTS_UI_TWEAKS_CLEANUP]: ft4.cleanUp,
  [ACTIONS.SHORTS_UI_TWEAKS_DISABLE]: ft4.disable
};

/**
 * Listens for messages from the background script and calls the appropriate
 * action handler.
 */
chrome.runtime.onMessage.addListener(({ action }) => {
  console.log(action);
  actionHandlers[action]?.()
});
