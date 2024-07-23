import { Actions } from '../actions';
import Feature from '../feature';
import { isVideoOpened } from '../lib/utils';
import { Result } from '../types';

/**
 * A feature that automatically skips ads on the current video.
 */
export default class AutoSkipAdsFeature extends Feature {
  /**
   * This mutation observer is used to watch for changes in the ads container and skip the ads
   * when they appear.
   */
  private readonly observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.target.childNodes.length > 0) {
        this.skipAd();
      }
    });
  });

  /**
   * Initializes the feature with action names.
   */
  public constructor() {
    super({
      setUpAction: Actions.AUTO_SKIP_ADS,
      cleanUpAction: Actions.AUTO_SKIP_ADS_CLEANUP,
      disableAction: Actions.AUTO_SKIP_ADS_DISABLE
    });
  }

  /**
   * Automatically skips ads on the current video. Uses a mutation observer to watch for changes in
   * the ads container.
   *
   * @returns The status of the function and the parameters.
   */
  public setUp = (): Result => {
    if (!isVideoOpened()) {
      return { status: 'success', params: {} };
    }

    const adsInfoContainer = document.querySelector('.video-ads');

    if (!adsInfoContainer) {
      return { status: 'error', params: {} };
    }

    this.cleanUp();
    const isAdPlaying = adsInfoContainer.childNodes.length > 0;

    if (isAdPlaying) {
      this.skipAd();
    }

    this.observer.observe(adsInfoContainer, { childList: true });
    return { status: 'success', params: {} };
  };

  /**
   * Disconnects the mutation observer used to watch for ads. Does not disconnect
   * the observer if a video is currently opened.
   */
  public cleanUp = () => {
    if (isVideoOpened()) {
      return;
    }

    this.observer.disconnect();
  };

  /**
   * Disables the feature by disconnecting the mutation observer.
   */
  public disable = () => {
    this.observer.disconnect();
  };

  /**
   * Skips an ad on the current video.
   *
   * @remarks
   * This function will skip the ad by clicking the skip button if it exists, or by increasing the
   * playback rate of the video. The maximum playback rate is 16 for most browsers (at least for
   * Chrome).
   */
  private skipAd = () => {
    const MAX_NON_SKIPABLE_AD_DURATION = 30;
    const AD_PLAYBACK_RATE = 16;

    const skipButton: HTMLButtonElement | null = document.querySelector('button[class*="-skip-"]');

    if (skipButton) {
      skipButton.click();
      return;
    }

    const video = document.querySelector('video');

    if (!video) {
      return;
    }

    if (video.duration > MAX_NON_SKIPABLE_AD_DURATION) {
      return;
    }

    video.muted = true;
    video.playbackRate = AD_PLAYBACK_RATE;
  };
}
