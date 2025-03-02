/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/key-spacing */
// prettier-ignore

/**
 * Action names used to communicate between the background script and content scripts.
 */
export const Actions = {
    AUTO_LOOP_VIDEO:                'auto-loop-video',
    SHORTS_TO_VIDEO_BUTTON:         'shorts-to-video-button',
    SHORTS_TO_VIDEO_BUTTON_CLEANUP: 'shorts-to-video-button-cleanup',
    SHORTS_TO_VIDEO_BUTTON_DISABLE: 'shorts-to-video-button-disable',
    OPEN_VIDEO_FROM_SHORTS:         'open-video-from-shorts',
    SHORTS_UI_TWEAKS:               'shorts-ui-tweaks',
    SHORTS_UI_TWEAKS_CLEANUP:       'shorts-ui-tweaks-cleanup',
    SHORTS_UI_TWEAKS_DISABLE:       'shorts-ui-tweaks-disable',
    SMART_TV:                       'smart-tv',
    SMART_TV_CLEANUP:               'smart-tv-cleanup',
    SMART_TV_DISABLE:               'smart-tv-disable',
    OPEN_SMART_TV:                  'open-smart-tv'
};

export type ActionTypes = (typeof Actions)[keyof typeof Actions];
