export const detectCurrentUrl = ({ allTasks }) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const url = currentTab.url;

    const task = document.querySelector(`${allTasks}[data-task-url="${url}"]`); 

    if (task) {
      task.classList.add("clickup-extension__active-url");
      task.style.order = -1000;
    }
  });
};
