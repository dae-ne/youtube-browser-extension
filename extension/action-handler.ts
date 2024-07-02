import Feature from './feature';
import { handleRetries } from './lib/retries';

type ActionTypes = 'setUp' | 'cleanUp' | 'disable';

export default class ActionHandler {
  private features: Feature[] = [];

  public registerFeatures = (...features: Feature[]) => {
    this.features.push(...features);
  };

  public handleAction = (action: string) => {
    if (!action) {
      return;
    }

    let type: ActionTypes | undefined;

    const feature = this.features.find(
      ({ setUpActionName, cleanUpActionName, disableActionName }) => {
        switch (action) {
          case setUpActionName:
            type = 'setUp';
            return true;
          case cleanUpActionName:
            type = 'cleanUp';
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
      case 'setUp':
        handleRetries(setUp);
        break;
      case 'cleanUp':
        cleanUp();
        break;
      case 'disable':
        disable();
        break;
    }
  };
}
