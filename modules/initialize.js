// initialize.js
import { handleKeyInputChange } from './functions.js';
import {keyInput} from './domElements.js';

// Initialization
export function initializeAuthentication() {
  keyInput.addEventListener("change", handleKeyInputChange);
}