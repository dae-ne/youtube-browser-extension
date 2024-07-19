import { ACTIONS } from '../actions';
import Feature from '../feature';
import { isShortsPage } from '../lib/utils';
import { FeatureResult } from '../types';

/**
 * The ID of the button container to open the video from the shorts page.
 */
const BUTTON_ID = 'yte-shorts-to-video-button';

/**
 * A feature that displays a button to open the video from the shorts page.
 *
 * @remarks
 * This feature displays a new button on the action bar next to the shorts player. When clicked, it
 * opens the video page in a new tab.
 */
export default class ShortsToVideoButtonFeature extends Feature {
  /**
   * The mutation observer for the shorts page.
   *
   * @remarks
   * This observer watches for changes in the share button and updates the new button accordingly.
   */
  private observer: MutationObserver | null = null;

  /**
   * The controller for the abort signal. It's used to remove event listeners.
   */
  private controller: AbortController | null = null;

  /**
   * Initializes the feature with action names.
   */
  public constructor() {
    super({
      setUpAction: ACTIONS.SHORTS_TO_VIDEO_BUTTON,
      cleanUpAction: ACTIONS.SHORTS_TO_VIDEO_BUTTON_CLEANUP
    });
  }

  /**
   * Displays a button to open the video from the shorts page (new button on the action bar next to
   * the shorts player). When clicked, it opens the video page in a new tab.
   *
   * @returns The status of the function and the parameters.
   */
  public setUp = (): FeatureResult => {
    if (!isShortsPage()) {
      return { status: 'success', params: {} };
    }

    const { renderer, actions } = this.getRendererAndActionsContainer();

    if (!actions) {
      return { status: 'fail', params: {} };
    }

    let newButtonContainer = actions.querySelector(`#${BUTTON_ID}`);
    const shareButtonContainer = actions.querySelector('#share-button') as HTMLElement;

    this.cleanUp();
    this.controller = new AbortController();

    if (!shareButtonContainer) {
      return { status: 'fail', params: {} };
    }

    if (newButtonContainer) {
      const label = newButtonContainer.querySelector('label') as HTMLLabelElement;
      const button = newButtonContainer.querySelector('button') as HTMLButtonElement;
      const touchFeedback = newButtonContainer.querySelector(
        'yt-touch-feedback-shape'
      ) as HTMLElement;

      this.handleUiChanges(label, touchFeedback);
      this.handleButtonEvents(renderer, button, shareButtonContainer);

      return { status: 'success', params: {} };
    }

    newButtonContainer = shareButtonContainer.cloneNode(true) as HTMLElement;
    actions.insertBefore(newButtonContainer, shareButtonContainer.nextSibling);

    newButtonContainer.id = BUTTON_ID;

    const button = this.createButton(newButtonContainer, shareButtonContainer);

    if (!button) {
      return { status: 'fail', params: {} };
    }

    this.handleButtonEvents(renderer, button, shareButtonContainer);
    return { status: 'success', params: {} };
  };

  /**
   * Disconnects the mutation observer used to watch for changes in the share button and removes
   * event listeners.
   */
  public cleanUp = () => {
    this.observer?.disconnect();
    this.controller?.abort();
  };

  /**
   * Not needed for this feature.
   */
  public disable = () => {};

  /**
   * Creates the new button. It clones nodes from elements that already exist on the page and adds
   * event listeners.
   *
   * @param container The container for the new button.
   * @param templateContainer The template container for the new button.
   * @returns The new button if it was created.
   */
  private createButton = (
    container: Element,
    templateContainer: Element
  ): HTMLButtonElement | null => {
    const templateButtonLabel = templateContainer.querySelector('label');
    const templateButton = templateContainer.querySelector('button');

    if (!templateButtonLabel || !templateButton) {
      return null;
    }

    const templateButtonTouchFeedback = templateButton.querySelector('yt-touch-feedback-shape');

    if (!templateButtonTouchFeedback) {
      return null;
    }

    const newButtonLabel = templateButtonLabel.cloneNode() as HTMLLabelElement;
    const newButton = document.createElement('button');
    const newButtonTouchFeedback = templateButtonTouchFeedback.cloneNode(true) as HTMLElement;

    newButton.classList.add(...templateButton.classList);

    const icon = document.createElement('img');
    icon.src = chrome.runtime.getURL('resources/video-play.svg');
    icon.classList.add('yte-shorts-actions-btn-icon');

    newButton.appendChild(icon);

    newButtonLabel.appendChild(newButton);
    newButton.appendChild(newButtonTouchFeedback);

    const buttonShape = container.querySelector('yt-button-shape');

    if (!buttonShape) {
      return null;
    }

    buttonShape.appendChild(newButtonLabel);

    this.handleUiChanges(newButtonLabel, newButtonTouchFeedback);
    return newButton;
  };

