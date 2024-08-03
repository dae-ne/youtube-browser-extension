// prettier-ignore

/**
 * Action names used to communicate between the background script and content scripts.
 */
export const Actions = {
  AUTO_LOOP_VIDEO:                      'auto-loop-video',
  AUTO_SKIP_ADS:                        'auto-skip-ads',
  AUTO_SKIP_ADS_CLEANUP:                'auto-skip-ads-cleanup',
  AUTO_SKIP_ADS_DISABLE:                'auto-skip-ads-disable',
  SHORTS_TO_VIDEO_BUTTON:               'shorts-to-video-button',
  SHORTS_TO_VIDEO_BUTTON_CLEANUP:       'shorts-to-video-button-cleanup',
  SHORTS_TO_VIDEO_BUTTON_DISABLE:       'shorts-to-video-button-disable',
  OPEN_VIDEO_FROM_SHORTS:               'open-video-from-shorts',
  SHORTS_UI_TWEAKS:                     'shorts-ui-tweaks',
  SHORTS_UI_TWEAKS_CLEANUP:             'shorts-ui-tweaks-cleanup',
  SHORTS_UI_TWEAKS_DISABLE:             'shorts-ui-tweaks-disable',
  HIDE_SPONSORED_SHORTS:                'remove-sponsored-shorts',
  HIDE_SPONSORED_SHORTS_DISABLE:        'remove-sponsored-shorts-cleanup',
  HIDE_MASTHEAD_ADS:                    'hide-masthead-ads',
  HIDE_MASTHEAD_ADS_DISABLE:            'hide-masthead-ads-disable',
  HIDE_IN_FEED_ADS:                     'hide-in-feed-ads',
  HIDE_IN_FEED_ADS_DISABLE:             'hide-in-feed-ads-disable',
  HIDE_PLAYER_ADS:                      'hide-player-ads',
  HIDE_PLAYER_ADS_DISABLE:              'hide-player-ads-disable',
  REMOVE_ADBLOCK_ERROR_MESSAGE:         'remove-adblock-error-message',
  REMOVE_ADBLOCK_ERROR_MESSAGE_CLEANUP: 'remove-adblock-error-message-cleanup',
  REMOVE_ADBLOCK_ERROR_MESSAGE_DISABLE: 'remove-adblock-error-message-disable',
};
