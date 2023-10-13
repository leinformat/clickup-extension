import { userAvatar, userName, userEmail } from "./settingsDomElements.js";


export const goToSettings = () =>{
    chrome.runtime.openOptionsPage();
}

export const renderUserData = (data) =>{
  if( data == {}) return null;

  console.log(data)
  const {userAvatar : avatar, userEmail : email, userName : name} = data;

  console.log(email)

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