(() => {
  function autoSkipAds() {
    const video = document.querySelector('video');

    const skipAd = () => {
      console.log('Skip ad function called');

      const adsInfoContainer = document.querySelector('.video-ads');
      const isAdPlaying = adsInfoContainer.childNodes.length > 0;

      if (!isAdPlaying) {
        console.log('No ad playing');
        return;
      }

      const skipButton = document.querySelector('.ytp-ad-skip-button-modern');

      if (skipButton) {
        console.log('Skip button found - skipping');
        skipButton.click();
        return;
      }

      console.log('No skip button found - skipping to end of ad');
      video.currentTime = video.duration;
    }

    video.addEventListener('durationchange', () => {
      skipAd();
    });

    skipAd();
  };

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case 'skipAds':
        autoSkipAds();
        break;
      default:
        break;
    }
  });
})();
