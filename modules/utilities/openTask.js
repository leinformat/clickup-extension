export const openTask = (taskBtn)=>{
  if (!taskBtn) throw new Error("Sorry There is no a btn node");

  const parentContainer = taskBtn.closest(".clickup-extension__task");

  if (parentContainer.classList.contains("active")) {
    parentContainer.classList.remove("active");
  } else {
    if (document.querySelector(".clickup-extension__task.active") !== null) {
      document
        .querySelector(".clickup-extension__task.active")
        .classList.remove("active");
    }
    parentContainer.classList.add("active");
  }
}
