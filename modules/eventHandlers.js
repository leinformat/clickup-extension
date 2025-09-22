import {
  authenticationForm,
  email,
  submit,
  teamOptions,
  goSettings,
  keyInput,
  toQaButton,
  hublFixerBtn,
  goThemeUploader,
  goTaskManager
}from './domElements.js';

import {
  handleInputChange, 
  handleFormSubmit,
  handleKeyInputChange,
} from './authFunctions.js';

import { handleMessage} from './handleMessage.js';

import { goToSettings } from './settings/settingsFunctions.js';
import { goToPage } from './utilities/goToPage.js';
import { hublFixer } from './utilities/hublFixer.js';

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

keyInput.addEventListener("change", handleKeyInputChange);

toQaButton.forEach( button => {
  button.addEventListener("click", () => {
    document.querySelector(".clickup-extension__spaces > button.active").classList.remove('active');

    button.classList.add('active');
    document.querySelector(".clickup-extension__content:not(.hide)").classList.add("hide");
    document.querySelector(`.clickup-extension__content.${button.dataset.type}`).classList.remove("hide");
  });
});

// ############# Event listeners to External Pages ################
goSettings.addEventListener('click', goToSettings);

// HUBL FIXER
!!hublFixerBtn && hublFixerBtn.addEventListener("click",()=>{
  hublFixer();
});

// Theme Uploader
!!goThemeUploader && goThemeUploader.addEventListener('click', ()=>{
  goToPage({ path: "windows/themeUploader.html" });
});

// Task Manager
!!goTaskManager && goTaskManager.addEventListener('click', ()=>{
  goToPage({ path: "windows/taskManager.html" });
});