import { Actions } from '../../actions.js';
import Feature from '../../feature.js';
import { addCssClassToBody, removeCssClass } from '../../lib/utils.js';
import { Result, results } from '../../result.js';

/**
 * The class name for the hide-masthead-ads feature, which is added to the body element.
 */
const CLASS_NAME = 'yte-f-hide-masthead-ads';

/**
 * A feature that hides the masthead ads.
 *
 * @remarks
 * This feature hides the masthead ads on the YouTube website by adding a class to the body element.
 * If the class is present, the masthead ads are hidden by the injected CSS.
 */
export default class HideMastheadAdsFeature extends Feature {
  /**
   * Initializes the feature with action names.
   */
  public constructor() {
    super({
      setUpAction: Actions.HIDE_MASTHEAD_ADS,
      disableAction: Actions.HIDE_MASTHEAD_ADS_DISABLE
    });
  }

  /**
   * Adds the feature class to the body element to hide the masthead ads.
   *
   * @returns The status of the function and the parameters.
   */
  public setUp = (): Result => {
    const { success, fail } = results;
    return addCssClassToBody(CLASS_NAME) ? success() : fail();
  };

  /**
   * Not needed for this feature.
   */
  public cleanUp: () => void;

  /**
   * Removes the feature class from the body element.
   */
  public disable = () => {
    removeCssClass(CLASS_NAME);
  };
}
