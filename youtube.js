(() => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showButton') {
      const interval = setInterval(() => {
        const renderer = document.querySelector('ytd-shorts [is-active]');

        if (!renderer) {
          return;
        }

        const actions = renderer.querySelector('#actions');

        if (!actions) {
          return;
        }

        clearInterval(interval);

        const video = document.querySelector('video');
        let button = actions.querySelector('#yt-shorts-to-video-btn');

        if (button) {
          return;
        }

        button = document.createElement('button');
        button.id = 'yt-shorts-to-video-btn';
        button.textContent = 'vid';
        button.classList.add(
          'yt-spec-button-shape-next',
          'yt-spec-button-shape-next--tonal',
          'yt-spec-button-shape-next--mono',
          'yt-spec-button-shape-next--size-l',
          'yt-spec-button-shape-next--icon-button');
        actions.insertBefore(button, actions.firstChild);

        button.addEventListener('click', () => {
          const currentUrl = window.location.href;

          if (!currentUrl.includes('youtube.com/shorts')) {
            return;
          }

          const videoUrl = currentUrl.replace('youtube.com/shorts', 'youtube.com/video');

          video.pause();
          window.open(videoUrl, '_blank');
        });
      }, 100);
    }
  })
})();
