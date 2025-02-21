import { Actions } from 'actions.js';
import Feature from 'feature.js';
import { addCssClassToBody, removeCssClass } from 'lib/utils.js';
import { type Result, results } from 'result.js';

/**
 * The class name for the hide-in-feed-ads feature, which is added to the body element.
 */
const CLASS_NAME = 'yte-f-hide-in-feed-ads';

/**
 * A feature that hides the in-feed ads.
 *
 * @remarks
 * This feature hides the in-feed ads on the YouTube website by adding a class to the body element.
 * If the class is present, the in-feed ads are hidden by the injected CSS.
 */
export default class HideInFeedAdsFeature extends Feature {
    public constructor() {
        super({
            setUpAction: Actions.HIDE_IN_FEED_ADS,
            disableAction: Actions.HIDE_IN_FEED_ADS_DISABLE
        });
    }

    public setUp = (): Result => {
        const { success, fail } = results;
        return addCssClassToBody(CLASS_NAME) ? success() : fail();
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public cleanUp = (): void => {};

    public disable = (): void => {
        removeCssClass(CLASS_NAME);
    };
}
