import Feature from './feature';
import { handleRetries } from './lib/retries';

type ActionTypes = 'setup' | 'cleanup' | 'disable';

export default class ActionHandler {
  private features: Feature[] = [];

  public constructor(...features: Feature[]) {
    this.features.push(...features);
  }

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
