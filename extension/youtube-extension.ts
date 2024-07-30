import ActionHandler from 'action-handler';

import {
  AutoLoopVideoFeature,
  AutoSkipAdsFeature,
  HideInFeedAdsFeature,
  HideMastheadAdsFeature,
  HidePlayerAdsFeature,
  HideSponsoredShortsFeature,
  ShortsToVideoButtonFeature,
  ShortsUiTweaksFeature
} from './features';

/**
 * Creates a new action handler and initializes it with the features.
 */
const handler = new ActionHandler(
  new AutoLoopVideoFeature(),
  new AutoSkipAdsFeature(),
  new HideInFeedAdsFeature(),
  new HideMastheadAdsFeature(),
  new HidePlayerAdsFeature(),
  new HideSponsoredShortsFeature(),
  new ShortsToVideoButtonFeature(),
  new ShortsUiTweaksFeature()
);

/**
 * Listens for messages from the background script and triggers a corresponding feature action.
 */
chrome.runtime.onMessage.addListener(({ action }) => handler.handleAction(action));
