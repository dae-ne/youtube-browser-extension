import { initialOptions, type OptionsNames } from '../options';
import data from './data';

const options = initialOptions;
const container = document.querySelector('main');
const form = document.querySelector('form');
const template = document.querySelector('template');

if (!container || !form || !template) {
    throw new Error('The form or the template element is missing.');
}

if (data.length === 0) {
    container.setAttribute('data-empty', '');
    throw new Error('The data array is empty.');
}

// Populating the form with the options data
data.forEach(({ name, title, description }) => {
    const clone = template.content.cloneNode(true) as HTMLElement;
    const titleElement = clone.querySelector('#option-title');
    const inputElement = clone.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
    const descriptionElement = clone.querySelector('#option-description');

    if (!titleElement || !inputElement || !descriptionElement) {
        throw new Error('The title, input, or description element is missing.');
    }

    titleElement.textContent = title;
    inputElement.name = name;

    if (!description) {
        descriptionElement.remove();
        form.appendChild(clone);
        return;
    }

    descriptionElement.textContent = description;
    form.appendChild(clone);
});

// Loading the options from the storage
chrome.storage.sync.get().then(data => {
    Object.assign(options, data);

    for (const [name, value] of Object.entries(options)) {
        const input = form.querySelector(`[name="${name}"]`) as HTMLInputElement | null;

        if (input) {
            input.checked = value;
        }
    }
});

// Handling option changes
form.addEventListener('change', event => {
    const { target } = event;

    if (!(target instanceof HTMLInputElement)) {
        return;
    }

    const { name, type, checked } = target;

    if (type !== 'checkbox') {
        return;
    }

    options[name as OptionsNames] = checked;
    chrome.storage.sync.set(options);
});
