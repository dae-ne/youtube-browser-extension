import { Actions } from '../actions';
import Feature from '../feature';
import { Result } from '../types';

/**
 * Removes the sponsored shorts from the shorts page.
 */
export default class RemoveSponsoredShortsFeature extends Feature {
  /**
   * Creates an instance of RemoveSponsoredShortsFeature.
   */
  public constructor() {
    super({
      setUpAction: Actions.REMOVE_SPONSORED_SHORTS
    });
  }

  /**
   * Removes the sponsored shorts from the shorts page.
   *
   * @returns The status of the function and the parameters.
   */
  public setUp = (): Result => {
    const sponsoredShorts = document.querySelectorAll('ytd-reel-video-renderer');

    if (!sponsoredShorts) {
      return { status: 'error', params: {} };
    }

    sponsoredShorts.forEach(sponsoredShort => {
      if (!sponsoredShort.querySelector('.overlay > ytd-reel-player-overlay-renderer')) {
        sponsoredShort.remove();
      }
    });

    return { status: 'success', params: {} };
  };

  /**
   * Cleans up the feature. Not used in this feature.
   */
  public cleanUp: () => void;

  /**
   * Disables the feature. Not used in this feature.
   */
  public disable: () => void;
}
