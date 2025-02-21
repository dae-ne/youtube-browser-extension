import { Actions } from 'actions';
import Feature from 'feature';
import { addCssClassToBody, removeCssClass } from 'lib/utils';
import { type Result, results } from 'result';

/**
 * The class name to add to the body element.
 *
 * @remarks
 * This class is only a flag for the injected CSS to apply the UI updates. All the styling is
 * implemented in the shorts-ui-tweaks.scss file.
 */
const CLASS_NAME = 'yte-f-shorts-ui-tweaks';

/**
 * The feature class for the Shorts UI tweaks feature.
 */
export default class ShortsUiTweaksFeature extends Feature {
    /**
     * The AbortController instance for the event listener.
     *
     * @remarks
     * This controller is used to abort the window resize event listener.
     */
    private controller: AbortController | null = null;

    public constructor() {
        super({
            setUpAction: Actions.SHORTS_UI_TWEAKS,
            cleanUpAction: Actions.SHORTS_UI_TWEAKS_CLEANUP,
            disableAction: Actions.SHORTS_UI_TWEAKS_DISABLE
        });
    }

    public setUp = (): Result => {
        const { success, fail } = results;
        this.controller?.abort();
        this.controller = new AbortController();
        window.addEventListener(
            'resize',
            () => {
                this.handleUiChanges(true);
            },
            { signal: this.controller.signal }
        );
        const updatedSuccessfully = this.handleUiChanges();
        return updatedSuccessfully && addCssClassToBody(CLASS_NAME) ? success() : fail();
    };

    public cleanUp = (): void => {
        this.controller?.abort();
    };

    public disable = (): void => {
        this.cleanUp();
        removeCssClass(CLASS_NAME);
        removeCssClass(`${CLASS_NAME}--flipped`);
    };

    /**
     * Handles the UI changes based on the window size. If the window is in portrait mode,
     * the colors of the buttons are inverted.
     *
     * @returns The status of the function.
     */
    private handleUiChanges = (isWindowResized = false): boolean => {
        const shouldUiBeUpdated = this.shouldUiBeUpdated();

        if (!isWindowResized && shouldUiBeUpdated) {
            for (let i = 1; i < 5; i++) {
                setTimeout(() => this.invertButtonColors(), i * 100 * i);
            }
        }

        if (shouldUiBeUpdated) {
            this.invertButtonColors();
            return addCssClassToBody(`${CLASS_NAME}--flipped`);
        }

        this.revertColorChanges();
        removeCssClass(`${CLASS_NAME}--flipped`);
        return true;
    };

    private invertButtonColors = (): void => {
        if (!this.shouldUiBeUpdated()) {
            return;
        }

        const actionButtonLabels = this.getButtonLabels();
        const buttons = this.getButtons();
        const feedbackShapes = this.getFeedbackShapes();

        actionButtonLabels.forEach(label =>
            label.classList.add('yt-spec-button-shape-with-label--is-overlay')
        );
        buttons.forEach(button => button.classList.add('yt-spec-button-shape-next--overlay-dark'));
        feedbackShapes.forEach(shape =>
            shape.classList.add('yt-spec-touch-feedback-shape--overlay-touch-response-inverse')
        );
    };

    private revertColorChanges = (): void => {
        const actionButtonLabels = this.getButtonLabels();
        const buttons = this.getButtons();
        const feedbackShapes = this.getFeedbackShapes();

        actionButtonLabels.forEach(label =>
            label.classList.remove('yt-spec-button-shape-with-label--is-overlay')
        );
        buttons.forEach(button =>
            button.classList.remove('yt-spec-button-shape-next--overlay-dark')
        );
        feedbackShapes.forEach(shape =>
            shape.classList.remove('yt-spec-touch-feedback-shape--overlay-touch-response-inverse')
        );
    };

    private getButtonLabels = (): NodeListOf<Element> => {
        return document.querySelectorAll(
            '.ytd-shorts .action-container .button-container:not(#pivot-button) label'
        );
    };

    private getButtons = (): NodeListOf<Element> => {
        return document.querySelectorAll(
            '.ytd-shorts .action-container .button-container:not(#pivot-button) button'
        );
    };

    private getFeedbackShapes = (): NodeListOf<Element> => {
        return document.querySelectorAll(
            // eslint-disable-next-line max-len
            '.ytd-shorts .action-container .button-container:not(#pivot-button) .yt-spec-touch-feedback-shape'
        );
    };

    private shouldUiBeUpdated = (): boolean => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // 0.875 = 7:8 aspect ratio
        return width / height < 0.875;
    };
}
