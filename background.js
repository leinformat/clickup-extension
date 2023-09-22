// Mio pk_43629781_B80XF63D0EETYTHFLM2CBIVCZ8JMUW7I
//leonardo.morales@onthefuze.com.au
//userId: 43629781
//teamId:"6909093"

// main.js
import { handleMessage } from "./modules/background/message.js";

// Add listener to handle messages
chrome.runtime.onMessage.addListener(handleMessage);