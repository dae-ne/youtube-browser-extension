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
  Object.assign(options, data);

  for (const [name, value] of Object.entries(options)) {
    const input = form.querySelector(`[name="${name}"]`);

    if (input) {
      input.checked = value;
    }
  }
});

form.addEventListener('change', (event) => {
  const { target } = event;
  const { name, type, checked } = target;

  if (type !== 'checkbox') {
    return;
  }

  options[name] = checked;
  chrome.storage.sync.set(options);
});
