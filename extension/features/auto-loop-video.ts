import { ACTIONS } from '../actions';
import Feature, { FeatureResult } from '../feature';

/**
 * A feature that automatically loops the video.
 *
 * @remarks
 * This feature is used after clicking the 'shorts to video' button on the shorts page. It opens
 * the video in a new tab and automatically loops it if the shorts to video loop option is enabled.
 */
export default class AutoLoopVideoFeature extends Feature {
  /**
   * Initializes the feature with action names.
   */
  public constructor() {
    super({
      setUpAction: ACTIONS.AUTO_LOOP_VIDEO
    });
  }

  /**
   * Finds the video element and sets the loop property.
   *
   * @returns The status of the function and the parameters.
   */
  public setUp = (): FeatureResult => {
    const video = document.querySelector('video');

    if (!video) {
      return { status: 'fail', params: {} };
    }

    video.loop = true;
    return { status: 'success', params: {} };
  };

  /**
   * Not needed for this feature.
   */
  public cleanUp = () => {};

  /**
   * Not needed for this feature.
   */
  public disable = () => {};
}
