import { Actions } from '../actions';
import Feature from '../feature';
import { Result } from '../types';

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
      setUpAction: Actions.AUTO_LOOP_VIDEO
    });
  }

  /**
   * Finds the video element and sets the loop property.
   *
   * @returns The status of the function and the parameters.
   */
  public setUp = (): Result => {
    const video = document.querySelector('video');

    if (!video) {
      return { status: 'error', params: {} };
    }

    video.loop = true;
    return { status: 'success', params: {} };
  };

  /**
   * Not needed for this feature.
   */
  public cleanUp: () => void;

  /**
   * Not needed for this feature.
   */
  public disable: () => void;
}
