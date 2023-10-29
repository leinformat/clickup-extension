import { tasksContainer, task,countTasksContainer,implementorSpinner,goSettings } from "./domElements.js";
import { copyToClick } from './copyText.js';
import { orderTasks,tasksCounter } from "./typeMessages.js";

// Funtion to format dates
const dateFormat = (unix, format)=>{
  if(!unix) return 0;
  
  const codeUnix = new Date(Number(unix));
  
  if(format=="month"){
    const date = codeUnix.toLocaleDateString('en-US',{ month: 'short'});
    return date;
  }
  else if(format=="day"){
    const date = codeUnix.toLocaleDateString('en-US',{ day: 'numeric' });
    return date;
  }
  else if(format=="month-day"){
    const date = codeUnix.toLocaleDateString('en-US',{month: 'short',day: 'numeric' });
    return date;
  }
  else if(format=="large"){
    const date = codeUnix.toLocaleDateString("en-US",{
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return date;
  }
  else{
    const date = codeUnix.toLocaleDateString('en-US',{ year: 'numeric', month: 'short', day: 'numeric' });
    return date.replace(/\./g, ',');
  }
}

// Funtion to Time Format
function convertToTimeFormat(seconds,format) {
  if(!seconds) return '0h';
  
  if(format == 'h'){
    // Calculate hours
    const hours = seconds / 3600000;

    // Return the time in "Xh" format
    return hours.toFixed(2) + 'h';
  }
}

// Funtion GET CUSTOM fIELD
function getCustomField(data,fieldName){
  if(data.length < 1) return 0;

  fieldName = fieldName.toLowerCase();

  const field = data.find(item=> item.name.toLowerCase()=== fieldName);
  if(!!field.value) {
    return field.value
  }
  return 0;
}

// Funtion GET QA data
function getDataFromObject(object,value){
  if(!object.length) return "Unassigned";

  let data = "";
  object.forEach((item,index) =>{
    index < object.length -1 ? data += item[value] + ', ' : data += item[value]+ '.';
  });

  return data;
}

function formatText(text) {
  // Find the start and end text
  const startIndextText = text.toLowerCase().indexOf("what we need to do");
  const endIndextText = text.toLowerCase().indexOf("platform");

  if (startIndextText !== -1) {
    let newText = text.substring(startIndextText,endIndextText);
    // Replace line breaks with <br> tags
    newText =  newText.replace(/\n/g, "<br>");
    // Remove asterisks around the text
    newText = newText.replace(/\*+/g, "");
    return newText;
  }
  return 'Open the Task to more information';
}

function openTask(taskBtn){
  if(!taskBtn) throw new Error('Sorry There is no a btn node');

  const parentContainer = taskBtn.closest(".clickup-extension__task");
  
  if(parentContainer.classList.contains('active')){
    parentContainer.classList.remove('active');
  }else{
    if(document.querySelector('.clickup-extension__task.active') !== null){
      document.querySelector('.clickup-extension__task.active').classList.remove('active');
    }
    parentContainer.classList.add('active');
  }
}

// Function to Select tab tasks
function handlerTaskTab(statusData){
  const active = document.querySelector('.clickup-extension__counter-tasks.to-implementor .clickup-extension__count-task.active--tab');
  !!active && active.classList.remove('active--tab');

  statusData.classList.add('active--tab');
  const status = statusData.dataset.status;

  const allTasks = document.querySelectorAll(`.clickup-extension__tasks-container.to-implementor .clickup-extension__task`);
  console.log(allTasks)

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

    openTaskBtn.addEventListener("click",(event)=>{
      openTask(event.target);
    });

    // Add Listener to Copy Qa Comment
    const copyTextkBtn = clonedCard.querySelector(".clickup-extension--copy-qa-comment");
    copyTextkBtn.addEventListener("click",(e)=>{
      copyToClick(
        {
          pm:data.creator.username,
          qa:fieldData ? getDataFromObject(fieldData,'username') : 'Unassigned',
          url:data.url,
          client:data.project.name,
          subClient:data.list.name
        },
        e.target);
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

    clonedCard.querySelector(".clickup-extension__due-date").textContent = dateFormat(data.due_date,'month-day'); ;

    clonedCard.querySelector(".clickup-extension__tracked").textContent = convertToTimeFormat(data.time_spent,'h');

    clonedCard.querySelector(".clickup-extension__estimated").textContent = convertToTimeFormat(data.time_estimate,'h') ;
    clonedCard.querySelector(".clickup-extension__task-descripion").innerHTML = formatText(data.description) ;
}

// This is a Main Funtion Function to handle Tasks
export function handleTasks(tasks) {
  implementorSpinner.classList.add('hide');
  goSettings.classList.add('active');
  if (!!tasks.length){
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
