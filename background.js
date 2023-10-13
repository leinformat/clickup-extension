// main.js
import { handleMessage } from "./modules/background/message.js";
import { handlerNotifications } from "./modules/background/notification.js";


handlerNotifications();
// Add listener to handle messages
chrome.runtime.onMessage.addListener(handleMessage);