import ActionHandler from './action-handler';

import {
  AutoLoopVideoFeature,
  AutoSkipAdvertisementsFeature,
  ShortsToVideoButtonFeature,
  ShortsUiTweaksFeature
} from './features';

const handler = new ActionHandler();

handler.registerFeatures(
  new AutoLoopVideoFeature(),
  new AutoSkipAdvertisementsFeature(),
  new ShortsToVideoButtonFeature(),
  new ShortsUiTweaksFeature()
);

chrome.runtime.onMessage.addListener(({ action }) => {
  console.log(action);
  handler.handleAction(action);
});
