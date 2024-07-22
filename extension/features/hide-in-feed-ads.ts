import Feature, { FeatureResult } from '../feature.js';

/**
 * The class name for in-feed ad elements.
 */
const CLASS_NAME = 'yte-in-feed-ad';

/**
 * A feature that hides the in-feed ads.
 *
 * @remarks
 * This feature hides the in-feed ads on the YouTube website. This class only adds a class to
 * elements, hiding them is implemented in the injected CSS.
 */
export default class HideInFeedAdsFeature extends Feature {
  /**
   * Initializes the feature with action names.
   */
  public constructor() {
    super({
      setUpAction: 'hideInFeedAds',
      cleanUpAction: 'hideInFeedAdsCleanup'
    });
  }

  /**
   * Adds a class to the in-feed ads to hide them.
   *
   * @returns The status of the function and the parameters.
   */
  public setUp = (): FeatureResult => {
    const selectors = ['ytd-search-pyv-renderer', '[class~="-feed-ad-"]'];
    const ads = document.querySelectorAll(selectors.join(', '));

    ads.forEach(ad => {
      ad.classList.add(CLASS_NAME);
    });

    return { status: 'success', params: {} };
  };

  /**
   * Not needed for this feature
   */
  public cleanUp: () => void;

  /**
   * Removes the class from the in-feed ads to show them.
   */
  public disable = () => {
    const ads = document.querySelectorAll(`.${CLASS_NAME}`);
    ads.forEach(ad => ad.classList.remove(CLASS_NAME));
  };
}
