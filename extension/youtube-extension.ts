import ActionHandler from 'action-handler';

import {
    AutoLoopVideoFeature,
    ShortsToVideoButtonFeature,
    ShortsUiTweaksFeature,
    SmartTvFeature
} from './features';

const handler = new ActionHandler(
    new AutoLoopVideoFeature(),
    new ShortsToVideoButtonFeature(),
    new ShortsUiTweaksFeature(),
    new SmartTvFeature()
);

/**
 * Listens for messages (actions) from the background script
 * and triggers a corresponding feature action.
 */
chrome.runtime.onMessage.addListener(({ action, force }) => handler.handleAction(action, force));
