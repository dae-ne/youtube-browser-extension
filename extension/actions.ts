// prettier-ignore

/**
 * Action names used to communicate between the background script and content scripts.
 */
export const Actions = {
  AUTO_LOOP_VIDEO:                  'auto-loop-video',
  AUTO_SKIP_ADVERTISEMENTS:         'auto-skip-advertisements',
  AUTO_SKIP_ADVERTISEMENTS_CLEANUP: 'auto-skip-advertisements-cleanup',
  SHORTS_TO_VIDEO_BUTTON:           'shorts-to-video-button',
  SHORTS_TO_VIDEO_BUTTON_CLEANUP:   'shorts-to-video-button-cleanup',
  OPEN_VIDEO_FROM_SHORTS:           'open-video-from-shorts',
  SHORTS_UI_TWEAKS:                 'shorts-ui-tweaks',
  SHORTS_UI_TWEAKS_CLEANUP:         'shorts-ui-tweaks-cleanup',
  SHORTS_UI_TWEAKS_DISABLE:         'shorts-ui-tweaks-disable',
  REMOVE_SPONSORED_SHORTS:          'remove-sponsored-shorts',
  HIDE_MASTERHEAD_ADS:              'hide-masterhead-ads',
  HIDE_MASTERHEAD_ADS_DISABLE:      'hide-masterhead-ads-disable',
  HIDE_IN_FEED_ADS:                 'hide-in-feed-ads',
  HIDE_IN_FEED_ADS_DISABLE:         'hide-in-feed-ads-disable',
  HIDE_PLAYER_ADS:                  'hide-player-ads',
  HIDE_PLAYER_ADS_DISABLE:          'hide-player-ads-disable',
};
