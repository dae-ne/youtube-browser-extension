import Feature from '../feature';
import { handleRetries } from './retries';

type ActionTypes = 'setUp' | 'cleanUp' | 'disable';

export default class ActionHandler {
  private features: Feature[] = [];

  public registerFeatures = (...features: Feature[]) => {
    this.features.push(...features);
  }

  public handleAction = (action: string) => {
    if (!action) {
      return;
    }

    let type: ActionTypes | undefined;

    const feature = this.features.find(({
      setUpActionName,
      cleanUpActionName,
      disableActionName
    }) => {
      if (action === setUpActionName) {
        type = 'setUp';
        return true;
      }

      if (action === cleanUpActionName) {
        type = 'cleanUp';
        return true;
      }

      if (action === disableActionName) {
        type = 'disable';
        return true;
      }

      return false;
    });

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
  }
}
