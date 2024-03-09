const optionsButton = document.querySelector('.options-btn');

optionsButton.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});
