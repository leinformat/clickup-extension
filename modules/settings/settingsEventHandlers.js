import { btnResetAuthAll }from './settingsDomElements.js';
  
import { handleResetAuthData } from '../authFunctions.js';

// Reset data
btnResetAuthAll.addEventListener('click', handleResetAuthData);