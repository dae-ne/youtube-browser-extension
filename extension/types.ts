/**
 * The options stored in the extension's local storage.
 *
 * @remarks
 * The options are used to configure the extension's features.
 */
export type Options = {
  showShortsToVideoButton?: boolean;
  loopShortsToVideo?: boolean;
  updateShortsUI?: boolean;
  autoSkipAds?: boolean;
  hideSponsoredShorts?: boolean;
  hideMastheadAds?: boolean;
  hideInFeedAds?: boolean;
  hidePlayerAds?: boolean;
};

/**
 * The result of a feature setup function.
 */
export type Result = {
  status: 'success' | 'error' | 'retry';
  params: object;
};
