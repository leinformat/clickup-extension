import { handlerTaskTab } from "./tasksTab.js";
import { orderTasks } from "../typeMessages.js";

// Function to counter tasks
export const handlerCounterTask = (taskData,node,tasksAll,activeTab) =>{
  node.innerHTML = '';
  for (const task in taskData) {
    node.innerHTML += `<div class="clickup-extension__count-task to-qa ${task === 'all-tasks' ? 'active--tab': null}" data-status="${task ? task : 'all-tasks' }" style="order:${orderTasks[task]}">
                          <span class="clickup-extension__label">${task.replace(/-/g, " ")}: </span>
                          <span class="clickup-extension__count">${taskData[task]}</span>
                        </div>`;
  }
  const allTasksStatus = node.querySelectorAll('.clickup-extension__count-task');
  const allTasks = document.querySelectorAll(`${tasksAll}`);

  allTasksStatus.forEach( status => {
    status.addEventListener("click",(event)=>{
      handlerTaskTab(status,activeTab,allTasks); 
    });
  })
}