(() => {
  'use strict';

  const { getURL, sendMessage } = chrome.runtime;

  function handleAction(request) {
    switch (request.action) {
      case 'show-shorts-to-video-button':
        displayShortsToVideoButton();
        break;
      case 'add-shorts-ui-updates':
        addShortsUiUpdates();
        break;
      case 'remove-shorts-global-css-classes':
        removeShortsGlobalCssClasses();
        break;
    }
  }

  function isShorts() {
    return window.location.href.includes('youtube.com/shorts');
  }

  function displayShortsToVideoButton() {
    if (!isShorts()) {
      return;
    }

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

  function addShortsUiUpdates(firstRun = true, missingElements = []) {
    if (!isShorts()) {
      return;
    }

    if (!firstRun && missingElements.length === 0) {
      return;
    }

    const addCssClass = (selector, className) => {
      const missing = missingElements.includes(className);

      if (!firstRun && !missing) {
        return;
      }

      const element = document.querySelector(selector);

      if (element) {
        element.classList.add(className);
        missing && missingElements.splice(missingElements.indexOf(className), 1);
      } else {
        missingElements.push(className);
      }
    };

    addCssClass(
      '.ytd-shorts [is-active] .action-container',
      'yte-shorts-actions-container');
    addCssClass(
      '.ytd-shorts [is-active] .metadata-container',
      'yte-shorts-player-metadata-container');
    addCssClass(
      '.navigation-container.ytd-shorts',
      'yte-shorts-navigation-container');
    addCssClass(
      'ytd-page-manager',
      'yte-shorts-g-page-manager');
    addCssClass(
      'ytd-mini-guide-renderer.ytd-app',
      'yte-shorts-g-side-mini-guide');

    if (missingElements.length === 0) {
      return;
    }

    setTimeout(() => addShortsUiUpdates(false, missingElements), 200);
  }

  function removeShortsGlobalCssClasses() {
    if (isShorts()) {
      return;
    }

    const elements = document.querySelectorAll('[class*="yte-shorts-g-"]');

    elements.forEach((element) => {
      const classNamesToRemove = Array.from(element.classList)
        .filter((className) => className.startsWith('yte-shorts-g-'));

      element.classList.remove(...classNamesToRemove);
    });
  }

  chrome.runtime.onMessage.addListener(handleAction);
})();
