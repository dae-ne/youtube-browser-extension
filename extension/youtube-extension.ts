import ActionHandler from './action-handler';

import {
  AutoLoopVideoFeature,
  AutoSkipAdvertisementsFeature,
  HideInFeedAdsFeature,
  HideMasterheadAdsFeature,
  HidePlayerAdsFeature,
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
  new HideInFeedAdsFeature(),
  new HideMasterheadAdsFeature(),
  new HidePlayerAdsFeature(),
  new RemoveSponsoredShortsFeature(),
  new ShortsToVideoButtonFeature(),
  new ShortsUiTweaksFeature()
);

/**
 * Listens for messages from the background script and triggers a corresponding feature action.
 */
chrome.runtime.onMessage.addListener(({ action }) => handler.handleAction(action));
