// main.js
import { handleMessage } from "./modules/background/message.js";
import { gettingTasks } from "./modules/background/tasks.js";

chrome.tabs.query({}, function(tabs) {
const tabsInfo = tabs.map(tab => ({ url: tab.url, title: tab.title,id:tab.id }));
//sendResponse({ tabs: tabsInfo });
console.log(tabsInfo);
});

chrome.runtime.onStartup.addListener(() =>{
  console.log('Start Extension')
});

setInterval(() => {
    gettingTasks('notification');
}, 15000);

chrome.runtime.onMessage.addListener(handleMessage);