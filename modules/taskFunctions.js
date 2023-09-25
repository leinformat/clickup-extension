import { tasksContainer, task } from "./domElements.js";


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
  text = text.replace(/\n/g, "<br>");
  // Remove asterisks around the text
  text = text.replace(/\*+/g, "");
  return text;
}

function taskTemplate(data, clonedCard) {
    const assignedByImg = clonedCard.querySelector(".clickup-extension__img-asignBy");
    assignedByImg.src = data.creator.profilePicture;
    assignedByImg.alt = data.creator.username;

    const taskName = clonedCard.querySelector(".clickup-extension__task-name");
    taskName.href = data.url;
    taskName.textContent = data.name.slice(0, 60) + " ...";
    taskName.title = "Go to Task";
    taskName.target = '_blank';

    const timestamp = 1692395050355;
    const fecha = new Date(timestamp);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

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
    tasksContainer.innerHTML="";
    tasks.forEach((data) => {
      const clonedCard = task.cloneNode(true);

      /* TASK RENDER */
      taskTemplate(data, clonedCard);
      tasksContainer.appendChild(clonedCard);
    });
  }
  //tasksContainer.innerHTML = '<h5>Aqui se listaran las tareas</h5>';
}
