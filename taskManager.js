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
  // reset flag for the next 15s window
  userActive = false;
}, 20000);

refreshBtn.addEventListener('click',()=>{
  getTasks()
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.allDataTasks) {
    defText.innerText = defTextValue;
    refreshBtn.classList.remove("active");
  }
});