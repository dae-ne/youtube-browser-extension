import { ACTIONS } from '../../../shared/actions';
import { isShortsPage } from '../common';

/**
 * The interval in milliseconds for recurring tasks.
 *
 * @constant
 * @type {number}
 * @default
 */
const INTERVAL_MS = 200;

/**
 * The ID of the button to open the added button.
 *
 * @constant
 * @type {string}
 * @default
 */
const BUTTON_ID = 'yte-shorts-to-video-button';

/**
 * The mutation observer for the shorts page.
 *
 * @type {MutationObserver}
 */
let observer = null;

/**
 * The controller for the abort signal. It's used to remove event listeners.
 */
let controller = null;

/**
 * Displays a button to open the video from the shorts page (new button on
 * an action bar next to the shorts player). When clicked, it opens the video
 * page in a new tab.
 */
export function displayShortsToVideoButton() {
  if (!isShortsPage()) {
    return;
  }

  const { renderer, actions } = getRendererAndActionsContainer();

  if (!actions) {
    setTimeout(displayShortsToVideoButton, INTERVAL_MS);
    return;
  }

  let newButtonContainer = actions.querySelector(`#${BUTTON_ID}`);
  const buttonAlreadyExists = !!newButtonContainer;

  if (buttonAlreadyExists) {
    return;
  }

  const shareButtonContainer = actions.querySelector('#share-button');

  if (!shareButtonContainer.querySelector('#tooltip')) {
    setTimeout(displayShortsToVideoButton, INTERVAL_MS);
    return;
  }

  cleanUp();
  controller = new AbortController();

  newButtonContainer = shareButtonContainer.cloneNode(true);
  actions.insertBefore(newButtonContainer, shareButtonContainer.nextSibling);

  newButtonContainer.id = BUTTON_ID;

  const button = createButton(newButtonContainer, shareButtonContainer);

  observer = createNewObserver();

  observer.observe(shareButtonContainer.querySelector('label'), {
    attributes: true,
    attributeFilter: ['class']
  });

  button.addEventListener('click', () => {
    handleButtonClick(renderer);
  }, { signal: controller.signal });
}

/**
 * Disconnects the mutation observer used to watch for changes in the share
 * button and removes event listeners.
 */
export function cleanUp() {
  observer?.disconnect();
  controller?.abort();
}

/**
 * Creates the new button. It clones nodes from elements that already exist
 * on the page and adds event listeners.
 *
 * @param {HTMLElement} container The container for the new button.
 * @param {HTMLElement} templateContainer The template container for the new button.
 * @returns {HTMLElement} The new button.
 */
function createButton(container, templateContainer) {
  const templateButtonLabel = templateContainer.querySelector('label');
  const templateButton = templateContainer.querySelector('button');
  const templateButtonTouchFeedback = templateButton.querySelector('yt-touch-feedback-shape');

  const tooltip = templateContainer.querySelector('#tooltip').cloneNode(true);
  const newButtonLabel = templateButtonLabel.cloneNode();
  const newButton = document.createElement('button');
  const newButtonTouchFeedback = templateButtonTouchFeedback.cloneNode(true);

  newButton.classList = templateButton.classList;

  const icon = document.createElement('img');
  icon.src = chrome.runtime.getURL('resources/video-play.svg');
  icon.classList.add('yte-shorts-actions-btn-icon');

  newButton.appendChild(icon);

  newButtonLabel.appendChild(newButton);
  newButton.appendChild(newButtonTouchFeedback);

  container.querySelector('yt-button-shape').appendChild(newButtonLabel);
  container.querySelector('tp-yt-paper-tooltip').appendChild(tooltip);

  handleUiChanges(newButton, newButtonTouchFeedback);
  return newButton;
}

/**
 * Handles the button click event. It opens the video page in a new tab.
 *
 * @param {HTMLElement} renderer The video renderer element.
 */
function handleButtonClick(renderer) {
  const currentUrl = window.location.href;

  if (!currentUrl.includes('youtube.com/shorts')) {
    return;
  }

  const videoUrl = currentUrl.replace('youtube.com/shorts', 'youtube.com/video');

  renderer.querySelector('video').pause();
  chrome.runtime.sendMessage({
    action: ACTIONS.OPEN_VIDEO_FROM_SHORTS,
    url: videoUrl
  });
}

/**
 * Updates the CSS classes of the button to match the default youtube buttons.
 *
 * @param {HTMLElement} container The container for the new button.
 * @param {HTMLElement} templateContainer The template container for the new button.
 */
function updateCssClasses(container, templateContainer) {
  const button = container.querySelector('button');
  const label = container.querySelector('label');

  button.classList = templateContainer.querySelector('button').classList;
  label.classList = templateContainer.querySelector('label').classList;
}

/**
 * Handles the UI changes when the button is pressed.
 *
 * @param {HTMLElement} button The button element.
 * @param {HTMLElement} touchFeedback The touch feedback element.
 */
function handleUiChanges(button, touchFeedback) {
  const buttonPressedClassName = 'yt-spec-touch-feedback-shape--down';

  button.addEventListener('mousedown', () => {
    touchFeedback.firstChild.classList.add(buttonPressedClassName);
  }, { signal: controller.signal });

  button.addEventListener('mouseup', () => {
    touchFeedback.firstChild.classList.remove(buttonPressedClassName);
  }, { signal: controller.signal });

  button.addEventListener('mouseleave', () => {
    touchFeedback.firstChild.classList.remove(buttonPressedClassName);
  }, { signal: controller.signal });
}

/**
 * Creates a new mutation observer to watch for UI changes.
 *
 * @param {HTMLElement} renderer The video renderer element.
 * @param {HTMLElement} observedElement The element to observe.
 * @returns {MutationObserver} The new observer.
 */
function createNewObserver() {
  return new MutationObserver((_mutations, observer) => {
    const { actions } = getRendererAndActionsContainer();

    if (!isShortsPage() || !actions) {
      observer?.disconnect();
      return;
    }

    const container = actions.querySelector(`#${BUTTON_ID}`);
    const templateContainer = actions.querySelector('#share-button');

    updateCssClasses(container, templateContainer);
  });
}

/**
 * Gets the actions container from the renderer.
 *
 * @param {HTMLElement} renderer The video renderer element.
 * @returns {HTMLElement} The actions container.
 */
function getRendererAndActionsContainer() {
  const renderer = document.querySelector('ytd-shorts [is-active]');
  const actions =  renderer?.querySelector('#actions');
  return { renderer, actions };
}
