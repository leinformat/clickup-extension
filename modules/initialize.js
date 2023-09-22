// initialize.js
import { handleKeyInputChange } from './authFunctions.js';
import {keyInput} from './domElements.js';

// Initialization
export function initializeAuthentication() {
  keyInput.addEventListener("change", handleKeyInputChange);
}