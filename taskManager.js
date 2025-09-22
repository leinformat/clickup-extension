import { refreshBtn } from "./modules/taskManager/domElements.js";

const defText = refreshBtn.querySelector('.clickup-extension__task-manager-refresh-text');
const defTextValue = defText.innerText;
let userActive = false;

// Detect user interaction
["mousemove", "keydown", "click", "scroll"].forEach(evt => {
  window.addEventListener(evt, () => {
    userActive = true;
  });
});

// Function to run
function getTasks() {
  console.log("Running task:", new Date().toISOString());
  defText.innerText = "Refreshing...";
  refreshBtn.classList.add('active');
  chrome.runtime.sendMessage({ listTasks: true });
}

// Interval every 15s
setInterval(() => {
  if (!userActive) {
    getTasks();
  }
  // reset flag for the next 20s window
  userActive = false;
}, 20000);

refreshBtn.addEventListener('click',()=>{
  getTasks()
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.allDataTasks) {
    defText.innerText = defTextValue;
    refreshBtn.classList.remove("active");
    // Active Urls
    chrome.tabs.query({}, function (tabs) {
      console.log(tabs)
      tabs.forEach((tab) => {
        const tasks = document.querySelectorAll(`.tasks-implentor .clickup-extension__task[data-task-url="${tab.url}"]`);
        tasks.forEach((task) => {
          task.classList.add('clickup-extension__active-url');
          task.style.order = -1000;
        });
      });
    });
  }
  if (message.allDataTasksToQa) {
    // Active Urls
    chrome.tabs.query({}, function (tabs) {
      console.log(tabs)
      tabs.forEach((tab) => {
        const tasks = document.querySelectorAll(`.tasks-to-qa .clickup-extension__task[data-task-url="${tab.url}"]`);
        tasks.forEach((task) => {
          task.classList.add('clickup-extension__active-url');
          task.style.order = -1000;
        });
      });
    });
  }
});