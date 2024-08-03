/**
 * The CSS class prefix used by the extension.
 */
const EXTENSION_CSS_CLASS_PREFIX = 'yte-';

/**
 * Checks if a video is opened on the current page.
 *
 * @remarks
 * A miniplayer is also considered a video page, so this function returns true if a video is
 * opened in the miniplayer (e.g. on the YouTube homepage).
 *
 * @returns Whether the current page is a video page.
 */
export function isVideoOpened(): boolean {
  const isWatchPage = window.location.href.includes('youtube.com/watch');
  return isWatchPage || isMiniplayerOpened();
}

/**
 * Checks if a miniplayer is opened on the current page.
 *
 * @returns Whether the current page has a miniplayer opened.
 */
export function isMiniplayerOpened(): boolean {
  const miniplayer = document.querySelector('.miniplayer');
  const container = miniplayer?.querySelector('#player-container');

  if (!container) {
    return false;
  }

  return container.childNodes.length > 0;
}

/**
 * Checks if the current page is a shorts page.
 *
 * @returns Whether the current page is a shorts page.
 */
export function isShortsPage(): boolean {
  return window.location.href.includes('youtube.com/shorts');
}

/**
 * Removes a CSS class from all elements on the page.
 *
 * @param className - The name of the CSS class to remove.
 */
export function removeCssClass(className: string) {
  const elements = document.querySelectorAll(`.${className}`);
  elements.forEach(element => element.classList.remove(className));
}

/**
 * Removes all elements with a specific class prefix from the page.
 *
 * @remarks
 * This function is useful for cleaning up the page after the extension is disabled or to remove
 * global css after opening a new page. By default, it removes only the classes that start with
 * 'yte-', so only the classes added by this extension.
 *
 * @param classNamePrefix - The class name prefix used to filter the elements.
 */
export function removeCssClassesByClassNamePrefix(classNamePrefix = EXTENSION_CSS_CLASS_PREFIX) {
  const isExtensionClassName = classNamePrefix.startsWith(EXTENSION_CSS_CLASS_PREFIX);

  if (!isExtensionClassName) {
    return;
  }

  const elements = document.querySelectorAll(`[class*="${classNamePrefix}"]`);

  elements.forEach(element => {
    const classNamesToRemove = Array.from(element.classList).filter(className =>
      className.startsWith(classNamePrefix)
    );

    element.classList.remove(...classNamesToRemove);
  });
}

/**
 * Adds a CSS class to the body element.
 *
 * @param className - The name of the CSS class to add.
 * @returns Whether the class was successfully added.
 */
export function addCssClassToBody(className: string): boolean {
  const body = document.querySelector('body');

  if (!body) {
    return false;
  }

  body.classList.add(className);
  return true;
}
