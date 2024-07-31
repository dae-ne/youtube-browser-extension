import { Actions } from 'actions';
import Feature from 'feature';
import { isVideoOpened, removeCssClass } from 'lib/utils';
import { Result, results } from 'result';

/**
 * The class name for the hide-in-feed-ads feature, which is added to the body element.
 */
const CLASS_NAME = 'yte-f-auto-skip-ads';

/**
 * A feature that automatically skips ads on the current video.
 */
export default class AutoSkipAdsFeature extends Feature {
  /**
   * This mutation observer is used to watch for changes in the ads container and skip the ads
   * when they appear.
   */
  private readonly adsObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.target.childNodes.length > 0) {
        this.skipAd();
      }
    });
  });

  /**
   * This mutation observer is used to watch for changes in the error screen. When the error screen
   * appears, it will click the video to try to reload it and remove the 'player-unavailable'
   * attribute from an element to unblock the video.
   */
  private readonly errorScreenObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        return;
      }

      const UNAVAILABLE_ATTRIBUTE_NAME = 'player-unavailable';
      const element = document.querySelector(`[${UNAVAILABLE_ATTRIBUTE_NAME}]`);

      if (!element) {
        return;
      }

      element.removeAttribute(UNAVAILABLE_ATTRIBUTE_NAME);
      const video = document.querySelector('video');

      if (!video) {
        return;
      }

      video.click();

      (mutation.target as HTMLElement).innerHTML = '';
      this.videoSrcObserver.observe(video, { attributes: true, attributeFilter: ['src'] });
    });
  });

  /**
   * This mutation observer is used to watch for changes in the video source. When the source is
   * removed, it will reload the page.
   */
  private readonly videoSrcObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      const video = mutation.target as HTMLVideoElement;

      if (mutation.attributeName === 'src' && !video.getAttribute('src')) {
        window.location.reload();
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
    const { success, fail } = results;

    if (!isVideoOpened()) {
      return fail();
    }

    const body = document.querySelector('body');

    if (!body) {
      return fail();
    }

    body.classList.add(CLASS_NAME);

    const errorScreen = document.querySelector('#error-screen');

    if (!errorScreen) {
      return fail();
    }

    this.cleanUp();
    this.errorScreenObserver.observe(errorScreen, { childList: true });
    const adsInfoContainer = document.querySelector('.video-ads');

    if (!adsInfoContainer) {
      return fail();
    }

    const isAdPlaying = adsInfoContainer.childNodes.length > 0;
    let skippedSuccessfully = false;

    if (isAdPlaying) {
      skippedSuccessfully = this.skipAd();
    }

    if (!skippedSuccessfully) {
      return fail();
    }

    this.adsObserver.observe(adsInfoContainer, { childList: true });
    return success();
  };

  /**
   * Disconnects the mutation observer used to watch for ads. Does not disconnect
   * the observer if a video (also in the miniplayer) is currently opened.
   */
  public cleanUp = () => {
    if (isVideoOpened()) {
      return;
    }

    this.adsObserver.disconnect();
    this.errorScreenObserver.disconnect();
    this.videoSrcObserver.disconnect();
  };

  /**
   * Disables the feature by disconnecting the mutation observer and removing the global feature
   * class name.
   */
  public disable = () => {
    this.adsObserver.disconnect();
    this.errorScreenObserver.disconnect();
    this.videoSrcObserver.disconnect();
    removeCssClass(CLASS_NAME);
  };

  /**
   * Skips an ad on the current video.
   *
   * @remarks
   * This function will skip ads by clicking the skip button if it exists, or by setting the video
   * current time to the maximum value. Paused videos are not skipped unless they are close to the
   * end (to avoid skipping the video itself and skip ads at the end of the video).
   *
   * @returns Whether the function was successful.
   */
  private skipAd = (): boolean => {
    const MAX_NON_SKIPABLE_AD_DURATION = 30;

    const skipButton: HTMLButtonElement | null = document.querySelector('button[class*="-skip-"]');
    const isSkippable = !!skipButton;

    if (isSkippable) {
      skipButton.click();
      return true;
    }

    const video = document.querySelector('video');

    if (!video) {
      return false;
    }

    const pausedSkippingTrheshold = video.duration * 0.9;
    const canPausedVideoBeSkipped = video.currentTime > pausedSkippingTrheshold;

    if (
      video.duration > MAX_NON_SKIPABLE_AD_DURATION ||
      (video.paused && !canPausedVideoBeSkipped)
    ) {
      return true;
    }

    video.currentTime = Number.MAX_VALUE;
    return true;
  };
}
