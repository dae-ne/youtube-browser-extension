import { ACTIONS } from '../actions.js';
import Feature, { FeatureResult } from '../feature.js';

/**
 * The class name for the masterhead ad element.
 */
const CLASS_NAME = 'yte-masterhead-ad';

/**
 * A feature that hides the masterhead ads.
 *
 * @remarks
 * This feature hides the masterhead ads on the YouTube website. This class only adds a class to
 * elements, hiding them is implemented in the injected CSS.
 */
export default class AutoLoopVideoFeature extends Feature {
  /**
   * Initializes the feature with action names.
   */
  public constructor() {
    super({
      setUpAction: ACTIONS.HIDE_MASTERHEAD_ADS,
      disableAction: ACTIONS.HIDE_MASTERHEAD_ADS_DISABLE
    });
  }

  /**
   * Adds a class to the masterhead ads to hide them.
   *
   * @returns The status of the function and the parameters.
   */
  public setUp = (): FeatureResult => {
    const selector = '#masthead-ad';
    const ads = document.querySelectorAll(selector);

    ads.forEach(ad => {
      ad.classList.add(CLASS_NAME);
    });

    return { status: 'success', params: {} };
  };

  /**
   * Not needed for this feature.
   */
  public cleanUp: () => void;

  /**
   * Removes the class from the masterhead ads to show them.
   */
  public disable = () => {
    const ads = document.querySelectorAll(`.${CLASS_NAME}`);

    ads.forEach(ad => {
      ad.classList.remove(CLASS_NAME);
    });
  };
}
