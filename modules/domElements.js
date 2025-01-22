// Auth
const authContainer = document.querySelector(".clickup-extension__user-auth-data");
const authenticationForm = document.querySelector(".clickup-extension__form");
const keyInput = document.querySelector(".clickup-extension__key");
const teamContainer = document.querySelector(".clickup-extension__team-options-container");
const teamOptions = document.querySelector(".clickup-extension__team-options");
const keyError = document.querySelector(".clickup-extension__key-error");
const spinner = document.querySelector(".clickup-extension__spinner");
const emailError = document.querySelector(".clickup-extension__email-error");
const email = document.querySelector(".clickup-extension__email");
const submit = document.querySelector(".clickup-extension__submit");
const dataContent = document.querySelector('.clickup-extension__content');
const goSettings = document.querySelector('.clickup-extension__go-settings');
const authMessage = document.querySelector('.clickup-extension__auth-message');
const goThemeUploader = document.querySelector('.clickup-extension__theme-uploader');

// Tasks
const tasksContainer = document.querySelector('.clickup-extension__tasks-container');
const task = document.querySelector('.clickup-extension__task');
const countTasksContainer = document.querySelector('.clickup-extension__counter-tasks.to-implementor');
const implementorSpinner = document.querySelector('.clickup-extension--implementor-spinner');

// Tasks to QA
const tasksToQaContainer = document.querySelector('.clickup-extension__tasks-toQa-container');
const toQaButton = document.querySelectorAll('.clickup-extension__spaces > button');
const countTasksToQaContainer = document.querySelector('.clickup-extension__counter-tasks.to-qa');
const toQaSpinner = document.querySelector('.clickup-extension--to-qa-spinner');

// HUBL FIXER
const hublFixerBtn = document.querySelector('.clickup-extension__hubl-fixer');

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
  goSettings,
  tasksContainer,
  task,
  authMessage,
  countTasksContainer,
  teamContainer,
  tasksToQaContainer,
  toQaButton,
  countTasksToQaContainer,
  implementorSpinner,
  toQaSpinner,
  hublFixerBtn,
  goThemeUploader
};