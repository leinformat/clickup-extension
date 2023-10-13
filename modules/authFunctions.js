import * as dom from './domElements.js';
import { renderUserData } from './settings/settingsFunctions.js';
import { messages } from './typeMessages.js';


// Function to handle key input change
export function handleKeyInputChange() {
  dom.spinner.classList.add("active");
  chrome.runtime.sendMessage({ dataKey: dom.keyInput.value });
}

// Function to handle input change
export function handleInputChange(node, type, action) {
  node.closest(`.clickup-extension__${type}-content`).classList[action]("active");
}

// Function to handle form submission
export function handleFormSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const dataObject = Object.fromEntries(data.entries());

  if (dataObject.team && dataObject.email && dataObject.key) {
    dom.spinner.classList.add("active");
    chrome.runtime.sendMessage({ formData: dataObject });
  } else {
    throw new Error("Data is missing from the form");
  }
}

// Function to handle invalid key
export function handleInvalidKey(dataError) {
  dom.spinner.classList.remove("active");
  dom.teamOptions.classList.remove("active");
  dom.keyInput.classList.add("clickup-extension__error");
  dom.keyError.textContent = dataError;
}

// Function to handle valid key
export function handleValidKey(teams) {
  dom.spinner.classList.remove("active");
  dom.keyInput.classList.remove("clickup-extension__error");
  dom.keyInput.classList.add("clickup-extension__valid");
  dom.keyInput.readOnly = true;
  dom.teamContainer.classList.add("active");
  dom.keyError.textContent = "";
  
  dom.teamOptions.innerHTML = '';

  teams.forEach((item, index) => {
    dom.teamOptions.innerHTML += `
      <div class="clickup-extension__radio-opt">
        <img src="${item.avatar ? item.avatar : "./images/avatar.png"}">
        <label>${item.name}</label>
        <input name="team" type="radio" value="${item.id}" ${
      index === 0 ? "required='required'" : ""
    }>
      </div>
    `;
  });
}

// Function to handle invalid email
export function handleInvalidEmail(invalidEmail) {
  dom.spinner.classList.remove("active");
  dom.emailError.textContent = invalidEmail;
}

// Function to handle valid email
export function handleValidEmail() {
  dom.spinner.classList.remove("active");
  dom.authContainer.classList.remove("active");
  dom.dataContent.classList.remove('hide');

  dom.authMessage.textContent = messages.authOk;
  chrome.runtime.sendMessage({ listTasks: true });
  
  setTimeout(()=>{
    dom.authMessage.textContent = '';
  },3000);  
}

// Function to reset all Dom authentication
export const handleResetAll = () =>{
  dom.dataContent.classList.add('hide');
  dom.authContainer.classList.add('active');
  dom.authenticationForm.reset();
  dom.keyInput.readOnly = false;
  dom.teamOptions.classList.remove("active");
  handleInputChange(dom.submit,'submit','remove');
  handleInputChange(dom.email,'email','remove');
}

// Function to handle reset all authentication data
export function handleResetAuthData() {
  chrome.runtime.sendMessage({ resetAuthDataAll: true });
  renderUserData({});
}