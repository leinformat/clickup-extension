import {apiUrl} from './auth.js';

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
          const req = await fetch( `${apiUrl}/${teamId}/task?custom_fields[{"field_id":"35dfb9e8-144b-498a-a407-8bff6217231c","operator": "=","value":"9ac05bc7-f227-4a4a-a26b-29503fe4b6d8"}]&subtasks=true&statuses[]=In%20progress&statuses=2&statuses[]=accepted&statuses[]=qa&page=${page}`, {
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
            qaTasks.push(...response.tasks);
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