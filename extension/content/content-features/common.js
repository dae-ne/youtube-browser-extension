/**
 * This file contains common utility functions that are used across
 * multiple features.
 */

/**
 * The CSS class prefix used by the extension.
 *
 * @constant
 * @type {string}
 * @default
 */
const EXTENSION_CSS_CLASS_PREFIX = 'yte-';

/**
 * Checks if a video is opened on the current page. It also considers the
 * miniplayer as a video page.
 *
 * @returns {boolean} Whether the current page is a video page.
 */
export function isVideoOpened() {
  const isWatchPage = window.location.href.includes('youtube.com/watch');
  const miniplayer = document.querySelector('.miniplayer');
  const isMiniplayerOpened = !!miniplayer?.querySelector('video');
  return isWatchPage || isMiniplayerOpened;
}

/**
 * Checks if the current page is a shorts page.
 *
 * @returns {boolean} Whether the current page is a shorts page.
 */
export function isShortsPage() {
  return window.location.href.includes('youtube.com/shorts');
}

/**
 * Removes all elements with a specific class prefix from the page. Removes
 * only the classes that are added by this extension, so when the class name
 * starts with 'yte-'.
 */
export function removeCssClasses(classNamePrefix = EXTENSION_CSS_CLASS_PREFIX) {
  const isExtensionClassName = classNamePrefix.startsWith(EXTENSION_CSS_CLASS_PREFIX);

  if (!isExtensionClassName) {
    return;
  }

  const elements = document.querySelectorAll(`[class*="${classNamePrefix}"]`);

  elements.forEach((element) => {
    const classNamesToRemove = Array.from(element.classList)
      .filter((className) => className.startsWith(classNamePrefix));

    element.classList.remove(...classNamesToRemove);
  });
}
