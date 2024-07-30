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
   * Initializes the action handler with the specified features.
   *
   * @param features - The features to handle actions for.
   */
  public constructor(...features: Feature[]) {
    this.features.push(...features);
  }

  /**
   * Handles the specified action for the features.
   *
   * @remarks
   * The action is handled by finding the feature that corresponds to the action and calling the
   * appropriate method on the feature. The action names are defined in the feature classes, in the
   * constructor (by calling the super constructor of the Feature base class).
   *
   * @param action - The action to handle
   */
  public handleAction = (action: string) => {
    if (!action) {
      return;
    }

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

    switch (type) {
      case 'setup':
        handleRetries(setUp);
        break;
      case 'cleanup':
        cleanUp();
        break;
      case 'disable':
        disable();
        break;
    }
  };
}
