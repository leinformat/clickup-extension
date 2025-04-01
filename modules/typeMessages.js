export const messages = {
    authOk:'Registered Successfully',
}

export const orderTasks = {
    "next-sprint": -4,
    "in-progress": -3,
    qa: -2,
    accepted: -1,
    "to-be-delivered": 0,
    blocked: 1,
    "all-tasks":2,
}

export let tasksCounter = {
    "all-tasks": 0
}
export let tasksCounterToQa = {
    "all-tasks": 0
}

export const taskAlert = {
    tacked:"Time has not been tracked",
    estimated:"Task has not been estimated",
    qa:"QA has not been assigned",
    levelOfComplexity:"Level Of Complexity has not been applied",
    projectType:"Project Type has not been applied"
}