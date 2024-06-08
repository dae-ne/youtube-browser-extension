'use strict';

export function loopVideo() {
  document.querySelector('video').loop = true;
}

export function displayShortsToVideoButton() {
  const isShortsPage = window.location.href.includes('youtube.com/shorts');

  if (!isShortsPage) {
    return;
  }

  const { getURL, sendMessage } = chrome.runtime;

  const renderer = document.querySelector('ytd-shorts [is-active]');
  const actions = renderer?.querySelector('#actions');

  if (!actions) {
    setTimeout(displayShortsToVideoButton, 200);
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

export function addShortsUiUpdates(firstRun = true, missingElements = []) {
  const isShortsPage = window.location.href.includes('youtube.com/shorts');

  if (!isShortsPage) {
    return;
  }

  if (!firstRun && missingElements.length === 0) {
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

  setTimeout(() => addShortsUiUpdates(false, missingElements), 200);
}

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
