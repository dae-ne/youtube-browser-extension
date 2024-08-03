import { Actions } from 'actions';
import Feature from 'feature';
import { addCssClassToBody, getMainVideoElement, isVideoOpened, removeCssClass } from 'lib/utils';
import { Result, results } from 'result';

/**
 * The class name for the feature, which is added to the body element.
 */
const CLASS_NAME = 'yte-f-remove-adblock-error-message';

/**
 * A feature that removes the adblock error message after skipping ads.
 */
export default class RemoveAdblockErrorMessageFeature extends Feature {
  /**
   * This mutation observer is used to watch for changes in the error screen. When the error screen
   * appears, it will click the video to try to reload its source. It also removes the
   * 'player-unavailable' attribute from an element to unblock the video.
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
      const video = getMainVideoElement();
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
   *
   * @remarks
   * The video works after the first error screen, but it fails to load the next video. The reload
   * seems to be the only way to fix it. It's also done in between the videos, so it's almost
   * unnoticeable for the user.
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
      setUpAction: Actions.REMOVE_ADBLOCK_ERROR_MESSAGE,
      cleanUpAction: Actions.REMOVE_ADBLOCK_ERROR_MESSAGE_CLEANUP,
      disableAction: Actions.REMOVE_ADBLOCK_ERROR_MESSAGE_DISABLE
    });
  }

  /**
   * Sets up the feature by adding the global feature class name to the body element and observing
   * the error screen for changes. If an error message appears, it will try to reload the video
   * source.
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
    this.errorScreenObserver.observe(errorScreen, { childList: true });

    return success();
  };

  /**
   * Disconnects the mutation observers. Does not disconnect the observers if a video (also in the
   * miniplayer) is currently opened. Can disconnect the observers for the video pages if the force
   * parameter is set to true.
   *
   * @param force - Whether to force the cleanup. If true, the observers will be disconnected even
   *                if a video is currently opened.
   */
  public cleanUp = (force = false) => {
    if (!force && isVideoOpened()) {
      return;
    }

    this.errorScreenObserver.disconnect();
    this.videoSrcRemovedObserver.disconnect();
  };

  /**
   * Disables the feature by disconnecting the mutation observers and removing the global feature
   * class name.
   */
  public disable = () => {
    this.cleanUp(true);
    removeCssClass(CLASS_NAME);
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
