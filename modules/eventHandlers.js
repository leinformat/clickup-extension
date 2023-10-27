import {
  authenticationForm,
  email,
  submit,
  teamOptions,
  goSettings,
  keyInput,
  toQaButton
}from './domElements.js';

import {
  handleInputChange,
  handleFormSubmit,
  handleKeyInputChange,
} from './authFunctions.js';

import { handleMessage} from './handleMessage.js';

import { goToSettings } from './settings/settingsFunctions.js';

//########## Listener to All messages from Background.js #########
chrome.runtime.onMessage.addListener(handleMessage);

//############## Event listeners to Authentication ################
authenticationForm.addEventListener("submit", handleFormSubmit);
email.addEventListener("change", () => {
  handleInputChange(submit, 'submit', 'add');
});

teamOptions.addEventListener("click", (e) => {
  if (e.target.type === "radio") handleInputChange(email, 'email', 'add');
});

goSettings.addEventListener('click', goToSettings);

keyInput.addEventListener("change", handleKeyInputChange);

toQaButton.forEach( button => {
  button.addEventListener("click", () => {
    document.querySelector(".clickup-extension__spaces > button.active").classList.remove('active');

    button.classList.add('active');
    document.querySelector(".clickup-extension__content:not(.hide)").classList.add("hide");
    document.querySelector(`.clickup-extension__content.${button.dataset.type}`).classList.remove("hide");
  });
});

