import { Actions } from 'actions';
import Feature from 'feature';
import { addCssClassToBody, isVideoOpened, removeCssClass } from 'lib/utils';
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

      // YouTube keeps skipping all the videos, so it's better to reload the page on error.
      if (this.isPlaylistOpened()) {
        this.reloadPage();
        return;
      }

      const UNAVAILABLE_ATTRIBUTE_NAME = 'player-unavailable';
      const video = this.getVideoElement();
      const element = document.querySelector(`[${UNAVAILABLE_ATTRIBUTE_NAME}]`);

      if (!element || !video) {
        return;
      }

      element.removeAttribute(UNAVAILABLE_ATTRIBUTE_NAME);
      video.click();

      (mutation.target as HTMLElement).innerHTML = '';
      this.videoSrcRemovedObserver.disconnect();
      this.videoSrcRemovedObserver.observe(video, { attributes: true, attributeFilter: ['src'] });
    });
  });

  /**
   * This mutation observer is used to watch for changes in the video source. When the source is
   * removed, it will reload the page.
   */
  private readonly videoSrcRemovedObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      const video = mutation.target as HTMLVideoElement;

      if (mutation.attributeName === 'src' && !video.getAttribute('src')) {
        this.reloadPage();
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
      return success();
    }

    if (!addCssClassToBody(CLASS_NAME)) {
      return fail();
    }

    const errorScreen = document.querySelector('#error-screen:not(.ytd-shorts)');

    if (!errorScreen) {
      return fail();
    }

    this.errorScreenObserver.disconnect();
    this.adsObserver.disconnect();
    this.errorScreenObserver.observe(errorScreen, { childList: true });

    const adsInfoContainer = document.querySelector('.video-ads');

    if (!adsInfoContainer) {
      return fail();
    }

    const isAdPlaying = adsInfoContainer.childNodes.length > 0;
    const skippedSuccessfully = isAdPlaying ? this.skipAd() : true;

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
  public cleanUp = (force = false) => {
    if (!force && isVideoOpened()) {
      return;
    }

    this.adsObserver.disconnect();
    this.errorScreenObserver.disconnect();
    this.videoSrcRemovedObserver.disconnect();
  };

  /**
   * Disables the feature by disconnecting the mutation observer and removing the global feature
   * class name.
   */
  public disable = () => {
    this.cleanUp(true);
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

    const video = this.getVideoElement();

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

  /**
   * Gets the video element on the current page. The miniplayer is prioritized over the main player.
   */
  private getVideoElement = (): HTMLVideoElement | null => {
    return (
      document.querySelector('.miniplayer video') ??
      document.querySelector('ytd-player:not(.ytd-shorts) video')
    );
  };

  /**
   * Checks if the playlist is opened on the current page.
   *
   * @remarks
   * For some reason, the behavior of the error screen is different when the playlist is opened. so
   * it's handled differently.
   *
   * @returns Whether the playlist is opened.
   */
  private isPlaylistOpened = (): boolean => {
    const playlistItems = document.querySelectorAll('#playlist #items #playlist-items');
    return playlistItems.length > 0;
  };

  /**
   * Reloads the current page.
   *
   * @remarks
   * It's easier to keep it in a separate function because it may be changed in the future to
   * e.g. change the URL adding a query parameter, like the current time.
   */
  private reloadPage = (): void => {
    window.location.reload();
  };
}
