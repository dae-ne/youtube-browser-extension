import { ACTIONS } from './actions';
import ActionHandler from './lib/action-handler';

import {
  AutoLoopVideoFeature,
  AutoSkipAdvertisementsFeature,
  ShortsToVideoButtonFeature,
  ShortsUiTweaksFeature
} from './features';

const handler = new ActionHandler();

handler.registerFeatureActions(
  new AutoLoopVideoFeature(),
  ACTIONS.AUTO_LOOP_VIDEO
);

handler.registerFeatureActions(
  new AutoSkipAdvertisementsFeature(),
  ACTIONS.AUTO_SKIP_ADVERTISEMENTS,
  ACTIONS.AUTO_SKIP_ADVERTISEMENTS_CLEANUP
);

handler.registerFeatureActions(
  new ShortsToVideoButtonFeature(),
  ACTIONS.SHORTS_TO_VIDEO_BUTTON,
  ACTIONS.SHORTS_TO_VIDEO_BUTTON_CLEANUP
);

handler.registerFeatureActions(
  new ShortsUiTweaksFeature(),
  ACTIONS.SHORTS_UI_TWEAKS,
  ACTIONS.SHORTS_UI_TWEAKS_CLEANUP,
  ACTIONS.SHORTS_UI_TWEAKS_DISABLE
);

chrome.runtime.onMessage.addListener(({ action }) => {
  console.log(action);
  handler.handleAction(action);
});
