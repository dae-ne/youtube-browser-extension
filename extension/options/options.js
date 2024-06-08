'use strict';

/**
 * The options object that stores the user's preferences.
 * @type {Object<string, boolean>}
 */
const options = {};

/**
 * The form element that contains checkboxes for the options.
 * @type {HTMLFormElement}
 */
const form = document.querySelector('form');

/**
 * The HTML template element for the option items.
 * @type {HTMLTemplateElement}
 */
const template = document.querySelector('template');

/**
 * The data for the options that will be displayed (name, title, description).
 * @type {Object[]}
 */
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

/**
 * Creates the option items using the template and the options data, and adds
 * them to the form.
 */
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

/**
 * Loads the options from the storage and updates the form.
 */
chrome.storage.sync.get().then((data) => {
  Object.assign(options, data);

  for (const [name, value] of Object.entries(options)) {
    const input = form.querySelector(`[name="${name}"]`);

    if (input) {
      input.checked = value;
    }
  }
});

/**
 * Updates the options object on checkbox value change and saves the new value
 * to the storage.
 */
form.addEventListener('change', (event) => {
  const { target } = event;
  const { name, type, checked } = target;

  if (type !== 'checkbox') {
    return;
  }

  options[name] = checked;
  chrome.storage.sync.set(options);
});
