import { ACTIONS } from '../actions';
import Feature, { FeatureResult } from '../feature';

/**
 * Removes the sponsored shorts from the shorts page.
 */
export default class RemoveSponsoredShortsFeature extends Feature {
  /**
   * Creates an instance of RemoveSponsoredShortsFeature.
   */
  public constructor() {
    super({
      setUpAction: ACTIONS.REMOVE_SPONSORED_SHORTS
    });
  }

  /**
   * Removes the sponsored shorts from the shorts page.
   *
   * @returns The status of the function and the parameters.
   */
  public setUp = (): FeatureResult => {
    const sponsoredShorts = document.querySelectorAll('ytd-reel-video-renderer');

    if (!sponsoredShorts) {
      return { status: 'fail', params: {} };
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
  public cleanUp = () => {
    throw new Error('Method not implemented.');
  };

  /**
   * Disables the feature. Not used in this feature.
   */
  public disable = () => {
    throw new Error('Method not implemented.');
  };
}
