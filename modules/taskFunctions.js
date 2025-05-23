import { tasksContainer, task,countTasksContainer,implementorSpinner,goSettings } from "./domElements.js";
import { orderTasks,tasksCounter,taskAlert } from "./typeMessages.js";
// Utilities
import { copyComment } from "./utilities/copyComment.js";
import { dateFormat } from "./utilities/dateFormat.js";
import { convertToTimeFormat } from "./utilities/timeFormat.js";
import { formatText } from "./utilities/formatText.js";
import { getCustomField } from "./utilities/customField.js";
import { openTask } from "./utilities/openTask.js";
import { getDataFromObject } from "./utilities/getData.js";
import { handlerCounterTask } from "./utilities/counterTasks.js";
import { taskAlerts } from "./utilities/taskAlerts.js";
import { detectCurrentUrl } from "./detectCurrentUrl.js";

// this Redndered each Task whit its content
function taskTemplate(data, clonedCard,fieldData,fieldPm) {
    // Alerts
    if (!!taskAlerts(data,fieldData).count) {
      const dataAlert = taskAlerts(data,fieldData); 
      let descripion = "";
      let index = 1;
      for (const key in dataAlert) {
        if(key !== 'count') descripion += `<p>${index++}. ${taskAlert[key]}</p><br>`;
      }
      const alertContainer = document.createElement("div");
      alertContainer.classList.add('task-alert--container');

      const alertDescription = document.createElement("div");
      alertDescription.classList.add('task-alert--description');
      alertDescription.innerHTML= descripion;

      const count = document.createElement("p");
      count.textContent = dataAlert.count;
    
      alertContainer.append(alertDescription,count); 
      
      clonedCard.prepend(alertContainer);
    } 
    
    // Add Listener to All Tasks
    const openTaskBtn = clonedCard.querySelector(".clickup-extension__open-task");
    // Open Task
    openTaskBtn.addEventListener("click",(event)=>{
      openTask(event.target);
    });

    // Add Listener to Copy Qa Comment
    const copyTextkBtn = clonedCard.querySelectorAll(".clickup-extension--copy-comment");
    // Add Listener to Copy Qa Comment
    const copyTextBtn = clonedCard.querySelectorAll(".clickup-extension--copy-comment");
    copyComment(copyTextBtn,data,fieldData,fieldPm);    

    // Task Status
    const taskStatus = data.status.status.toLowerCase().replace(/ /g, "-");

    // Card Container
    clonedCard.style.border = `solid 2px ${data.status.color}`;
    clonedCard.classList.add('clickup-extension--status-'+taskStatus);

    // Ordering Tasks
    clonedCard.style.order = orderTasks[taskStatus];

    // Incrent Counter Tasks
    tasksCounter['all-tasks']++;
    tasksCounter[taskStatus] ? tasksCounter[taskStatus]++ : tasksCounter[taskStatus] = 1;

    // URL
    clonedCard.dataset.taskUrl = data.url;

    // PM Info
    const assignedByImg = clonedCard.querySelector(".clickup-extension__img-asignBy");
    const pmImageUrl = fieldPm.length && !!fieldPm[0].profilePicture ? fieldPm[0].profilePicture : "./images/avatar.png";
    const pmName = fieldPm.length && !!fieldPm[0].username ? fieldPm[0].username : "Undefined";
    assignedByImg.src = pmImageUrl;
    assignedByImg.alt = pmName;
    clonedCard.querySelector(".clickup-extension__asignBy").textContent = pmName;

    // Task Info
    const taskName = clonedCard.querySelector(".clickup-extension__task-name");
    taskName.href = data.url;
    taskName.textContent = data.name.slice(0, 55) + " ..."; 
    taskName.title = "Go to Task";
    taskName.target = '_blank';

    // Task Full name
    const fullTaskName = clonedCard.querySelector(".clickup-extension__full-task-name");
    fullTaskName.textContent = data.name;

    // QA
    fieldData ? clonedCard.querySelector(".clickup-extension__qa-name").textContent = getDataFromObject(fieldData,'username') : 'Unassigned';
    
    // Poinst
    clonedCard.querySelector(".clickup-extension__points").textContent = data.points ? data.points : 'Unassigned';
    
    // Status
    clonedCard.querySelector(".clickup-extension__task-status").textContent = data.status.status;

    // Client Name
    clonedCard.querySelector(".clickup-extension__client-name").textContent = `${data.project.name} | ${data.list.name}`;

    // Created Date
    clonedCard.querySelector(".clickup-extension__created-date").textContent =  dateFormat(data.date_created,'large');

    // Card Border Color
    clonedCard.querySelector(".clickup-extension--status").style.color = data.status.color;

    // Due date
    clonedCard.querySelector(".clickup-extension__due-date").textContent = dateFormat(data.due_date,'month-day');

    // Time Tracked
    clonedCard.querySelector(".clickup-extension__tracked").textContent = convertToTimeFormat(data.time_spent,'h');
    
    // Stimated Time
    clonedCard.querySelector(".clickup-extension__estimated").textContent = convertToTimeFormat(data.time_estimate,'h') ;

    // Task description
    clonedCard.querySelector(".clickup-extension__task-descripion").innerHTML = formatText(data.description);
}

// This is a Main Funtion Function to handle Tasks
export function handleTasks(tasks) {
  implementorSpinner.classList.add('hide');
  goSettings.classList.add('active');
  if (!!tasks.length){
    document.querySelector('.clickup-extension__counter-tasks.to-implementor').classList.add('ready');
    tasksContainer.innerHTML = "";
    tasks.forEach((data) => {
      const clonedCard = task.cloneNode(true);
      // Get QA DATA ...
      const customField = getCustomField(data.custom_fields,'qa');
      // Get PM DATA ...
      const customFieldPm = getCustomField(data.custom_fields,'Project Manager');
      /* TASK RENDER */
      taskTemplate(data, clonedCard,customField,customFieldPm);
      tasksContainer.appendChild(clonedCard);
    });
    // Counter All Tasks 
    const allTasks = '.clickup-extension__tasks-container.to-implementor .clickup-extension__task';
    const activeTab = '.clickup-extension__counter-tasks.to-implementor .clickup-extension__count-task.active--tab';
    
    handlerCounterTask(tasksCounter,countTasksContainer,allTasks,activeTab);

    //Detect current url
    detectCurrentUrl({
      allTasks,
    });

  }else{
    tasksContainer.innerHTML="<h2 style='text-align:center'>You don't have any tasks assigned</h2>";
  }
}
