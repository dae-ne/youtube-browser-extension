import { isVideoOpened } from '../lib/utils';
import { Feature, FeatureResult } from '../types';

/**
 * A feature that automatically skips advertisements on the current video.
 *
 * @remarks
 * This feature uses a mutation observer to watch for changes in the advertisements container and
 * automatically skips the ads. It's not an AdBlocker, it waits until the skip button appears and
 * then clicks it.
 */
export default class AutoSkipAdvertisementsFeature implements Feature {
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
