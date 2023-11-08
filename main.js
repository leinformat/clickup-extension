// main.js
import {authContainer,dataContent} from './modules/domElements.js';
import './modules/eventHandlers.js';
import { initializeAuthentication,initializeTasks } from './modules/initialize.js';
import { gettingTasksToQa } from './modules/background/tasksFromTeam.js';

// VALIDATE IF IS ALREADY AUTHENTICATED
chrome.storage.local.get(["teamId", "userEmail", "apiKey", "userId"], function (result) {
  if (!Object.keys(result).length) {
    authContainer.classList.add('active');
    initializeAuthentication();
  } else {
    dataContent.classList.remove('hide');
    initializeTasks();
  }
});