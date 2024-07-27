import { Actions } from '../actions';
import Feature from '../feature';
import { isShortsPage, removeCssClassesByClassNamePrefix } from '../lib/utils';
import { Result, results } from '../result';

/**
 * The parameters for the addShortsUiUpdates function.
 */
type Params = {
  firstRun?: boolean;
  missingElements?: string[];
};

/**
 * CSS classes to add to the shorts page elements to style them and their corresponding selectors.
 */
const classes = [
  {
    className: 'yte-shorts-tweaks-actions-container',
    selector: '.ytd-shorts [is-active] .action-container'
  },
  {
    className: 'yte-shorts-tweaks-player-metadata-container',
    selector: '.ytd-shorts [is-active] .metadata-container'
  },
  {
    className: 'yte-shorts-tweaks-navigation-container',
    selector: '.navigation-container.ytd-shorts'
  },
  {
    className: 'yte-shorts-tweaks-g-page-manager',
    selector: 'ytd-page-manager'
  },
  {
    className: 'yte-shorts-tweaks-g-side-mini-guide',
    selector: 'ytd-mini-guide-renderer.ytd-app'
  }
];

/**
 * A feature that adds CSS classes to the shorts page elements to style them.
 */
export default class ShortsUiTweaksFeature extends Feature {
  /**
   * Initializes the feature with action names.
   */
  public constructor() {
    super({
      setUpAction: Actions.SHORTS_UI_TWEAKS,
      cleanUpAction: Actions.SHORTS_UI_TWEAKS_CLEANUP,
      disableAction: Actions.SHORTS_UI_TWEAKS_DISABLE
    });
  }

  /**
   * Adds CSS classes to the shorts page elements to style them. Runs recursively with a specified
   * interval until all the elements are found and styled.
   *
   * @param params - The parameters for the function.
   * @returns The status of the function and the parameters.
   */
  public setUp = (params: Params = {}): Result => {
    const { firstRun = true, missingElements = [] } = params;
    const { success, fail } = results;

    if (!isShortsPage() || (!firstRun && missingElements.length < 1)) {
      return success();
    }

    classes.forEach(({ className, selector }) => {
      this.addCssClass(className, selector, missingElements);
    });

    if (missingElements.length < 1) {
      return success();
    }

    return fail({ firstRun: false, missingElements });
  };

  /**
   * Removes the global CSS classes from the shorts page elements.
   */
  public cleanUp = () => {
    removeCssClassesByClassNamePrefix('yte-shorts-tweaks-g-');
  };

  /**
   * Removes all the CSS classes from the shorts page to disable the feature.
   */
  public disable = () => {
    removeCssClassesByClassNamePrefix('yte-shorts-tweaks-');
  };

  /**
   * Adds a CSS class to an element if it exists.
   *
   * @param className - The name of the CSS class to add.
   * @param selector - The selector of the element.
   * @param missingElements - The elements that are not found yet.
   */
  private addCssClass = (className: string, selector: string, missingElements: string[]) => {
    const missing = missingElements.includes(className);
    const element = document.querySelector(selector);

    if (!element) {
      missingElements.push(className);
      return;
    }

    element.classList.add(className);
    missing && missingElements.splice(missingElements.indexOf(className), 1);
  };
}
