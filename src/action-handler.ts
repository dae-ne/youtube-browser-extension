import Feature from 'feature';
import { handleRetries } from 'lib/retries';

type ActionTypes = 'cleanup' | 'disable' | 'setup';

/**
 * A class for handing incoming actions from the background script.
 *
 * @remarks
 * The action handler is created in the content script and is responsible for handling actions
 * that are sent from the background script. The actions are used to trigger the setup, cleanup,
 * and disable methods.
 */
export default class ActionHandler {
    /**
     * Array of all registered features for the action handler.
     */
    private features: Feature[] = [];

    /**
     * The URL of the last page that was visited. The handler keeps track of the last URL to
     * determine if the page has changed. If it's handling the same action for the same page, it
     * won't trigger the action again.
     */
    private lastUrl = window.location.href;

    /**
     * The actions that have been handled for the current page. This is used to prevent duplicate
     * actions from being triggered.
     */
    private handledActions = new Set<string>();

    /**
     * Initializes the action handler with features.
     *
     * @param features - The features to handle actions for.
     */
    public constructor(...features: Feature[]) {
        this.features.push(...features);
        this.lastUrl = window.location.href;
    }

    /**
     * Handles the specified action for the features.
     *
     * @remarks
     * The action is handled by finding the feature with the corresponding action name and calling
     * the appropriate method. Already handled action names are stored in a set to prevent duplicate
     * actions from being triggered for the same page.
     *
     * @param action - The action to handle
     * @param force - Whether to force the action to be handled again even if it was already handled
     *                for the current page
     */
    public handleAction = (action: string, force: boolean): void => {
        if (!action) {
            return;
        }

        const url = window.location.href;
        const hasUrlChanged = this.lastUrl !== url;

        if (!hasUrlChanged && this.handledActions.has(action) && !force) {
            return;
        }

        if (hasUrlChanged) {
            this.lastUrl = url;
            this.handledActions.clear();
        }

        this.handledActions.add(action);
        let type: ActionTypes | undefined;

        const feature = this.features.find(
            ({ setUpActionName, cleanUpActionName, disableActionName }) => {
                switch (action) {
                    case setUpActionName:
                        type = 'setup';
                        return true;
                    case cleanUpActionName:
                        type = 'cleanup';
                        return true;
                    case disableActionName:
                        type = 'disable';
                        return true;
                    default:
                        return false;
                }
            }
        );

        if (!feature || !type) {
            return;
        }

        const { setUp, cleanUp, disable } = feature;

        ({
            setup: (): void => handleRetries(setUp),
            cleanup: cleanUp,
            disable: disable
        })[type]();
    };
}
