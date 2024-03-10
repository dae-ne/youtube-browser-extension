const optionsButton = document.querySelector('.options-btn');
const githubButton = document.querySelector('.github-btn');
const issuesButton = document.querySelector('.issues-btn');

optionsButton.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

githubButton.addEventListener('click', () => {
  const githubUrl = 'https://github.com/dae-ne/yt-extension';
  window.open(githubUrl, '_blank');
});

issuesButton.addEventListener('click', () => {
  const issuesUrl = 'https://github.com/dae-ne/yt-extension/issues';
  window.open(issuesUrl, '_blank');
});
