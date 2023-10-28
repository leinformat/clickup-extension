import { btnResetAuthAll,inputsOption }from './settingsDomElements.js';
import { handleResetAuthData } from '../authFunctions.js';

// Reset data
btnResetAuthAll.addEventListener('click', handleResetAuthData);

// Notifications
inputsOption.forEach(input =>{
    input.addEventListener('change', ()=>{
        // Disable and Enable sound Notification
        if (!!input.classList.contains('clickup-settings__bt-notification')){
            console.log('Disabled Notification:', !!input.checked)
            !!input.checked ? chrome.storage.local.set({offNotification:true}) : chrome.storage.local.set({offNotification:false});
        }
    });
});
