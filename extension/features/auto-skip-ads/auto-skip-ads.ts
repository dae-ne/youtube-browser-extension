import { Actions } from 'actions';
import Feature from 'feature';
import { getMainVideoElement, isVideoOpened } from 'lib/utils';
import { type Result, results } from 'result';

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
     * Automatically skips ads on the current video. Uses a mutation observer to watch for changes
     * in the ads container.
     *
     * @returns The status of the function and the parameters.
     */
    public setUp = (): Result => {
        const { success, fail } = results;

        if (!isVideoOpened()) {
            return success();
        }

        this.adsObserver.disconnect();

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
     * Disconnects the mutation observer used to watch for ads. Does not disconnect the observer if
     * a video (also in the miniplayer) is currently opened unless the force parameter is set to
     * true.
     *
     * @param force - Whether to force the cleanup. If true, the observer will be disconnected even
     *                if a video is currently opened.
     */
    public cleanUp = (force = false): void => {
        if (!force && isVideoOpened()) {
            return;
        }

        this.adsObserver.disconnect();
    };

    /**
     * Disables the feature by disconnecting the mutation observer.
     */
    public disable = (): void => {
        this.cleanUp(true);
    };

    /**
     * Skips an ad on the current video.
     *
     * @remarks
     * This function will skip ads by setting the video current time to the maximum value.
     * Paused videos are not skipped unless they are close to the end (to avoid skipping the video
     * itself and skip ads at the end of the video).
     *
     * @returns Whether the function was successful.
     */
    private skipAd = (): boolean => {
        const MAX_NON_SKIPABLE_AD_DURATION = 30;

        const skipButton: HTMLButtonElement | null =
            document.querySelector('button[class*="-skip-"]');
        const isSkippable = !!skipButton;

        // doesn't work enymore
        // if (isSkippable) {
        //     skipButton.click();
        //     return true;
        // }

        const video = getMainVideoElement();

        if (!video) {
            return false;
        }

        const pausedSkippingTrheshold = video.duration * 0.9;
        const canPausedVideoBeSkipped = video.currentTime > pausedSkippingTrheshold;

        if (
            // skippable ads can be longer than 30 seconds
            (!isSkippable && video.duration > MAX_NON_SKIPABLE_AD_DURATION) ||
            (video.paused && !canPausedVideoBeSkipped)
        ) {
            return true;
        }

        video.currentTime = Number.MAX_VALUE;
        return true;
    };
}
