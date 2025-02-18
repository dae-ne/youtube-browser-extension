import { Actions } from 'actions';
import Feature from 'feature';
import { type Result, results } from 'result';

import SmartTvButton from './smart-tv-button.svelte';

const BUTTON_ID = 'yte-smart-tv-button';
const SMART_TV_URL = 'https://www.youtube.com/tv';

export default class SmartTvFeature extends Feature {
    public constructor() {
        super({
            setUpAction: Actions.SMART_TV,
            cleanUpAction: Actions.SMART_TV_CLEANUP,
            disableAction: Actions.SMART_TV_DISABLE
        });
    }

    public setUp = (): Result => {
        const { success, fail } = results;
        const alreadyExist = !!document.querySelector(`#${BUTTON_ID}`);

        if (alreadyExist) {
            return success();
        }

        const target = document.querySelector('#items.ytd-guide-section-renderer');
        const anchor = document.querySelector(
            '#items > ytd-guide-collapsible-section-entry-renderer'
        );

        if (!target || !anchor) {
            return fail();
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-new
        new SmartTvButton({
            target,
            anchor,
            props: { onClick: this.handleButtonClick }
        });

        return success();
    };

    public cleanUp = (): void => {
        const button = document.querySelector(`#${BUTTON_ID}`);
        button?.remove();
    };

    public disable = (): void => {
        this.cleanUp();
    };

    private handleButtonClick = (): void => {
        window.open(SMART_TV_URL, '_blank')?.focus();
    };
}
