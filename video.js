(() => {
  let observer = null;

  function handleAction(request, sender) {
    switch (request.action) {
      case 'auto-skip-ads':
        observer?.disconnect();
        autoSkipAds();
        break;
      case 'disconnect-ads-observer':
        observer?.disconnect();
        break;
      case 'loop-video':
        loopVideo();
        break;
    }
  }

  function autoSkipAds() {
    const video = document.querySelector('video');
    const adsInfoContainer = document.querySelector('.video-ads');

    if (!adsInfoContainer) {
      setTimeout(autoSkipAds, 100);
      return;
    }

    const isAdPlaying = adsInfoContainer.childNodes.length > 0;

    const skipAd = () => {
      const skipButton = document.querySelector('.ytp-ad-skip-button-modern');

      if (skipButton) {
        skipButton.click();
        return;
      }

      video.currentTime = video.duration;
    };

    if (isAdPlaying) {
      skipAd();
    }

    observer = observer ?? new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.childNodes.length > 0) {
          skipAd();
        }
      });
    });

    observer.observe(adsInfoContainer, { childList: true });
  }

  function loopVideo() {
    document.querySelector('video').loop = true;
  }

  chrome.runtime.onMessage.addListener(handleAction);
})();
