import { userAvatar, userName, userEmail,inputsOption } from "./settingsDomElements.js";

export const goToSettings = () =>{
    chrome.runtime.openOptionsPage();
}

export const renderUserData = (data) =>{
  if( data == {}) return null;

  const {userAvatar : avatar, userEmail : email, userName : name} = data;

  userAvatar.src = avatar ? avatar : './images/avatar.png';
  userName.textContent = name ? name : 'Undefined';
  userEmail.textContent = email ? email : 'Undefined';
}

export const getUserData = () =>{
    chrome.storage.local.get(["userName", "userEmail", "userAvatar", ""], function (result) {
        if (!Object.keys(result).length) {
          return "without data"
        } 
        renderUserData(result);
      });
}

export const handlerOptions = ()=>{
  chrome.storage.local.get(["offNotification"], function (result){
    if (!!Object.keys(result).length){
      console.log('Handler Notification',result)
      inputsOption.forEach(input =>{
        console.log(!!input.classList.contains('clickup-settings__bt-notification'))
        // Sound Notification
        if (!!input.classList.contains('clickup-settings__bt-notification')){
          !!result.offNotification ? input.checked = true : input.checked = false;
        }
      });
    }
  });
}