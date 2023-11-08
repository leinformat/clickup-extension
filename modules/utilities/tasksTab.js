// Function to Select tab tasks
export const handlerTaskTab = (statusData,activeTab,allTasks) => {
  // -->>
  const active = document.querySelector(`${activeTab}`);
  !!active && active.classList.remove("active--tab");

  statusData.classList.add("active--tab");
 const status = statusData.dataset.status;

  allTasks.forEach((task) => {
    if (status !== "all-tasks") {
      if (task.classList.contains(`clickup-extension--status-${status}`)) {
        task.classList.add("show-only");
      } else {
        task.classList.remove("show-only");
      }
    } else {
      task.classList.add("show-only");
    }
  });
}
