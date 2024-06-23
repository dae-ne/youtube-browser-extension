import { ACTIONS } from './actions';
import { handleRetries } from './lib/retries';

import {
  AutoLoopVideoFeature,
  AutoSkipAdvertisementsFeature,
  ShortsToVideoButtonFeature,
  ShortsUiTweaksFeature
} from './features';
import { Feature } from './types';

type ActionHandlers = {
  [s: string]: () => void;
};

const ft1: Feature = new AutoLoopVideoFeature();
const ft2: Feature = new AutoSkipAdvertisementsFeature();
const ft3: Feature = new ShortsToVideoButtonFeature();
const ft4: Feature = new ShortsUiTweaksFeature();

/**
 * The action handlers for messages from the background script.
 */
const actionHandlers: ActionHandlers = {
  // auto-loop-video feature
  [ACTIONS.AUTO_LOOP_VIDEO]: () => handleRetries(ft1.setUp),

  // auto-skip-advertisements feature
  [ACTIONS.AUTO_SKIP_ADVERTISEMENTS]: () => handleRetries(ft2.setUp),
  [ACTIONS.AUTO_SKIP_ADVERTISEMENTS_CLEANUP]: ft2.cleanUp,

  // shorts-to-video-button feature
  [ACTIONS.SHORTS_TO_VIDEO_BUTTON]: () => handleRetries(ft3.setUp),
  [ACTIONS.SHORTS_TO_VIDEO_BUTTON_CLEANUP]: ft3.cleanUp,

  // shorts-ui-tweaks feature
  [ACTIONS.SHORTS_UI_TWEAKS]: () => handleRetries(ft4.setUp),
  [ACTIONS.SHORTS_UI_TWEAKS_CLEANUP]: ft4.cleanUp,
  [ACTIONS.SHORTS_UI_TWEAKS_DISABLE]: ft4.disable
};

/**
 * Listens for messages from the background script and calls the appropriate action handler.
 */
chrome.runtime.onMessage.addListener(({ action }) => {
  console.log(action);
  actionHandlers[action]?.()
});