  /**
   * Adds event listeners and a mutation observer to the button. The observer watches for changes
   * in the share button and updates the new button accordingly.
   *
   * @param renderer The video renderer element.
   * @param button The new button.
   * @param templateButtonContainer The template container for the new button.
   */
  private handleButtonEvents = (
    renderer: HTMLElement,
    button: HTMLButtonElement,
    templateButtonContainer: HTMLElement
  ) => {
    this.observer = this.createNewObserver();
    const label = templateButtonContainer.querySelector('label') as HTMLLabelElement;

    button.addEventListener(
      'click',
      () => {
        this.handleButtonClick(renderer);
      },
      { signal: this.controller?.signal }
    );

    if (!this.observer) {
      return;
    }

    this.observer.observe(label, {
      attributes: true,
      attributeFilter: ['class']
    });
  };

  /**
   * Handles the button click event. It opens the video page in a new tab.
   *
   * @param renderer The video renderer element.
   */
  private handleButtonClick = (renderer: HTMLElement) => {
    const currentUrl = window.location.href;

    if (!currentUrl.includes('youtube.com/shorts')) {
      return;
    }

    const videoUrl = currentUrl.replace('youtube.com/shorts', 'youtube.com/video');
    const video = renderer.querySelector('video');

    if (!video) {
      return;
    }

    video.pause();
    chrome.runtime.sendMessage({
      action: ACTIONS.OPEN_VIDEO_FROM_SHORTS,
      url: videoUrl
    });
  };

  /**
   * Updates the CSS classes of the button to match the default youtube buttons.
   *
   * @param container The container for the new button.
   * @param templateContainer The template container for the new button.
   */
  private updateCssClasses = (container: HTMLElement, templateContainer: HTMLElement) => {
    const button = container.querySelector('button');
    const label = container.querySelector('label');
    const templateButton = templateContainer.querySelector('button');
    const templateLabel = templateContainer.querySelector('label');

    if (!button || !label || !templateButton || !templateLabel) {
      return;
    }

    button.classList.add(...templateButton.classList);
    label.classList.add(...templateLabel.classList);
  };

  /**
   * Handles the UI changes when the button is pressed.
   *
   * @param label The button label.
   * @param touchFeedback The touch feedback element.
   */
  private handleUiChanges = (label: HTMLElement, touchFeedback: HTMLElement) => {
    const buttonPressedClassName = 'yt-spec-touch-feedback-shape--down';
    const child = touchFeedback.firstChild as HTMLElement;

    label.addEventListener(
      'mousedown',
      () => {
        child.classList.add(buttonPressedClassName);
      },
      { signal: this.controller?.signal }
    );

    label.addEventListener(
      'mouseup',
      () => {
        child.classList.remove(buttonPressedClassName);
      },
      { signal: this.controller?.signal }
    );

    label.addEventListener(
      'mouseleave',
      () => {
        child.classList.remove(buttonPressedClassName);
      },
      { signal: this.controller?.signal }
    );
  };

  /**
   * Creates a new mutation observer to watch for UI changes.
   *
   * @returns The new observer.
   */
  private createNewObserver = (): MutationObserver => {
    return new MutationObserver((_mutations, observer) => {
      const { actions } = this.getRendererAndActionsContainer();

      if (!isShortsPage() || !actions) {
        observer?.disconnect();
        return;
      }

      const container = actions.querySelector(`#${BUTTON_ID}`) as HTMLElement;
      const templateContainer = actions.querySelector('#share-button') as HTMLElement;

      this.updateCssClasses(container, templateContainer);
    });
  };

  /**
   * Gets the actions container from the renderer.
   *
   * @returns The actions container.
   */
  private getRendererAndActionsContainer = () => {
    const renderer = document.querySelector('ytd-shorts [is-active]') as HTMLElement;
    const actions = renderer?.querySelector('#actions') as HTMLElement;
    return { renderer, actions };
  };
}
