import {apiUrl} from './auth.js';

const filterTasks = (tasks, userId)=>{

  // Create an empty array to store the filtered results
  const filteredData = tasks.filter((task) => {
    // Find the "qa" field within the "custom_fields" array of the current object
    const qaField = task.custom_fields.find(field => field.name === "QA");

    // Check if the "qaField" exists and if its "value" is an array
    if (qaField && Array.isArray(qaField.value)) {

        // Check if at least one object in the "value" array has an "id" equal to UserID
        return qaField.value.some(value => value.id === userId);
    }

    // If "qaField" doesn't exist or "value" is not an array, return false
    return false;
  });
  return filteredData;
}

export const gettingTasksToQa = () =>{
  chrome.storage.local.get(["teamId", "userEmail", "apiKey", "userId"], async (result) => {

      const allTasks = [];
      let page = 0;
      let lastPage = false;

      const {apiKey,teamId,userId} = await result;

      while (!lastPage){
        try {
          const req = await fetch( `${apiUrl}/${teamId}/task?custom_fields=[{"field_id": "35dfb9e8-144b-498a-a407-8bff6217231c", "operator": "=", "value":"9ac05bc7-f227-4a4a-a26b-29503fe4b6d8"}]&subtasks=true&statuses[]=In%20Progress&statuses[]=Accepted&statuses[]=qa&page=${page}`,{
              method: "GET",
              headers: {
                  Authorization: apiKey,
              },
            });
            
          const response = await req.json(); 
          allTasks.push(...response.tasks);
          page++;

          if (response.last_page === true){
            lastPage = true;
          }
        } catch (error){
          console.error('Error al obtener datos de la API:', error);
          break;
        }
      }
      // All DataTaks
      const taskToQa  = filterTasks(allTasks,userId);

      // Send Message to Front
      chrome.runtime.sendMessage({ allDataTasksToQa: taskToQa });
  });
}