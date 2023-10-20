const taskSData = [];

const handlerNotificationMessage = (message) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    console.log(message);
    if (activeTab) {
      // Send a message to the active tab
      chrome.tabs.sendMessage(activeTab.id,{
        notification: message,
      });
    }
  });
};

export const getTasks = (data) => {
  // First Loop
  for (const task of data) {
    if (taskSData.length < data.length) {
      const newData = {
        id: task.id,
        lastUpdate: task.date_updated,
        name: task.name,
      };
      taskSData.push(newData);
    }
  }

  let message = [];

  taskSData.forEach((task) => {
    const lastUpdate = data.filter(item => task.id === item.id && item.date_updated !== task.lastUpdate);
    
    // If there're changes
    if(lastUpdate.length){
        const updatedTask = lastUpdate[0];
        message.push(updatedTask);

        taskSData.forEach((item,index) =>{
            if(item.id == updatedTask.id ) return taskSData[index].lastUpdate = updatedTask.date_updated;
        })
    }
  });
  
  console.log(taskSData);
  !!message.length && handlerNotificationMessage(message);
};

export const handlerNotifications = (data) =>{
    getTasks(data);
  // Sound Notification Actived
  chrome.storage.local.get(["offNotification"], function (result) {
    if (!!Object.keys(result).length) {
      console.log("aqui", result.offNotification);
    }
  });
}