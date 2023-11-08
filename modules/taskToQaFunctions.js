import { task,tasksToQaContainer,countTasksToQaContainer,toQaSpinner } from "./domElements.js";
import { orderTasks,tasksCounterToQa } from "./typeMessages.js";
// Utilities
import { copyComment } from "./utilities/copyComment.js";
import { dateFormat } from "./utilities/dateFormat.js";
import { convertToTimeFormat } from "./utilities/timeFormat.js";
import { formatText } from "./utilities/formatText.js";
import { getCustomField } from "./utilities/customField.js";
import { openTask } from "./utilities/openTask.js";
import { handlerCounterTask } from "./utilities/counterTasks.js";


// this Redndered each Task whit its content
function taskTemplate(data, clonedCard,fieldData){
    // Add Listener to All Tasks
    const openTaskBtn = clonedCard.querySelector(".clickup-extension__open-task");

    openTaskBtn.addEventListener("click",(event)=>{
      openTask(event.target);
    });
    
    // Add Listener to Copy Qa Comment
    const copyTextBtn = clonedCard.querySelectorAll(".clickup-extension--copy-comment");
    copyComment(copyTextBtn,data,fieldData);

    // Task Status
    const taskStatus = data.status.status.toLowerCase().replace(/ /g, "-");

    // Card Container
    clonedCard.style.border = `solid 2px ${data.status.color}`;
    clonedCard.classList.add('clickup-extension--status-'+taskStatus);

    // Ordering Tasks
    clonedCard.style.order = orderTasks[taskStatus];

    // Incrent Counter Tasks
    tasksCounterToQa['all-tasks']++;
    tasksCounterToQa[taskStatus] ? tasksCounterToQa[taskStatus]++ : tasksCounterToQa[taskStatus] = 1;

    // PM Info
    const assignedByImg = clonedCard.querySelector(".clickup-extension__img-asignBy");
    assignedByImg.src = data.creator.profilePicture ? data.creator.profilePicture : "./images/avatar.png" ;
    assignedByImg.alt = data.creator.username;
    clonedCard.querySelector(".clickup-extension__asignBy").textContent = data.creator.username;

    // Task Info
    const taskName = clonedCard.querySelector(".clickup-extension__task-name");
    taskName.href = data.url;
    taskName.textContent = data.name.slice(0, 55) + " ..."; 
    taskName.title = "Go to Task";
    taskName.target = '_blank';

    const fullTaskName = clonedCard.querySelector(".clickup-extension__full-task-name");
    fullTaskName.textContent = data.name;

    // Assignees
    clonedCard.querySelector(".clickup-extension__qa-name").textContent = data.assignees[0].username;
    clonedCard.querySelector(".clickup-extension__qa-container .clickup-extension__label").textContent = 'Implementor: ';
    
    // Poinst
    clonedCard.querySelector(".clickup-extension__points").textContent = data.points ? data.points : 'Unassigned';
    
    // Tasks Status
    clonedCard.querySelector(".clickup-extension__task-status").textContent = data.status.status;

    // Client Name
    clonedCard.querySelector(".clickup-extension__client-name").textContent = `${data.project.name} | ${data.list.name}`;
    
    // Created Date
    clonedCard.querySelector(".clickup-extension__created-date").textContent =  dateFormat(data.date_created,'large');

    // Status Color
    clonedCard.querySelector(".clickup-extension--status").style.color = data.status.color;

    // Due Date
    clonedCard.querySelector(".clickup-extension__due-date").textContent = dateFormat(data.due_date,'month-day'); ;

    // Tracked Time
    clonedCard.querySelector(".clickup-extension__tracked").textContent = convertToTimeFormat(data.time_spent,'h');
    // Estimated Time
    clonedCard.querySelector(".clickup-extension__estimated").textContent = convertToTimeFormat(data.time_estimate,'h') ;

    // Task Description
    clonedCard.querySelector(".clickup-extension__task-descripion").innerHTML = formatText(data.description) ;
}

// This is a Main Funtion Function to handle Tasks
export function handlerTasksToQa(tasks){
  toQaSpinner.classList.add('hide');
  if (!!tasks.length){
    tasksToQaContainer.innerHTML = "";
    document.querySelector('.clickup-extension__counter-tasks.to-qa').classList.add('ready');
    tasks.forEach((data) => {
      //console.log(data);
      const clonedCard = task.cloneNode(true);

      // Get QA DATA ...
      const customField = getCustomField(data.custom_fields,'qa');

      /* TASK RENDER */
      taskTemplate(data, clonedCard,customField);
      tasksToQaContainer.appendChild(clonedCard);
    });
    // Counter All Tasks
    const allTasks = '.clickup-extension__tasks-toQa-container .clickup-extension__task'
    const activeTab = '.clickup-extension__counter-tasks.to-qa .clickup-extension__count-task.active--tab';
    handlerCounterTask(tasksCounterToQa,countTasksToQaContainer,allTasks,activeTab);
    
  }else{
    tasksToQaContainer.innerHTML="<h2 style='text-align:center'>You don't have any tasks assigned</h2>";
  }
}