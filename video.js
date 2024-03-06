(() => {
  let observer = null;

  function handleAction(request, sender, sendResponse) {
    switch (request.action) {
      case 'auto-skip-ads':
        observer?.disconnect();
        autoSkipAds();
        sendResponse({ status: 'success' });
        break;
      case 'disconnect-ads-observer':
        observer?.disconnect();
        sendResponse({ status: 'success' });
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

  chrome.runtime.onMessage.addListener(handleAction);
  chrome.runtime.sendMessage({ action: 'video-content-script-loaded' });
})();
