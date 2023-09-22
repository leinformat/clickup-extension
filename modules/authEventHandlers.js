import {
  authenticationForm,
  email,
  submit,
  teamOptions,
  btnResetAuthAll,
  keyInput
}from './domElements.js';

import {
  handleInputChange,
  handleFormSubmit,
  handleMessage,
  handleResetAuthData,
  handleKeyInputChange,
} from './authFunctions.js';

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
btnResetAuthAll.addEventListener('click', handleResetAuthData);
keyInput.addEventListener("change", handleKeyInputChange);