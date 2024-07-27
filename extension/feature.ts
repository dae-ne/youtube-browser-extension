import { Result } from './result';

/**
 * The setup for the actions of the feature.
 *
 * @remarks
 * This type defines the actions that are used to set up, clean up, and disable the feature.
 * Each action is a string that represents the name of the action. The cleanUpAction and
 * disableAction can be null if the feature doesn't require a clean up or disable action.
 */
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
   * Initializes the feature with action names.
   *
   * @param actions - The action names to set up, clean up, and disable the feature.
   */
  protected constructor(private actions: ActionsSetup) {}

  /**
   * Returns the name of the action to set up the feature.
   *
   * @returns The name of the action to set up the feature.
   */
  public get setUpActionName() {
    const { setUpAction } = this.actions;
    return setUpAction;
  }

  /**
   * Returns the name of the action to clean up the feature.
   *
   * @returns The name of the action to clean up the feature.
   */
  public get cleanUpActionName() {
    const { cleanUpAction } = this.actions;
    return cleanUpAction;
  }

  /**
   * Returns the name of the action to disable the feature.
   *
   * @returns The name of the action to disable the feature.
   */
  public get disableActionName() {
    const { disableAction } = this.actions;
    return disableAction;
  }

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
   * disabling the feature's functionality. Should be called when the feature is disabled using the
   * extension's options page.
   */
  public abstract disable: () => void;
}
