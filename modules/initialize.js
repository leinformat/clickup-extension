// initialize.js
import { handleKeyInputChange } from './authFunctions.js';
import { handleTasks } from './taskFunctions.js';
import {keyInput} from './domElements.js';

// Initialization
export function initializeAuthentication() {
  keyInput.addEventListener("change", handleKeyInputChange);
}

export function initializeTasks() {
  chrome.runtime.sendMessage({ listTasks: true });
}