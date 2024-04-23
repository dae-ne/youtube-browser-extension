(() => {
  let adsObserver = null;

  function handleAction(request, sender) {
    switch (request.action) {
      case 'auto-skip-ads':
        autoSkipAds();
        break;
      case 'disconnect-ads-observer':
        disconnectAdsObserver();
        break;
      case 'loop-video':
        loopVideo();
        break;
    }
  }

  function isVideo() {
    return window.location.href.includes('youtube.com/watch');
  }

  function autoSkipAds() {
    if (!isVideo()) {
      return;
    }

    adsObserver?.disconnect();

    const video = document.querySelector('video');
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

      video.currentTime = Number.MAX_VALUE;
    };

    if (isAdPlaying) {
      skipAd();
    }

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
    if (isVideo()) {
      return;
    }

    adsObserver?.disconnect();
  }

  function loopVideo() {
    if (!isVideo()) {
      return;
    }

    document.querySelector('video').loop = true;
  }

  chrome.runtime.onMessage.addListener(handleAction);
})();
