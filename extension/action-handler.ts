import Feature from 'feature';
import { handleRetries } from 'lib/retries';

/**
 * The types of actions that can be handled.
 */
type ActionTypes = 'setup' | 'cleanup' | 'disable';

/**
 * A class that handles actions for features.
 */
export default class ActionHandler {
  /**
   * The features to handle actions for.
   */
  private features: Feature[] = [];

  /**
   * The URL of the last page that was visited.
   */
  private lastUrl = window.location.href;

  /**
   * The actions that have been handled for the current page.
   */
  private handledActions = new Set<string>();

  /**
   * Initializes the action handler with the specified features.
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
   */
  public handleAction = (action: string, force: boolean) => {
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
      setup: () => handleRetries(setUp),
      cleanup: cleanUp,
      disable: disable
    })[type]();
  };
}
