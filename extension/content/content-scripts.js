(() => {
  'use strict';

  let adsObserver;

  const actionHandlers = {
    'auto-skip-ads': autoSkipAds,
    'disconnect-ads-observer': disconnectAdsObserver
  };

  function isVideoOpened() {
    const isWatchPage = window.location.href.includes('youtube.com/watch');
    const isMiniplayerOpened = !!document.querySelector('.miniplayer');
    return isWatchPage || isMiniplayerOpened;
  }

  function autoSkipAds() {
    if (!isVideoOpened()) {
      return;
    }

    const adsInfoContainer = document.querySelector('.video-ads');

    if (!adsInfoContainer) {
      setTimeout(autoSkipAds, 200);
      return;
    }

    const isAdPlaying = adsInfoContainer.childNodes.length > 0;

    const skipAd = () => {
      const skipButton = document.querySelector('button[class*="-skip-"]');

      if (skipButton) {
        skipButton.click();
        return;
      }

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

  function disconnectAdsObserver() {
    if (isVideoOpened()) {
      return;
    }

    adsObserver?.disconnect();
  }

  chrome.runtime.onMessage.addListener(({ action }) => actionHandlers[action]());
})();
