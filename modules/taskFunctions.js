import {tasksContainer} from './domElements.js'

// Function to handle Tasks
export function handleTasks(tasks) {
    console.log('Desde front',tasks)
    tasksContainer.innerHTML = '<h5>Aqui se listaran las tareas</h5>';
}