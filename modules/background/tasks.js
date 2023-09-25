import {apiUrl} from './auth.js';

export const gettingTasks = () =>{
  chrome.storage.local.get(["teamId", "userEmail", "apiKey", "userId"], async (result) => {
  try {
      const {apiKey,teamId,userId} = await result;
      const req = await fetch( `${apiUrl}/${teamId}/task?subtasks=true&assignees[]=${userId}`, {
      method: "GET",
      headers: {
          Authorization: apiKey,
      },
      });

      const response = await req.json(); 

      if (response.err) {
        console.log(response.err);
        return chrome.runtime.sendMessage({ gettingTaskErr: 'Error to getting Tasks' });
      }
      chrome.runtime.sendMessage({ allDataTasks: response.tasks });
    }catch(err){
        console.log("We've had an Error: "+err);
    }
  });
}

