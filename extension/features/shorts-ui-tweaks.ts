import { isShortsPage, removeCssClasses } from '../lib/utils';

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
    className: 'yte-shorts-actions-container',
    selector: '.ytd-shorts [is-active] .action-container'
  },
  {
    className: 'yte-shorts-player-metadata-container',
    selector: '.ytd-shorts [is-active] .metadata-container'
  },
  {
    className: 'yte-shorts-navigation-container',
    selector: '.navigation-container.ytd-shorts'
  },
  {
    className: 'yte-shorts-g-page-manager',
    selector: 'ytd-page-manager'
  },
  {
    className: 'yte-shorts-g-side-mini-guide',
    selector: 'ytd-mini-guide-renderer.ytd-app'
  }
];

/**
 * Adds CSS classes to the shorts page elements to style them. Runs recursively with a specified
 * interval until all the elements are found and styled.
 *
 * @param params - The parameters for the function.
 * @returns The status of the function and the parameters.
 */
export function addShortsUiUpdates(params: Params = {}) {
  const {
    firstRun = true,
    missingElements = []
  } = params;

  if (!isShortsPage() || !firstRun && missingElements.length < 1) {
    return { status: 'success', params: {} };
  }

  classes.forEach(({ className, selector }) => {
    addCssClass(className, selector, missingElements);
  });

  if (missingElements.length < 1) {
    return { status: 'success', params: {} };
  }

  return { status: 'fail', params: { firstRun: false, missingElements } };
}

/**
 * Removes the global CSS classes from the shorts page elements.
 */
export function cleanUp() {
  removeCssClasses('yte-shorts-g-');
}

/**
 * Removes all the CSS classes from the shorts page to disable the feature.
 */
export function disable() {
  removeCssClasses('yte-shorts-');
}

/**
 * Adds a CSS class to an element if it exists.
 *
 * @param className - The name of the CSS class to add.
 * @param selector - The selector of the element.
 * @param missingElements - The elements that are not found yet.
 */
function addCssClass(className: string, selector: string, missingElements: string[]) {
  const missing = missingElements.includes(className);
  const element = document.querySelector(selector);

  if (!element) {
    missingElements.push(className);
    return;
  }

  element.classList.add(className);
  missing && missingElements.splice(missingElements.indexOf(className), 1);
}
