import {apiUrl} from './auth.js';
import { handlerNotifications } from './notification.js';


export const gettingTasks = (action) =>{
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

      // getting notification
      if(action === 'notification'){
        handlerNotifications(response.tasks);
      }else{
        console.log(response.tasks);
        chrome.runtime.sendMessage({ allDataTasks: response.tasks });
      }
    }catch(err){
        console.log("We've had an Error: "+err);
    }
  });
}

export const gettingTasksToQa = () =>{
console.log('Tasks QA')
  chrome.storage.local.get(["teamId", "userEmail", "apiKey", "userId"], async (result) => {

      const qaTasks = [];
      let page = 0;
      let lastPage = false;

      const {apiKey,teamId,userId} = await result;

      while (!lastPage){
        console.log('While');
        try {
          const req = await fetch( `${apiUrl}/${teamId}/task?subtasks=true&page=${page}`, {
              method: "GET",
              headers: {
                  Authorization: apiKey,
              },
            });
      
          const response = await req.json(); 
    
          // Verificar si last_page es igual a false
          if (response.last_page === false) {
            // Agregar los elementos de la respuesta al array dataArray
            qaTasks.push(...response.tasks);
            page++;
          } else {
            lastPage = true; // Terminar el bucle
          }
        } catch (error) {
          console.error('Error al obtener datos de la API:', error);
          break; // En caso de error, sal del bucle
        }
      }
      // Ahora tienes todos los datos en el array dataArray
      console.log('Datos completos:', qaTasks);
  });
}
