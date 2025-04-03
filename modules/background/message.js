// message.js
import { handleDataKey, handleFormData, handleResetAuthAll } from "./auth.js";
import { pageReload } from "./developer.js";
import { gettingTasks } from "./tasks.js";
import { gettingTasksToQa, gettingTasksToPm } from "./tasksFromTeam.js";

// Function to handle incoming messages
export function handleMessage(request, sender, sendResponse) {
  if (request.dataKey) {
    handleDataKey(request.dataKey);
  }
  if (request.formData) {
    handleFormData(request.formData);
  }
  if (request.resetAuthDataAll) {
    handleResetAuthAll(sendResponse);
  }
  if(request.listTasks){
    gettingTasks();
    gettingTasksToQa();
    gettingTasksToPm();
  }
  if(request.pageToreload){
    pageReload(request.pageToreload);
  }
}