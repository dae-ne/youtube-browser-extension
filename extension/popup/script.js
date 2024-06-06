const optionsButton = document.querySelector('#options-button');

optionsButton.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});
