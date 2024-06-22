import { ACTIONS } from '../actions';
import { isShortsPage } from '../lib/utils';

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
 */
let observer: MutationObserver | null = null;

/**
 * The controller for the abort signal. It's used to remove event listeners.
 */
let controller: AbortController | null = null;

/**
 * Displays a button to open the video from the shorts page (new button on
 * an action bar next to the shorts player). When clicked, it opens the video
 * page in a new tab.
 *
 * @returns {Object} The status of the function and the parameters.
 */
export function displayShortsToVideoButton() {
  if (!isShortsPage()) {
    return { status: 'success', params: {} };
  }

  const { renderer, actions } = getRendererAndActionsContainer();

  if (!actions) {
    return { status: 'fail', params: {} };
  }

  let newButtonContainer = actions.querySelector(`#${BUTTON_ID}`);
  const shareButtonContainer = actions.querySelector('#share-button');

  cleanUp();
  controller = new AbortController();

  if (!shareButtonContainer) {
    return { status: 'fail', params: {} };
  }

  if (!!newButtonContainer) {
    const label = newButtonContainer.querySelector('label');
    const touchFeedback = newButtonContainer.querySelector('yt-touch-feedback-shape');

    handleUiChanges(label, touchFeedback);
    handleButtonEvents(renderer, label, shareButtonContainer);

    return { status: 'success', params: {} };
  }

  newButtonContainer = shareButtonContainer.cloneNode(true) as HTMLElement;
  actions.insertBefore(newButtonContainer, shareButtonContainer.nextSibling);

  newButtonContainer.id = BUTTON_ID;

  const button = createButton(newButtonContainer, shareButtonContainer);
  handleButtonEvents(renderer, button, shareButtonContainer);
  return { status: 'success', params: {} };
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
function createButton(container: Element, templateContainer: Element) {
  const templateButtonLabel = templateContainer.querySelector('label');
  const templateButton = templateContainer.querySelector('button');

  if (!templateButtonLabel || !templateButton) {
    return;
  }

  const templateButtonTouchFeedback = templateButton.querySelector('yt-touch-feedback-shape');

  if (!templateButtonTouchFeedback) {
    return;
  }

  const newButtonLabel = templateButtonLabel.cloneNode();
  const newButton = document.createElement('button');
  const newButtonTouchFeedback = templateButtonTouchFeedback.cloneNode(true);

  newButton.classList.add(...templateButton.classList);

  const icon = document.createElement('img');
  icon.src = chrome.runtime.getURL('resources/video-play.svg');
  icon.classList.add('yte-shorts-actions-btn-icon');

  newButton.appendChild(icon);

  newButtonLabel.appendChild(newButton);
  newButton.appendChild(newButtonTouchFeedback);

  const buttonShape = container.querySelector('yt-button-shape');

  if (!buttonShape) {
    return;
  }

  buttonShape.appendChild(newButtonLabel);

  handleUiChanges(newButtonLabel, newButtonTouchFeedback);
  return newButton;
}

/**
 * Adds event listeners and a mutation observer to the button. The observer
 * watches for changes in the share button and updates the new button
 * accordingly.
 *
 * @param {HTMLElement} renderer The video renderer element.
 * @param {HTMLElement} button The new button.
 * @param {HTMLElement} templateButtonContainer The template container for the new button.
 */
function handleButtonEvents(renderer, button, templateButtonContainer) {
  observer = createNewObserver();

  observer.observe(templateButtonContainer.querySelector('label'), {
    attributes: true,
    attributeFilter: ['class']
  });

  button.addEventListener('click', () => {
    handleButtonClick(renderer);
  }, { signal: controller?.signal });
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
 * @param {HTMLElement} label The button label.
 * @param {HTMLElement} touchFeedback The touch feedback element.
 */
function handleUiChanges(label, touchFeedback) {
  const buttonPressedClassName = 'yt-spec-touch-feedback-shape--down';

  label.addEventListener('mousedown', () => {
    touchFeedback.firstChild.classList.add(buttonPressedClassName);
  }, { signal: controller?.signal });

  label.addEventListener('mouseup', () => {
    touchFeedback.firstChild.classList.remove(buttonPressedClassName);
  }, { signal: controller?.signal });

  label.addEventListener('mouseleave', () => {
    touchFeedback.firstChild.classList.remove(buttonPressedClassName);
  }, { signal: controller?.signal });
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
