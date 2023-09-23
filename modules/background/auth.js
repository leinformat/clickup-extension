// auth.js
export const apiUrl = "https://api.clickup.com/api/v2/team/";

// Function to handle API key authentication
export async function handleDataKey(apikey) {
  try {
    const req = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: apikey,
      },
    });

    const response = await req.json();

    if (response.err) {
      console.log(response.err);
      return chrome.runtime.sendMessage({ invalidKey: response.err });
    }

    const teams = response.teams.map((item) => ({
      id: item.id,
      name: item.name,
      avatar: item.avatar,
    }));

    chrome.runtime.sendMessage({ validKey: teams });
  } catch (error) {
    console.log("Error ->" + error);
  }
}

// Function to handle form data
export async function handleFormData({ team, email, key }) {
  try {
    const req = await fetch(apiUrl + team, {
      method: "GET",
      headers: {
        Authorization: key,
      },
    });

    const response = await req.json();
    const allMembers = response.team.members;

    const userData = allMembers.find((member) => member.user.email === email);

    if (userData === undefined) {
      chrome.runtime.sendMessage({ invalidEmail: "Invalid Email" });
    } else {
      const { username, id, profilePicture } = userData.user;
      chrome.runtime.sendMessage({ validEmail: email });

      chrome.storage.local.set(
        {
          teamId: team,
          userEmail: email,
          userName: username,
          userId: id,
          userAvatar: profilePicture,
          apiKey: key,
        },
        (e) => {
          if (chrome.runtime.lastError) {
            throw new Error(
              "Error saving to local storage:",
              chrome.runtime.lastError
            );
          }
        }
      );
    }
  } catch (error) {
    console.log("Error ->" + error);
  }
}

// Function to reset all authentication data
export function handleResetAuthAll(sendResponse) {
    chrome.storage.local.clear()
    sendResponse({ resetAuthAll: true });
}