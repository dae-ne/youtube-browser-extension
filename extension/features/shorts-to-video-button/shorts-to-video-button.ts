import { Actions } from 'actions';
import Feature from 'feature';
import { isShortsPage } from 'lib/utils';
import { type Result, results } from 'result';
import { SvelteComponent } from 'svelte';

import ShortsToVideoButton from './shorts-to-video-button.svelte';

/**
 * A feature that displays a button to open a shorts video on the watch page.
 *
 * @remarks
 * This feature displays a new button on the action bar next to the shorts player. When clicked, it
 * opens the video (watch) page in a new tab. A mutation observer is used to watch for changes in
 * default buttons on the page and update CSS classes accordingly.
 *
 * Actions:
 * - {@link Actions.SHORTS_TO_VIDEO_BUTTON}
 * - {@link Actions.SHORTS_TO_VIDEO_BUTTON_CLEANUP}
 * - {@link Actions.SHORTS_TO_VIDEO_BUTTON_DISABLE}
 *
 * @privateRemarks
 * The button is created by using a Svelte component from the `ui` directory. Also a mutation
 * observer is used to watch for changes in the default YouTube action buttons and update styles
 * in the new button.
 */
export default class ShortsToVideoButtonFeature extends Feature {
    private button?: SvelteComponent | null;

    private observer = new MutationObserver((mutations, observer) => {
        if (!isShortsPage() || !this.button) {
            observer.disconnect();
            return;
        }

        for (const mutation of mutations) {
            if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') {
                continue;
            }

            const templateButton = mutation.target as HTMLButtonElement;
            this.button.$set({ overlayDark: this.isSecondaryButton(templateButton) });
        }
    });

    public constructor() {
        super({
            setUpAction: Actions.SHORTS_TO_VIDEO_BUTTON,
            cleanUpAction: Actions.SHORTS_TO_VIDEO_BUTTON_CLEANUP,
            disableAction: Actions.SHORTS_TO_VIDEO_BUTTON_DISABLE
        });
    }

    public setUp = (): Result => {
        const { success, fail } = results;

        if (!isShortsPage()) {
            return success();
        }

        const actions = document.querySelector('ytd-shorts [is-active] #actions');

        if (!actions) {
            return fail();
        }

        const menuButton = actions.querySelector('#menu-button');
        const templateButtonInner = menuButton?.previousElementSibling?.querySelector('button');

        if (!menuButton || !templateButtonInner) {
            return fail();
        }

        this.cleanUp();

        this.button = new ShortsToVideoButton({
            target: actions,
            anchor: menuButton,
            props: {
                overlayDark: this.isSecondaryButton(templateButtonInner),
                onClick: this.handleButtonClick
            }
        });

        this.observer.observe(templateButtonInner, {
            attributes: true,
            attributeFilter: ['class']
        });
        return success();
    };

    public cleanUp = (): void => {
        this.observer.disconnect();
        this.button?.$destroy();
    };

    public disable = (): void => {
        this.cleanUp();
    };

    private handleButtonClick = (): void => {
        const currentUrl = window.location.href;

        if (!currentUrl.includes('youtube.com/shorts')) {
            return;
        }

        const videoUrl = currentUrl.replace('youtube.com/shorts', 'youtube.com/video');
        const video = document.querySelector(
            'ytd-shorts [is-active] video'
        ) as HTMLVideoElement | null;

        if (video) {
            video.pause();
        }

        chrome.runtime.sendMessage({
            action: Actions.OPEN_VIDEO_FROM_SHORTS,
            url: videoUrl
        });
    };

    private isSecondaryButton = (button: HTMLButtonElement): boolean => {
        return Array.from(button.classList).some(className => className.includes('--overlay-dark'));
    };
}
