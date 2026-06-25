export const getTask = async (taskId) => {
  try {
    const { apiKey } = await chrome.storage.local.get(["apiKey"]);

    const req = await fetch(
      `https://api.clickup.com/api/v2/task/${taskId}`,
      {
        method: "GET",
        headers: {
          Authorization: apiKey,
        },
      }
    );

    const response = await req.json();

    if (response.err) {
      throw new Error("Error getting task");
    }

    return response;

  } catch (err) {
    console.log("We've had an error:", err);
    return { gettingTaskErr: err };
  }
};