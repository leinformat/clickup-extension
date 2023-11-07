import { tasksContainer, task,countTasksContainer,implementorSpinner,goSettings } from "./domElements.js";
import { copyToSlack, copyEstimation,copydeliverToQA } from './copyText.js';
import { orderTasks,tasksCounter } from "./typeMessages.js";
// Utilities
import { dateFormat } from "./utilities/dateFormat.js";
import { convertToTimeFormat } from "./utilities/timeFormat.js";
import { formatText } from "./utilities/formatText.js";
import { getCustomField } from "./utilities/customField.js";
import { openTask } from "./utilities/openTask.js";
import { getDataFromObject } from "./utilities/getData.js";


// Function to Select tab tasks
function handlerTaskTab(statusData){
  const active = document.querySelector('.clickup-extension__counter-tasks.to-implementor .clickup-extension__count-task.active--tab');
  !!active && active.classList.remove('active--tab');

  statusData.classList.add('active--tab');
  const status = statusData.dataset.status;

  const allTasks = document.querySelectorAll(`.clickup-extension__tasks-container.to-implementor .clickup-extension__task`);

  allTasks.forEach(task =>{ 
    if(status !== 'all-tasks'){
      if(task.classList.contains(`clickup-extension--status-${status}`)){
        task.classList.add('show-only');
      }else{
        task.classList.remove('show-only');
      }
    }else{
      task.classList.add('show-only');
    }
  });
}

// Function to counter tasks
function handlerCounterTask(taskData,node){
  node.innerHTML = '';
  for (const task in taskData) {
    //console.log(task)
    node.innerHTML += `<div class="clickup-extension__count-task ${task === 'all-tasks' ? 'active--tab': ''}" data-status="${task ? task : 'all-tasks' }" style="order:${orderTasks[task]}">
                          <span class="clickup-extension__label">${task.replace(/-/g, " ")}: </span>
                          <span class="clickup-extension__count">${taskData[task]}</span>
                        </div>`;
  }
  const allTasksStatus = node.querySelectorAll('.clickup-extension__count-task');
  allTasksStatus.forEach( status => {
    status.addEventListener("click",(event)=>{
      handlerTaskTab(status);
    });
  })
}

// this Redndered each Task whit its content
function taskTemplate(data, clonedCard,fieldData) {
    // Add Listener to All Tasks
    const openTaskBtn = clonedCard.querySelector(".clickup-extension__open-task");
    // Open Task
    openTaskBtn.addEventListener("click",(event)=>{
      openTask(event.target);
    });

    // Add Listener to Copy Qa Comment
    const copyTextkBtn = clonedCard.querySelectorAll(".clickup-extension--copy-comment");
    copyTextkBtn.forEach( item =>{
      item.addEventListener("click",(e)=>{
        // Slack Comment
        if(item.dataset.comment === 'qa-slack'){
          let qaField = getDataFromObject(fieldData,'username');
          qaField == 'QA Team' ? qaField = 'team-qa' : qaField = qaField;

          copyToSlack(
            {
              pm:data.creator.username,
              qa:fieldData ? qaField : 'Unassigned',
              url:data.url,
              client:data.project.name,
              subClient:data.list.name
            },
            e.target);
        }
        // Slack Comment
        else if(item.dataset.comment === 'estimation'){
          let qaField = getDataFromObject(fieldData,'username');
          const qaId = getDataFromObject(fieldData,'id');
          const dueDate = dateFormat(data.due_date,'month-day');
          qaField == 'QA Team' ? qaField = 'team-qa' : qaField = qaField;

          copyEstimation(
            {
              pmId:data.creator.id,
              pm:data.creator.username,
              qa:fieldData ? qaField : 'Unassigned',
              qaId,
              dueDate
            },
            e.target);
        }
        // Deliver to QA Comment
        else if(item.dataset.comment === 'deliver-to-qa'){
          let qaField = getDataFromObject(fieldData,'username');
          const qaId = getDataFromObject(fieldData,'id');
          qaField == 'QA Team' ? qaField = 'team-qa' : qaField = qaField;

          copydeliverToQA(
            {
              pmId:data.creator.id,
              pm:data.creator.username,
              qa:fieldData ? qaField : 'Unassigned',
              qaId,
            },
            e.target);
        }
      });
    });
    

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

    // QA
    fieldData ? clonedCard.querySelector(".clickup-extension__qa-name").textContent = getDataFromObject(fieldData,'username') : 'Unassigned';

    // Poinst
    clonedCard.querySelector(".clickup-extension__points").textContent = data.points ? data.points : 'Unassigned';
    
    clonedCard.querySelector(".clickup-extension__task-status").textContent = data.status.status;
    clonedCard.querySelector(".clickup-extension__client-name").textContent = `${data.project.name} | ${data.list.name}`;

    clonedCard.querySelector(".clickup-extension__created-date").textContent =  dateFormat(data.date_created,'large');

    clonedCard.querySelector(".clickup-extension--status").style.color = data.status.color;

    clonedCard.querySelector(".clickup-extension__due-date").textContent = dateFormat(data.due_date,'month-day');

    clonedCard.querySelector(".clickup-extension__tracked").textContent = convertToTimeFormat(data.time_spent,'h');

    clonedCard.querySelector(".clickup-extension__estimated").textContent = convertToTimeFormat(data.time_estimate,'h') ;
    clonedCard.querySelector(".clickup-extension__task-descripion").innerHTML = formatText(data.description) ;
}

// This is a Main Funtion Function to handle Tasks
export function handleTasks(tasks) {
  implementorSpinner.classList.add('hide');
  goSettings.classList.add('active');
  if (!!tasks.length){
    document.querySelector('.clickup-extension__counter-tasks.to-implementor').classList.add('ready');
    tasksContainer.innerHTML = "";
    tasks.forEach((data) => {
      //console.log(data);
      const clonedCard = task.cloneNode(true);

      // Get QA DATA ...
      const customField = getCustomField(data.custom_fields,'qa');

      /* TASK RENDER */
      taskTemplate(data, clonedCard,customField);
      tasksContainer.appendChild(clonedCard);
    });
    // Counter All Tasks
    handlerCounterTask(tasksCounter,countTasksContainer);
    
  }else{
    tasksContainer.innerHTML="<h2 style='text-align:center'>You don't have any tasks assigned</h2>";
  }
}
