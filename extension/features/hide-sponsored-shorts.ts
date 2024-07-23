import { Actions } from '../actions';
import Feature from '../feature';
import { removeCssClass } from '../lib/utils';
import { Result } from '../types';

const CLASS_NAME = 'yte-f-hide-sponsored-shorts';

/**
 * A feature that hides the sponsored shorts.
 *
 * @remarks
 * This feature hides the sponsored shorts on the YouTube website by adding a class to the body
 * element. If the class is present, the sponsored shorts are hidden by the injected CSS.
 */
export default class HideSponsoredShortsFeature extends Feature {
  /**
   * Creates an instance of HideSponsoredShortsFeature.
   */
  public constructor() {
    super({
      setUpAction: Actions.HIDE_SPONSORED_SHORTS,
      disableAction: Actions.HIDE_SPONSORED_SHORTS_DISABLE
    });
  }

  /**
   * Adds the feature class to the body element to hide the sponsored shorts.
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
   * Cleans up the feature. Not used in this feature.
   */
  public cleanUp: () => void;

  /**
   * Removes the feature class from the body element.
   */
  public disable = () => {
    removeCssClass(CLASS_NAME);
  };
}
