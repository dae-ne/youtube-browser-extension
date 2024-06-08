'use strict';

/**
 * Button to open the options page.
 *
 * @type {HTMLButtonElement}
 */
const optionsButton = document.querySelector('#options-button');

/**
 * Opens the options page when the button is clicked.
 */
optionsButton.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});
