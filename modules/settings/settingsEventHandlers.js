import { btnResetAuthAll,inputsOption,themeSelector }from './settingsDomElements.js';
import { handleResetAuthData } from '../authFunctions.js';
import { handlerTheme } from '../utilities/themeSetting.js';

// Reset data
btnResetAuthAll.addEventListener('click', handleResetAuthData);

themeSelector.addEventListener('click', (even)=>{
    if (!!even.target.classList.contains("clickup-settings__slider")) {
      const input = themeSelector.querySelector("input");
      console.log(input.checked);

      chrome.storage.local.set({
        darkMode: !input.checked,
      });
      // Set Dark Mode
      !input.checked
        ? document.body.classList.add("clickup-settings__dark-mode")
        : document.body.classList.remove("clickup-settings__dark-mode");

      handlerTheme(!input.checked);
    }
});

// Notifications
inputsOption.forEach(input =>{
    input.addEventListener('change', ()=>{
        // Disable and Enable sound Notification
        if (!!input.classList.contains('clickup-settings__bt-notification')){
            console.log('Disabled Notification:', !!input.checked)
            !!input.checked ? chrome.storage.local.set({offNotification:true}) : chrome.storage.local.set({offNotification:false});
        }else if(!!input.classList.contains('clickup-settings__off-popup-notification')){
            console.log('Disabled Popup Notification:', !!input.checked)
            !!input.checked ? chrome.storage.local.set({offPopupNotification:true}) : chrome.storage.local.set({offPopupNotification:false});
        }
    });
});
