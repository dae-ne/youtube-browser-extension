import ActionHandler from './action-handler';

import {
  AutoLoopVideoFeature,
  AutoSkipAdvertisementsFeature,
  RemoveSponsoredShortsFeature,
  ShortsToVideoButtonFeature,
  ShortsUiTweaksFeature
} from './features';

const handler = new ActionHandler(
  new AutoLoopVideoFeature(),
  new AutoSkipAdvertisementsFeature(),
  new ShortsToVideoButtonFeature(),
  new ShortsUiTweaksFeature(),
  new RemoveSponsoredShortsFeature()
);

chrome.runtime.onMessage.addListener(({ action }) => {
  console.log(action);
  handler.handleAction(action);
});
