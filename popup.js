// DOM VARIABLES
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


// Function to handle key input change
const handleKeyInputChange = () => {
  spinner.classList.add("active");
  chrome.runtime.sendMessage({ dataKey: keyInput.value });
};

// Function to handle input change
const handleInputChange = (node,type,action) => {
  node.closest(`.clickup-extension__${type}-content`).classList[action]("active");
};

// Function to handle form submission
const handleFormSubmit = (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const dataObject = Object.fromEntries(data.entries());

  if (dataObject.team && dataObject.email && dataObject.key) {
    spinner.classList.add("active");
    chrome.runtime.sendMessage({ formData: dataObject });
  } else {
    throw new Error("Data is missing from the form");
  }
};

// Function to handle messages from the background
const handleMessage = (request, sender, sendResponse) => {
  if (request.invalidKey) {
    handleInvalidKey(request.invalidKey);
  }
  if (request.validKey) {
    handleValidKey(request.validKey);
  }
  if (request.invalidEmail) {
    handleInvalidEmail(request.invalidEmail);
  }
  if (request.validEmail) {
    handleValidEmail();
  }
  if(request.resetAuthAll){
    dataContent.classList.add('hide');
    authContainer.classList.add('active');
    authenticationForm.reset();
    keyInput.readOnly = false;
    teamOptions.classList.remove("active");
    handleInputChange(submit,'submit','remove');
    handleInputChange(email,'email','remove');
  }
};

// Function to handle invalid key
const handleInvalidKey = (dataError) => {
  spinner.classList.remove("active");
  teamOptions.classList.remove("active");
  keyInput.classList.add("clickup-extension__error");
  keyError.textContent = dataError;
};

// Function to handle valid key
const handleValidKey = (teams) => {
  spinner.classList.remove("active");
  keyInput.classList.remove("clickup-extension__error");
  keyInput.classList.add("clickup-extension__valid");
  keyInput.readOnly = true;
  teamOptions.classList.add("active");
  keyError.textContent = "";

  teams.forEach((item, index) => {
    teamOptions.innerHTML += `
      <div class="clickup-extension__radio-opt">
        <img src="${item.avatar ? item.avatar : "./images/avatar.png"}">
        <label>${item.name}</label>
        <input name="team" type="radio" value="${item.id}" ${
      index === 0 ? "required='required'" : ""
    }>
      </div>
    `;
  });
};

// Function to handle invalid email
const handleInvalidEmail = (invalidEmail) => {
  spinner.classList.remove("active");
  emailError.textContent = invalidEmail;
};

// Function to handle valid email
const handleValidEmail = () => {
  spinner.classList.remove("active");
  authContainer.classList.remove("active");
  dataContent.classList.remove('hide');
};

// Function Reset All Authentication Data
const handleResetAuthData = () => {
  chrome.runtime.sendMessage({ resetAuthDataAll: true });
};


// Event listeners
chrome.runtime.onMessage.addListener(handleMessage);
authenticationForm.addEventListener("submit", handleFormSubmit);
email.addEventListener("change",()=>{
  handleInputChange(submit,'submit','add');
});
teamOptions.addEventListener("click", (e) => {
  if (e.target.type === "radio") handleInputChange(email,'email','add');
});
btnResetAuthAll.addEventListener('click',handleResetAuthData)


// Initialization
const initializeAuthentication = () => {
  keyInput.addEventListener("change", handleKeyInputChange);
};


// VALIDATE IF IS ALREADY AUTHENTICATED
chrome.storage.local.get(["teamId", "userEmail","ApiKey","userId"], function (result) {
  if(!Object.keys(result).length){
    authContainer.classList.add('active');
    initializeAuthentication();
  }
  else{
    console.log(result);
    dataContent.classList.remove('hide');
  }
});