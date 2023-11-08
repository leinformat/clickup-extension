// main.js
import { handleMessage } from "./modules/background/message.js";
import { gettingTasks } from "./modules/background/tasks.js";

chrome.runtime.onStartup.addListener(() =>{
  console.log('Start Extension')
});

setInterval(() => {
    gettingTasks('notification');
}, 15000);

chrome.runtime.onMessage.addListener(handleMessage);