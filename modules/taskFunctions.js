import { tasksContainer, task } from "./domElements.js";

function taskTemplate(data, clonedCard) {
  /*
    clonedCard.querySelector(".hubdb__image").src = values[columns.image];
    clonedCard.querySelector(".hubdb__country").textContent = values[columns.country];
    clonedCard.querySelector(".hubdb__team").textContent = values[columns.team]?.name;
    clonedCard.querySelector(".hubdb__owner span").textContent = values[columns.name];
    clonedCard.querySelector(".hubdb__description").textContent = values[columns.description];
    */
    const assignedByImg = clonedCard.querySelector(".clickup-extension__img-asignBy");
    assignedByImg.src = data.creator.profilePicture;
    assignedByImg.alt = data.creator.username;

    const taskLink = clonedCard.querySelector(".clickup-extension__task-link");
    taskLink.href = data.url;
    taskLink.textContent = "Ir a la Tarea";

    clonedCard.querySelector(".clickup-extension__asignBy").textContent = data.creator.username;
    clonedCard.querySelector(".clickup-extension__task-name").textContent = data.name;
    clonedCard.querySelector(".clickup-extension__task-status").textContent = data.status.status;
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
