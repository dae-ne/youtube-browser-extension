import { isVideoOpened } from '../lib/utils';

/**
 * This mutation observer is used to watch for changes in the advertisements
 * container and skip the ads when they appear.
 *
 * @type {MutationObserver}
 */
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.target.childNodes.length > 0) {
      skipAdvertisement();
    }
  });
});

/**
 * Automatically skips ads on the current video. Uses a mutation observer to
 * watch for changes in the advertisements container.
 *
 * @returns {Object} The status of the function and the parameters.
 */
export function autoSkipAdvertisements() {
  if (!isVideoOpened()) {
    return { status: 'success', params: {} };
  }

  const adsInfoContainer = document.querySelector('.video-ads');

  if (!adsInfoContainer) {
    return { status: 'fail', params: {} };
  }

  const isAdPlaying = adsInfoContainer.childNodes.length > 0;

  if (isAdPlaying) {
    skipAdvertisement();
  }

  cleanUp();
  observer.observe(adsInfoContainer, { childList: true });
  return { status: 'success', params: {} };
}

/**
 * Disconnects the mutation observer used to watch for advertisements. Does not
 * disconnect the observer if a video is currently opened.
 */
export function cleanUp() {
  if (isVideoOpened()) {
    return;
  }

  observer.disconnect();
}

/**
 * Skips an advertisement on the current video. It's not an AdBlocker, it just
 * automates the process of clicking the skip button.
 */
function skipAdvertisement() {
  const skipButton: HTMLButtonElement | null = document.querySelector('button[class*="-skip-"]');

  if (!skipButton) {
    return;
  }

  skipButton.click();
};
