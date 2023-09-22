// main.js
import {authContainer,dataContent} from './modules/domElements.js';
import './modules/eventHandlers.js';
import { initializeAuthentication } from './modules/initialize.js';

// VALIDATE IF IS ALREADY AUTHENTICATED
chrome.storage.local.get(["teamId", "userEmail", "ApiKey", "userId"], function (result) {
  if (!Object.keys(result).length) {
    authContainer.classList.add('active');
    initializeAuthentication();
  } else {
    dataContent.classList.remove('hide');
  }
});