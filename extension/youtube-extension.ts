import ActionHandler from 'action-handler';

import {
    AutoLoopVideoFeature,
    HideInFeedAdsFeature,
    HideMastheadAdsFeature,
    HidePlayerAdsFeature,
    HideSponsoredShortsFeature,
    ShortsToVideoButtonFeature,
    ShortsUiTweaksFeature,
    SmartTvFeature
} from './features';

const handler = new ActionHandler(
    new AutoLoopVideoFeature(),
    new HideInFeedAdsFeature(),
    new HideMastheadAdsFeature(),
    new HidePlayerAdsFeature(),
    new HideSponsoredShortsFeature(),
    new ShortsToVideoButtonFeature(),
    new ShortsUiTweaksFeature(),
    new SmartTvFeature()
);

/**
 * Listens for messages (actions) from the background script
 * and triggers a corresponding feature action.
 */
chrome.runtime.onMessage.addListener(({ action, force }) => handler.handleAction(action, force));
