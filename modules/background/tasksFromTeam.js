import {apiUrl} from './auth.js';
import { teamsData } from './teams.js';

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
  chrome.storage.local.get(["teamId", "userEmail", "apiKey", "userId","data-engineering-&-analysis","project-managers","engineers","front-end-dev","back-end-dev","designers","qa"], async (result) => {
      const allTasks = [];
      let page = 0;
      let lastPage = false;

      let customField = "";

      for (const team in result) {
        if(team && team !=='teamId' && team !== 'userEmail' && team !== 'userEmail' && team !== 'apiKey' && team !== 'userId'){
             if(!!result[team]){
              customField+=`{"field_id":"${teamsData.id}","operator":"=","value":"${result[team]}"},`;

             }
        }
      }
      customField = customField.slice(0, -1);
      const {apiKey,teamId,userId} = await result;

      if(!customField ) return chrome.runtime.sendMessage({ allDataTasksToQa: [] });
  
      /* while (!lastPage){
        try {
          const req = await fetch( `${apiUrl}/${teamId}/task?custom_fields=[${customField}]&subtasks=true&statuses[]=In%20Progress&statuses[]=Accepted&statuses[]=qa&page=${page}`,{
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
      } */


        const batchSize = 100;

        while (!lastPage) {
          try {
            // Generar las promesas para 100 páginas en paralelo
            const requests = Array.from(
              { length: batchSize },
              (_, i) =>
                fetch(
                  `${apiUrl}/${teamId}/task?custom_fields=[${customField}]&subtasks=true&statuses[]=In%20Progress&statuses[]=Accepted&statuses[]=qa&page=${
                    page + i
                  }`,
                  {
                    method: "GET",
                    headers: { Authorization: apiKey },
                  }
                ).then((res) => res.json()) // Convertir respuesta a JSON directamente
            );

            // Ejecutar todas las solicitudes en paralelo
            const responses = await Promise.all(requests);

            for (const response of responses) {
              if (response.tasks) {
                allTasks.push(...response.tasks);
              }

              // Si alguna de las respuestas indica que es la última página, detenemos el loop
              if (response.last_page === true) {
                lastPage = true;
              }
            }

            // Avanzar al siguiente batch
            page += batchSize;
            console.log(
              `Batch page ${page}: ${responses.length} tasks loaded`
            );
          } catch (error) {
            console.error("Error getting tasks:", error);
            break;
          }
        }
        


      // All DataTaks
      const taskToQa  = filterTasks(allTasks,userId);
  
      // Send Message to Front
      chrome.runtime.sendMessage({ allDataTasksToQa: taskToQa });
  });
}