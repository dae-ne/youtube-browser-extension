(() => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action !== 'show-shorts-to-video-button') {
      return;
    }

    const interval = setInterval(() => {
      const renderer = document.querySelector('ytd-shorts [is-active]');
      const actions = renderer && renderer.querySelector('#actions');

      if (!actions) {
        return;
      }

      clearInterval(interval);

      let button = actions.querySelector('#yt-shorts-to-video-btn');

      if (button) {
        return;
      }

      const image = document.createElement('img');
      image.src = chrome.runtime.getURL('video-play.svg');
      image.style.width = '24px';
      image.style.filter = 'invert(1)';

      button = document.createElement('button');
      button.id = 'yt-shorts-to-video-btn';
      button.classList.add(
        'yt-spec-button-shape-next',
        'yt-spec-button-shape-next--tonal',
        'yt-spec-button-shape-next--mono',
        'yt-spec-button-shape-next--size-l',
        'yt-spec-button-shape-next--icon-button');
      button.style.marginTop = '16px';
      button.appendChild(image);
      actions.insertBefore(button, actions.querySelector('#menu-button'));

      button.addEventListener('click', () => {
        const currentUrl = window.location.href;

        if (!currentUrl.includes('youtube.com/shorts')) {
          return;
        }

        const videoUrl = currentUrl.replace('youtube.com/shorts', 'youtube.com/video');

        renderer.querySelector('video').pause();
        window.open(videoUrl, '_blank');
      });
    }, 100);
  });
})();
