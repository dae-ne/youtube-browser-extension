import { Actions } from '../actions.js';
import Feature from '../feature.js';
import { addCssClassToBody, removeCssClass } from '../lib/utils.js';
import { Result, results } from '../result.js';

/**
 * The class name for the hide-in-feed-ads feature, which is added to the body element.
 */
const CLASS_NAME = 'yte-f-hide-in-feed-ads';

/**
 * A feature that hides the in-feed ads.
 *
 * @remarks
 * This feature hides the in-feed ads on the YouTube website by adding a class to the body element.
 * If the class is present, the in-feed ads are hidden by the injected CSS.
 */
export default class HideInFeedAdsFeature extends Feature {
  /**
   * Initializes the feature with action names.
   */
  public constructor() {
    super({
      setUpAction: Actions.HIDE_IN_FEED_ADS,
      disableAction: Actions.HIDE_IN_FEED_ADS_DISABLE
    });
  }

  /**
   * Adds the feature class to the body element to hide the in-feed ads.
   *
   * @returns The status of the function and the parameters.
   */
  public setUp = (): Result => {
    const { success, fail } = results;
    return addCssClassToBody(CLASS_NAME) ? success() : fail();
  };

  /**
   * Not needed for this feature
   */
  public cleanUp: () => void;

  /**
   * Removes the feature class from the body element.
   */
  public disable = () => {
    removeCssClass(CLASS_NAME);
  };
}
