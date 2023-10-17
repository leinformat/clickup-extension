// main.js
import { handleMessage } from "./modules/background/message.js";
import { gettingTasks } from "./modules/background/tasks.js";


setInterval(() => {
    gettingTasks('notification');
}, 20000);

// Add listener to handle messages
chrome.runtime.onMessage.addListener(handleMessage); 