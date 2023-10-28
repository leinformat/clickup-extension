import { userAvatar, userName, userEmail,teamsContainer } from "./settingsDomElements.js";

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
const createNode = (object) =>{
  const node = document.createElement(object.nodeType);

  if(!!object.class) node.classList.add(object.class);

  if(!!object.url && object.type == 'a') node.href = object.url;

  if(!!object.type && object.nodeType == 'input') node.type = object.type;
  if(!!object.value && object.nodeType == 'input') node.value = object.value;
  if(!!object.name && object.nodeType == 'input') node.name = object.name;

  if(!!object.title) node.title = object.title;

  if(!!object.text) node.textContent = object.text;
  
  return node;
}

const handlerTeamsOptions = (input) =>{
  const teamId = input.value;
  const name = input.name;
  !!input.checked ? chrome.storage.local.set({[name]:teamId}) : chrome.storage.local.set({[name]:false});
}

export const renderTeamsData = (data) =>{
   data.forEach( team =>{
    const container = createNode({nodeType:"div",class:"clickup-settings__team-container"});

    const label = createNode({nodeType: "label",text: team.name });

    const name = team.name.toLowerCase().replace(/ /g, "-");
    const input = createNode({nodeType: "input",type:"checkbox", value:team.id,name:name });
    
    // Handler Change
    input.addEventListener("click",()=>{
      handlerTeamsOptions(input);
    });

    container.append(label,input);
    teamsContainer.append(container);
   });
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
  chrome.storage.local.get(["offNotification","data-engineering-&-analysis","project-managers","engineers","front-end-dev","back-end-dev","designers","qa"], function (result){
    if (!!Object.keys(result).length){
      const optionInputs = document.querySelectorAll('.clickup-settings input');
      console.log(result)
      optionInputs.forEach(input =>{
        // Sound Notification
        if (!!input.classList.contains('clickup-settings__bt-notification')){
          !!result.offNotification ? input.checked = true : input.checked = false;
        }
        else if(input.id !== 'sound-notification'){
          !!result[input.name] ? input.checked = true : input.checked = false;
        }
      });
    }
  });
}