import {
    handleInvalidKey,
    handleValidKey,
    handleInvalidEmail,
    handleValidEmail,
} from './authFunctions.js';

import {handleTasks} from './taskFunctions.js';
import { handlerTasksToQa } from './taskToQaFunctions.js';

// Function to handle messages from the background
export function handleMessage(request, sender, sendResponse) {
    if (request.invalidKey) {
        handleInvalidKey(request.invalidKey);
    }
    if (request.validKey) {
        handleValidKey(request.validKey);
    }
    if (request.invalidEmail) {
        handleInvalidEmail(request.invalidEmail);
    }
    if (request.validEmail) {
        handleValidEmail();
    }
    // Task To IM
    if (request.allDataTasks) {
        handleTasks(request.allDataTasks);
    }
    // Task To QA
    if (request.allDataTasksToQa) {
        handlerTasksToQa(request.allDataTasksToQa);
    }
}