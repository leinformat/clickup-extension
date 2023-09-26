// Auth
const authContainer = document.querySelector(".clickup-extension__user-auth-data");
const authenticationForm = document.querySelector(".clickup-extension__form");
const keyInput = document.querySelector(".clickup-extension__key");
const teamOptions = document.querySelector(".clickup-extension__team-options");
const keyError = document.querySelector(".clickup-extension__key-error");
const spinner = document.querySelector(".clickup-extension__spinner");
const emailError = document.querySelector(".clickup-extension__email-error");
const email = document.querySelector(".clickup-extension__email");
const submit = document.querySelector(".clickup-extension__submit");
const dataContent = document.querySelector('.clickup-extension__content');
const btnResetAuthAll = document.querySelector('.clickup-extension__resetAuthAll'); 

// Tasks
const tasksContainer = document.querySelector('.clickup-extension__tasks-container');
const task = tasksContainer.querySelector('.clickup-extension__task');
const allTasks = document.querySelectorAll('.clickup-extension__task');

export {
  authContainer,
  authenticationForm,
  keyInput,
  teamOptions,
  keyError,
  spinner,
  emailError,
  email,
  submit,
  dataContent,
  btnResetAuthAll,
  tasksContainer,
  task,
  allTasks,
};