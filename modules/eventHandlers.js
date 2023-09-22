import * as dom from './domElements.js';
import {
  handleInputChange,
  handleFormSubmit,
  handleMessage,
  handleResetAuthData,
  handleKeyInputChange,
} from './functions.js';

// Event listeners
chrome.runtime.onMessage.addListener(handleMessage);
dom.authenticationForm.addEventListener("submit", handleFormSubmit);
dom.email.addEventListener("change", () => {
  handleInputChange(dom.submit, 'submit', 'add');
});
dom.teamOptions.addEventListener("click", (e) => {
  if (e.target.type === "radio") handleInputChange(dom.email, 'email', 'add');
});

dom.btnResetAuthAll.addEventListener('click', handleResetAuthData);
dom.keyInput.addEventListener("change", handleKeyInputChange);