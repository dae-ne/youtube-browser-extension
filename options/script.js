const options = {};
const form = document.querySelector('form');
const template = document.querySelector('template');

const optionsData = [
  {
    name: 'autoSkipAds',
    title: 'Automatically skip ads',
    description: 'All ads will be skipped automatically without any user interaction.',
  },
  {
    name: 'showShortsToVideoButton',
    title: 'Show shorts to video button',
    description: 'This button will be shown on shorts pages. Clicking it will open the the shorts video in the main video player.',
  },
  {
    name: 'loopShortsToVideo',
    title: 'Auto loop video opened from shorts',
    description: 'The video opened from shorts will be looped automatically (just like shorts videos are).',
  },
  {
    name: 'updateShortsUI',
    title: 'Update shorts UI for vertical screens',
    description: 'Some UI elements will be updated to be more suitable for vertical screens.',
  },
  {
    name: 'removeAds',
    title: 'Remove non layout breaking ads',
    description: 'Some ads will be removed from the page to improve the user experience. It will not remove ads that will mess up the layout of the page (e.g. leaving a big empty space).',
  }
];

optionsData.forEach(({ name, title, description }) => {
  const clone = template.content.cloneNode(true);
  const titleElement = clone.querySelector('#option-title');
  const inputElement = clone.querySelector('input[type="checkbox"]');
  const descriptionElement = clone.querySelector('#option-description');

  titleElement.textContent = title;
  inputElement.name = name;

  if (!description) {
    descriptionElement.remove();
    form.appendChild(clone);
  }

  descriptionElement.textContent = description;
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
