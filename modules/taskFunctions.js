import { tasksContainer, task } from "./domElements.js";

function taskTemplate(data, clonedCard) {
    const assignedByImg = clonedCard.querySelector(".clickup-extension__img-asignBy");
    assignedByImg.src = data.creator.profilePicture;
    assignedByImg.alt = data.creator.username;

    const taskName = clonedCard.querySelector(".clickup-extension__task-name");
    taskName.href = data.url;
    taskName.textContent = data.name.slice(0, 60) + " ...";
    taskName.title = "Go to Task";
    taskName.target = '_blank';

    clonedCard.querySelector(".clickup-extension__asignBy").textContent = data.creator.username;
    clonedCard.querySelector(".clickup-extension__task-status").textContent = data.status.status;
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
