const options = {};
const form = document.querySelector('form');
const template = document.querySelector('template');

const optionsData = [
  {
    name: 'autoSkipAds',
    title: 'Automatically skip ads',
  },
  {
    name: 'showShortsToVideoButton',
    title: 'Show shorts to video button',
  },
  {
    name: 'loopShortsToVideo',
    title: 'Auto loop video opened from shorts',
  },
  {
    name: 'updateShortsUI',
    title: 'Update shorts UI for vertical screens',
  },
  {
    name: 'removeAds',
    title: 'Remove non layout breaking ads',
  }
];

optionsData.forEach(({ name, title }) => {
  const clone = template.content.cloneNode(true);
  const titleElement = clone.querySelector('#option-title');
  const inputElement = clone.querySelector('input[type="checkbox"]');

  titleElement.textContent = title;
  inputElement.name = name;

  form.appendChild(clone);
});

chrome.storage.sync.get().then((data) => {
  const initialOptions = {
    autoSkipAds: true,
    showShortsToVideoButton: true,
    loopShortsToVideo: false,
    updateShortsUI: true,
    removeAds: true,
  };

  const dataExists = data && Object.keys(data).length;
  const currentOptions = dataExists ? data : initialOptions;

  Object.assign(options, currentOptions);

  for (const [name, value] of Object.entries(options)) {
    const input = form.querySelector(`[name="${name}"]`);

    if (input) {
      input.checked = value;
    }
  }
});

form.addEventListener('change', (event) => {
  const { target } = event;

  if (target.type !== 'checkbox') {
    return;
  }

  options[target.name] = target.checked;
  chrome.storage.sync.set(options);
});
