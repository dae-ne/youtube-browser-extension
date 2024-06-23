import { ACTIONS } from '../actions';
import Feature from '../feature';
import { isVideoOpened } from '../lib/utils';
import { FeatureResult } from '../types';

/**
 * A feature that automatically skips advertisements on the current video.
 */
export default class AutoSkipAdvertisementsFeature extends Feature {
  /**
   * This mutation observer is used to watch for changes in the advertisements container and skip
   * the ads when they appear.
   */
  private readonly observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.childNodes.length > 0) {
        this.skipAdvertisement();
      }
    });
  });

  /**
   * Initializes the feature with action names.
   */
  public constructor() {
    super(ACTIONS.AUTO_SKIP_ADVERTISEMENTS, ACTIONS.AUTO_SKIP_ADVERTISEMENTS_CLEANUP);
  }

  /**
   * Automatically skips ads on the current video. Uses a mutation observer to watch for changes in
   * the advertisements container.
   *
   * @returns The status of the function and the parameters.
   */
  public setUp = (): FeatureResult => {
    if (!isVideoOpened()) {
      return { status: 'success', params: {} };
    }

    const adsInfoContainer = document.querySelector('.video-ads');

    if (!adsInfoContainer) {
      return { status: 'fail', params: {} };
    }

    const isAdPlaying = adsInfoContainer.childNodes.length > 0;

    if (isAdPlaying) {
      this.skipAdvertisement();
    }

    this.cleanUp();
    this.observer.observe(adsInfoContainer, { childList: true });
    return { status: 'success', params: {} };
  }

  /**
   * Disconnects the mutation observer used to watch for advertisements. Does not disconnect
   * the observer if a video is currently opened.
   */
  public cleanUp = () => {
    if (isVideoOpened()) {
      return;
    }

    this.observer.disconnect();
  }

  /**
   * Disables the feature by disconnecting the mutation observer.
   */
  public disable = () => {
    this.observer.disconnect();
  }

  /**
   * Skips an advertisement on the current video. Clicks the skip button if it exists.
   */
  private skipAdvertisement = () => {
    const skipButton: HTMLButtonElement | null = document.querySelector('button[class*="-skip-"]');

    if (skipButton) {
      skipButton.click();
    }

    const video = document.querySelector('video') as HTMLVideoElement;
    video.currentTime = Number.MAX_VALUE;
  }
}
