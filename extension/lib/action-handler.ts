import Feature from '../feature';
import { handleRetries } from './retries';

type FeatureActions = {
  feature: Feature,
  setUpAction: string,
  cleanUpAction: string | null,
  disableAction: string | null
};

type ActionTypes = 'setUp' | 'cleanUp' | 'disable';

export default class ActionHandler {
  private featureActions: FeatureActions[] = [];

  public registerFeatureActions = (
    feature: any,
    setUpAction: string,
    cleanUpAction: string | null = null,
    disableAction: string | null = null
  ) => {
    this.featureActions.push({ feature, setUpAction, cleanUpAction, disableAction })
  }

  public handleAction = (action: string) => {
    if (!action) {
      return;
    }

    let type: ActionTypes | undefined;

    const featureActions = this.featureActions.find(({
      setUpAction,
      cleanUpAction,
      disableAction
    }) => {
      if (action === setUpAction) {
        type = 'setUp';
        return true;
      }

      if (action === cleanUpAction) {
        type = 'cleanUp';
        return true;
      }

      if (action === disableAction) {
        type = 'disable';
        return true;
      }

      return false;
    });

    if (!featureActions || !type) {
      return;
    }

    const { setUp, cleanUp, disable } = featureActions.feature;

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
