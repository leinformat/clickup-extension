// message.js
import { handleDataKey, handleFormData, handleResetAuthAll } from "./auth.js";

// Function to handle incoming messages
export async function handleMessage(request, sender, sendResponse) {
  if (request.dataKey) {
    handleDataKey(request.dataKey);
  }
  if (request.formData) {
    handleFormData(request.formData);
  }
  if (request.resetAuthDataAll) {
    handleResetAuthAll(sendResponse);
  }
}

// Add listener to handle messages
chrome.runtime.onMessage.addListener(handleMessage);