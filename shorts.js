(() => {
  function handleAction(request, sender, sendResponse) {
    switch (request.action) {
      case 'show-shorts-to-video-button':
        displayShortsToVideoButton();
        sendResponse({ status: 'success' });
        break;
    }
  }

  function displayShortsToVideoButton() {
    const renderer = document.querySelector('ytd-shorts [is-active]');
    const actions = renderer?.querySelector('#actions');

    if (!actions) {
      setTimeout(displayShortsToVideoButton, 100);
      return;
    }

    const handleButtonClick = () => {
      const currentUrl = window.location.href;

      if (!currentUrl.includes('youtube.com/shorts')) {
        return;
      }

      const videoUrl = currentUrl.replace('youtube.com/shorts', 'youtube.com/video');

      renderer.querySelector('video').pause();
      window.open(videoUrl, '_blank');
    };

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

    button.addEventListener('click', handleButtonClick);
  }

  chrome.runtime.onMessage.addListener(handleAction);
  chrome.runtime.sendMessage({ action: 'shorts-content-script-loaded' });
})();
