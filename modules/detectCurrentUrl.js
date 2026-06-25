export const detectCurrentUrl = ({ allTasks }) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const url = currentTab.url.replace(/\/+$/, '');
    const taskId = url.split('/').pop();

    const task = document.querySelector(`${allTasks}[data-task-id="${taskId}"]`); 

    if (task) {
      task.classList.add("clickup-extension__active-url");
      task.style.order = -1000;
    }

  });
};