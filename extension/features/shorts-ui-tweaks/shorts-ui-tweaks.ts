import { Actions } from '../../actions';
import Feature from '../../feature';
import { addCssClassToBody, removeCssClass } from '../../lib/utils';
import { Result, results } from '../../result';

/**
 * The class name to add to the body element.
 *
 * @remarks
 * This class is only a flag for the injected CSS to apply the UI updates. All the styling is
 * implemented in the shorts-ui-tweaks.scss file.
 */
const CLASS_NAME = 'yte-f-shorts-ui-tweaks';

/**
 * The feature class for the Shorts UI tweaks feature.
 */
export default class ShortsUiTweaksFeature extends Feature {
  /**
   * Initializes the feature with action names.
   */
  public constructor() {
    super({
      setUpAction: Actions.SHORTS_UI_TWEAKS,
      disableAction: Actions.SHORTS_UI_TWEAKS_DISABLE
    });
  }

  /**
   * Adds the feature class to the body element.
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
