import {
  authenticationForm,
  email,
  submit,
  teamOptions,
  goSettings,
  keyInput
}from './domElements.js';

import {
  handleInputChange,
  handleFormSubmit,
  handleKeyInputChange,
} from './authFunctions.js';

import {
  handleMessage
} from './handleMessage.js';

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
//btnResetAuthAll.addEventListener('click', handleResetAuthData);
goSettings.addEventListener('click', goToSettings);

keyInput.addEventListener("change", handleKeyInputChange);