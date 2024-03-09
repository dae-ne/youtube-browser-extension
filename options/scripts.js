const options = {};
const optionsForm = document.querySelector('.options-form');

chrome.storage.sync.get().then((data) => {
  const initialOptions = {
    loopShortsToVideo: false,
    showShortsToVideoButton: true,
    updateShortsUI: true,
    autoSkipAds: true,
    removeAds: true,
  };

  const dataExists = data && Object.keys(data).length;
  const currentOptions = dataExists ? data : initialOptions;

  Object.assign(options, currentOptions);

  for (const [name, value] of Object.entries(options)) {
    const input = optionsForm.querySelector(`[name="${name}"]`);

    if (input) {
      input.checked = value;
    }
  }
});

optionsForm.addEventListener('change', (event) => {
  const { target } = event;

  if (target.type !== 'checkbox') {
    return;
  }

  options[target.name] = target.checked;
  chrome.storage.sync.set(options);
});
