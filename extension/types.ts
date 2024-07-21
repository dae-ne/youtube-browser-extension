/**
 * The options stored in the extension's local storage.
 *
 * @remarks
 * The options are used to configure the extension's features.
 */
export type Options = {
  autoSkipAds?: boolean;
  showShortsToVideoButton?: boolean;
  loopShortsToVideo?: boolean;
  updateShortsUI?: boolean;
  removeAds?: boolean;
};
