// main.js
import {authContainer,dataContent} from './modules/domElements.js';
import './modules/eventHandlers.js';
import { initializeAuthentication,initializeTasks } from './modules/initialize.js';
//import { gettingTasksToQa } from './modules/background/tasksFromTeam.js';
import { handlerTheme } from './modules/utilities/themeSetting.js';

// VALIDATE IF IS ALREADY AUTHENTICATED
chrome.storage.local.get(["teamId", "userEmail", "apiKey", "userId","darkMode"], function (result) {
  const { darkMode, teamId, userEmail, apiKey, userId } = result;
  !!darkMode &&  handlerTheme(!!darkMode);
  
  if (!teamId && !userEmail && !apiKey && !userId) {
    authContainer.classList.add('active');
    initializeAuthentication();
  } else {
    dataContent.classList.remove('hide');
    initializeTasks();
  }

});