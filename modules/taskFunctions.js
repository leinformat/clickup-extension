import { tasksContainer, task, allTasks } from "./domElements.js";


const dateFormat = (unix, format)=>{
  if(!unix) throw new Error("Whoops! The unix is necesary");
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


function formatText(text) {
  // Replace line breaks with <br> tags
  const startIndextText = text.toLowerCase().indexOf("what we need to do");
  const endIndextText = text.toLowerCase().indexOf("platform");

  if (startIndextText !== -1) {
    let newText = text.substring(startIndextText,endIndextText);
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
// this Redndered each Task whit its content
function taskTemplate(data, clonedCard) {
    // Add Listener to All Tasks
    const openTaskBtn = clonedCard.querySelector(".clickup-extension__open-task");

    openTaskBtn.addEventListener("click",(event)=>{
      openTask(event.target);
    });

    // Card
    clonedCard.style.border = `solid 2px ${data.status.color}`;

    const assignedByImg = clonedCard.querySelector(".clickup-extension__img-asignBy");
    assignedByImg.src = data.creator.profilePicture;
    assignedByImg.alt = data.creator.username;

    const taskName = clonedCard.querySelector(".clickup-extension__task-name");
    taskName.href = data.url;
    taskName.textContent = data.name.slice(0, 60) + " ..."; 
    taskName.title = "Go to Task";
    taskName.target = '_blank';

    const fullTaskName = clonedCard.querySelector(".clickup-extension__full-task-name");
    fullTaskName.textContent = data.name;

    clonedCard.querySelector(".clickup-extension__asignBy").textContent = data.creator.username;
    clonedCard.querySelector(".clickup-extension__task-status").textContent = data.status.status;
    clonedCard.querySelector(".clickup-extension__client-name").textContent = `${data.project.name} | ${data.list.name}`;

    clonedCard.querySelector(".clickup-extension__created-date").textContent =  dateFormat(data.date_created,'large');

    clonedCard.querySelector(".clickup-extension__start-date").textContent = dateFormat(data.start_date,'month-day');

    clonedCard.querySelector(".clickup-extension__due-date").textContent = dateFormat(data.due_date,'month-day'); ;

    clonedCard.querySelector(".clickup-extension__tracked").textContent = data.time_spent;

    clonedCard.querySelector(".clickup-extension__estimated").textContent = data.time_estimate;
    clonedCard.querySelector(".clickup-extension__task-descripion").innerHTML = formatText(data.description) ;

}

// Function to handle Tasks
export function handleTasks(tasks) {
  if (!!tasks.length){
    console.log(tasks)
    tasksContainer.innerHTML="";
    tasks.forEach((data) => {
      const clonedCard = task.cloneNode(true);

      /* TASK RENDER */
      taskTemplate(data, clonedCard);
      tasksContainer.appendChild(clonedCard);
    });
  }
}
