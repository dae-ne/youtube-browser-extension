import { initialOptions } from '../options';
import * as optionsData from './data.json';

/**
 * The options object that stores the user's preferences.
 *
 * @remarks
 * The initial options are overridden by the options stored in the storage.
 */
const options = initialOptions;

/**
 * The form element that contains checkboxes for the options.
 */
const form = document.querySelector('form');

/**
 * The HTML template element for the option items.
 */
const template = document.querySelector('template');

if (!form || !template) {
  throw new Error('The form or the template element is missing.');
}

/**
 * Creates the option items using the template and the options data, and adds them to the form.
 */
optionsData.data.forEach(({ name, title, description }) => {
  const clone = template.content.cloneNode(true) as HTMLElement;
  const titleElement = clone.querySelector('#option-title');
  const inputElement = clone.querySelector('input[type="checkbox"]') as HTMLInputElement;
  const descriptionElement = clone.querySelector('#option-description');

  if (!titleElement || !inputElement || !descriptionElement) {
    throw new Error('The title, input, or description element is missing.');
  }

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
chrome.storage.sync.get().then(data => {
  Object.assign(options, data);

  for (const [name, value] of Object.entries(options)) {
    const input = form.querySelector(`[name="${name}"]`) as HTMLInputElement;

    if (input) {
      input.checked = value;
    }
  }
});

/**
 * Updates the options object on checkbox value change and saves the new value
 * to the storage.
 */
form.addEventListener('change', event => {
  const { target } = event;

  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  const { name, type, checked } = target;

  if (type !== 'checkbox') {
    return;
  }

  options[name] = checked;
  chrome.storage.sync.set(options);
});
