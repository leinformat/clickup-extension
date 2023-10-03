// apiKey: pk_43629781_B80XF63D0EETYTHFLM2CBIVCZ8JMUW7I
//userEmail:leonardo.morales@onthefuze.com.au
//userId: 43629781
//teamId:"6909093"
//'https://api.clickup.com/api/v2/team/6909093/task?subtasks=true&assignees[]=43629781'

// main.js
import { handleMessage } from "./modules/background/message.js";
import { handlerNotifications } from "./modules/background/notification.js";


handlerNotifications();
// Add listener to handle messages
chrome.runtime.onMessage.addListener(handleMessage);