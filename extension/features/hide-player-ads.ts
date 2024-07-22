import { Actions } from '../actions.js';
import Feature from '../feature.js';
import { removeCssClass } from '../lib/utils.js';
import { Result } from '../types.js';

/**
 * The class name for the hide-player-ads feature, which is added to the body element.
 */
const CLASS_NAME = 'yte-f-hide-player-ads';

/**
 * A feature that hides the player ads.
 *
 * @remarks
 * This feature hides the player ads on the YouTube website by adding a class to the body element.
 * If the class is present, the player ads are hidden by the injected CSS.
 */
export default class HidePlayerAdsFeature extends Feature {
  /**
   * Initializes the feature with action names.
   */
  public constructor() {
    super({
      setUpAction: Actions.HIDE_PLAYER_ADS,
      disableAction: Actions.HIDE_PLAYER_ADS_DISABLE
    });
  }

  /**
   * Adds the feature class to the body element to hide the player ads.
   *
   * @returns The status of the function and the parameters.
   */
  public setUp = (): Result => {
    const body = document.querySelector('body');

    if (!body) {
      return { status: 'error', params: {} };
    }

    body.classList.add(CLASS_NAME);
    return { status: 'success', params: {} };
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
