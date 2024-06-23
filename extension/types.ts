/**
 * A feature that can be enabled or disabled.
 */
export interface Feature {
  /**
   * The function that implements the feature.
   */
  setUp: () => FeatureResult;

  /**
   * The function that cleans up the feature.
   */
  cleanUp: () => void;

  /**
   * The function that disables the feature.
   */
  disable: () => void;
}

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

/**
 * The result of a feature setup function.
 */
export type FeatureResult = {
  status: string;
  params: object;
};
