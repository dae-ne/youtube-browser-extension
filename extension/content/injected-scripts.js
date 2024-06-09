/**
 * Methods in this file are injected into the YouTube page to manipulate
 * the UI. The methods are called from the background script using
 * chrome.scripting API and run in an isolated environment. Once a function
 * is injected, it can't access this file or any other file in the extension.
 * Don't try to DRY, just keep the methods simple and self-contained.
 */

/**
 * Finds the video element and sets the loop property.
 *
 * @param {boolean} loop - The value to set the loop property to.
 */
export function loopVideo(loop = true) {
  document.querySelector('video').loop = loop;
}

/**
 * Displays a button to open the video from the shorts page (on an action bar
 * next to the shorts player). When clicked, it opens the video page in
 * a new tab.
 */
export function displayShortsToVideoButton() {
  const INTERVAL_MS = 200;

  const isShortsPage = window.location.href.includes('youtube.com/shorts');

  if (!isShortsPage) {
    return;
  }

  const { getURL, sendMessage } = chrome.runtime;

  const renderer = document.querySelector('ytd-shorts [is-active]');
  const actions = renderer?.querySelector('#actions');

  if (!actions) {
    setTimeout(displayShortsToVideoButton, INTERVAL_MS);
    return;
  }

  let button = actions.querySelector('.yte-shorts-actions-btn');

  if (button) {
    return;
  }

  const image = document.createElement('img');
  image.src = getURL('resources/video-play.svg');
  image.classList.add('yte-shorts-actions-btn-icon');

  button = document.createElement('button');

  button.classList.add(
    'yte-shorts-actions-btn',
    'yt-spec-button-shape-next',
    'yt-spec-button-shape-next--tonal',
    'yt-spec-button-shape-next--mono',
    'yt-spec-button-shape-next--size-l',
    'yt-spec-button-shape-next--icon-button');

  button.appendChild(image);

  button.addEventListener('click', () => {
    const currentUrl = window.location.href;

    if (!currentUrl.includes('youtube.com/shorts')) {
      return;
    }

    const videoUrl = currentUrl.replace('youtube.com/shorts', 'youtube.com/video');

    renderer.querySelector('video').pause();
    sendMessage({ action: 'open-video-from-shorts', url: videoUrl });
  });

  actions.insertBefore(button, actions.querySelector('#menu-button'));
}

/**
 * Adds CSS classes to the shorts page elements to style them. Runs recursively
 * with a specified interval until all the elements are found and styled.
 *
 * @param {boolean} firstRun - If it's the first run of the function.
 * @param {string[]} missingElements - The elements that are not found yet.
 */
export function addShortsUiUpdates(firstRun = true, missingElements = []) {
  const INTERVAL_MS = 200;

  const isShortsPage = window.location.href.includes('youtube.com/shorts');

  if (!isShortsPage) {
    return;
  }

  if (!firstRun && missingElements.length < 1) {
    return;
  }

  const addCssClass = (className, selector) => {
    const missing = missingElements.includes(className);

    if (!firstRun && !missing) {
      return;
    }

    const element = document.querySelector(selector);

    if (!element) {
      missingElements.push(className);
      return;
    }

    element.classList.add(className);
    missing && missingElements.splice(missingElements.indexOf(className), 1);
  };

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

  classes.forEach(({ className, selector }) => addCssClass(className, selector));

  if (missingElements.length < 1) {
    return;
  }

  setTimeout(() => addShortsUiUpdates(false, missingElements), INTERVAL_MS);
}

/**
 * Removes CSS classes with a specific prefix from the page elements.
 * By default, it removes all classes with the 'yte' prefix, so all the
 * classes that are added by this extension.
 *
 * @param {string} classNamePrefix - The prefix of the classes to remove.
 */
export function removeCssClasses(classNamePrefix = 'yte') {
  const isShortsPage = window.location.href.includes('youtube.com/shorts');

  if (isShortsPage) {
    return;
  }

  const elements = document.querySelectorAll(`[class*="${classNamePrefix}"]`);

  elements.forEach((element) => {
    const classNamesToRemove = Array.from(element.classList)
      .filter((className) => className.startsWith(classNamePrefix));

    element.classList.remove(...classNamesToRemove);
  });
}
