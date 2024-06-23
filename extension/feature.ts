import ActionHandler from './lib/action-handler';
import { FeatureResult } from './types';

/**
 * The base class for all features.
 *
 * @remarks
 * Features are the building blocks of the extension. They implement the functionality that the
 * extension provides, and can be enabled or disabled by the user. Each feature should extend this
 * class and implement the setUp, cleanUp, and disable methods which are further used by the
 * action handler.
 */
export default abstract class Feature {
  /**
   * Initializes the feature with action names.
   *
   * @param setUpAction - The action to set up the feature.
   * @param cleanUpAction - The action to clean up the feature.
   * @param disableAction - The action to disable the feature after switching it off in the options
   */
  protected constructor(
    private setUpAction: string,
    private cleanUpAction: string | null = null,
    private disableAction: string | null = null
  ) {}

  /**
   * Returns the name of the action to set up the feature.
   *
   * @returns The name of the action to set up the feature.
   */
  public get setUpActionName() {
    return this.setUpAction;
  }

  /**
   * Returns the name of the action to clean up the feature.
   *
   * @returns The name of the action to clean up the feature.
   */
  public get cleanUpActionName() {
    return this.cleanUpAction;
  }

  /**
   * Returns the name of the action to disable the feature.
   *
   * @returns The name of the action to disable the feature.
   */
  public get disableActionName() {
    return this.disableAction;
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
  public abstract setUp: () => FeatureResult;

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
