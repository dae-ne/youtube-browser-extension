import { type Result } from 'result';

export type ActionsSetup = {
    setUpAction: string;
    cleanUpAction?: string;
    disableAction?: string;
};

/**
 * The base class for all features.
 *
 * @remarks
 * Features are the building blocks of the extension. They implement functionalities that the
 * extension provides, and can be enabled or disabled by the user. Each feature should extend this
 * class and implement the setUp, cleanUp, and disable methods which are further used by the
 * action handler.
 */
export default abstract class Feature {
    /**
     * The function that implements the feature, and returns the result of the setup.
     *
     * @remarks
     * The result of the setup is an object with a status and parameters. It's designed to be used
     * with the handleRetries function, which will retry the setup if it fails.
     *
     * @returns The result of the setup.
     */
    public abstract setUp: () => Result;

    /**
     * The function that cleans up the feature.
     *
     * @remarks
     * This function should clean up any resources used by the feature, e.g. event listeners or
     * mutation observers after opening a new page.
     */
    public abstract cleanUp: () => void;

    /**
     * The function that disables the feature.
     *
     * @remarks
     * This function should disable the feature, e.g. by removing the feature's UI elements or
     * disabling the feature's functionality. Should be called when the feature is disabled using
     * the extension's options page.
     */
    public abstract disable: () => void;

    protected constructor(private actions: ActionsSetup) {}

    public get setUpActionName(): string {
        const { setUpAction } = this.actions;
        return setUpAction;
    }

    public get cleanUpActionName(): string | undefined {
        const { cleanUpAction } = this.actions;
        return cleanUpAction;
    }

    public get disableActionName(): string | undefined {
        const { disableAction } = this.actions;
        return disableAction;
    }
}
