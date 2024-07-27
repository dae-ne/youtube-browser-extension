import { Actions } from '../../actions';
import Feature from '../../feature';
import { addCssClassToBody, removeCssClass } from '../../lib/utils';
import { Result, results } from '../../result';

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
    const { success, fail } = results;
    return addCssClassToBody(CLASS_NAME) ? success() : fail();
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
