(() => {
  'use strict';

  /**
   * The interval in milliseconds for recurring tasks.
   *
   * @constant
   * @type {number}
   * @default
   */
  const INTERVAL_MS = 200;

  /**
   * The observer that watches for ads to skip them.
   *
   * @type {MutationObserver}
   */
  let adsObserver;

  /**
   * The action handlers for messages from the background script.
   *
   * @type {Object<string, Function>}
   */
  const actionHandlers = {
    'auto-skip-ads': autoSkipAds,
    'disconnect-ads-observer': disconnectAdsObserver
  };

  /**
   * Checks if the current page is a video page. Checks the URL but also
   * if the miniplayer is opened.
   *
   * @returns {boolean} Whether the current page is a video page.
   */
  function isVideoOpened() {
    const isWatchPage = window.location.href.includes('youtube.com/watch');
    const miniplayer = document.querySelector('.miniplayer');
    const isMiniplayerOpened = miniplayer?.querySelector('video');
    return isWatchPage || isMiniplayerOpened;
  }

  /**
   * Automatically skips ads on the current video. Sets up an observer to
   * watch for new ads and skip them as soon as they appear. It uses one of
   * the following methods to skip the ad:
   * - Clicks the skip button if it exists (even if it's not visible)
   * - Sets the video's current time to the maximum value if the skip button
   *   doesn't exist.
   */
  function autoSkipAds() {
    if (!isVideoOpened()) {
      return;
    }

    const adsInfoContainer = document.querySelector('.video-ads');

    if (!adsInfoContainer) {
      setTimeout(autoSkipAds, INTERVAL_MS);
      return;
    }

    const isAdPlaying = adsInfoContainer.childNodes.length > 0;

    const skipAd = () => {
      const skipButton = document.querySelector('button[class*="-skip-"]');

      if (skipButton) {
        // Method 1: Click the skip button
        skipButton.click();
        return;
      }

      // Method 2: Set the video's current time to the maximum value
      document.querySelector('video').currentTime = Number.MAX_VALUE;
    };

    if (isAdPlaying) {
      skipAd();
    }

    adsObserver?.disconnect();

    adsObserver = adsObserver ?? new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.childNodes.length > 0) {
          skipAd();
        }
      });
    });

    adsObserver.observe(adsInfoContainer, { childList: true });
  }

  /**
   * Disconnects the ads observer e.g. when the video is closed.
   */
  function disconnectAdsObserver() {
    if (isVideoOpened()) {
      return;
    }

    adsObserver?.disconnect();
  }

  /**
   * Listens for messages from the background script and calls the appropriate
   * action handler.
   */
  chrome.runtime.onMessage.addListener(({ action }) => actionHandlers[action]?.());
})();
