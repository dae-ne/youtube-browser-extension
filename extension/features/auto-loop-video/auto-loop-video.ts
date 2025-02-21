import { Actions } from 'actions';
import Feature from 'feature';
import { type Result, results } from 'result';

/**
 * A feature that automatically loops the video.
 *
 * @remarks
 * This feature is used after clicking the 'shorts to video' button on the shorts page. It opens
 * the video in a new tab and automatically loops it if the shorts to video loop option is enabled.
 */
export default class AutoLoopVideoFeature extends Feature {
    public constructor() {
        super({
            setUpAction: Actions.AUTO_LOOP_VIDEO
        });
    }

    public setUp = (): Result => {
        const { success, fail } = results;
        const video = document.querySelector('video');

        if (!video) {
            return fail();
        }

        video.loop = true;
        return success();
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public cleanUp = (): void => {};

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public disable = (): void => {};
}
