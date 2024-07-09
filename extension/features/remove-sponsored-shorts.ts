import { ACTIONS } from '../actions';
import Feature from '../feature';
import { FeatureResult } from '../types';

// TODO: add documentation

export default class RemoveSponsoredShortsFeature extends Feature {
  public constructor() {
    super(ACTIONS.REMOVE_SPONSORED_SHORTS);
  }

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

  public cleanUp = () => {};

  public disable = () => {};
}
