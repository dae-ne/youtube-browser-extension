import ActionHandler from './action-handler';

import {
  AutoLoopVideoFeature,
  AutoSkipAdvertisementsFeature,
  HideMasterheadAdsFeature,
  RemoveSponsoredShortsFeature,
  ShortsToVideoButtonFeature,
  ShortsUiTweaksFeature
} from './features';

/**
 * Creates a new action handler and initializes it with the features.
 */
const handler = new ActionHandler(
  new AutoLoopVideoFeature(),
  new AutoSkipAdvertisementsFeature(),
  new HideMasterheadAdsFeature(),
  new RemoveSponsoredShortsFeature(),
  new ShortsToVideoButtonFeature(),
  new ShortsUiTweaksFeature()
);

/**
 * Listens for messages from the background script and triggers a corresponding feature action.
 */
chrome.runtime.onMessage.addListener(({ action }) => {
  handler.handleAction(action);
});
