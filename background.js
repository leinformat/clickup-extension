// GLOBAL VARIABLES
// Mio pk_43629781_B80XF63D0EETYTHFLM2CBIVCZ8JMUW7I
//leonardo.morales@onthefuze.com.au
//userId: 43629781
//teamId:"6909093"

const apiUrl = "https://api.clickup.com/api/v2/team/";

/*###################################### AUTHENTICATION CODE ################################## */

// Function to handle incoming messages
const handleMessage = async (request, sender, sendResponse) => {
  if (request.dataKey) {
    handleDataKey(request.dataKey);
  }
  if (request.formData) {
    handleFormData(request.formData);
  }
  if (request.resetAuthDataAll) {
    handleResetAuthAll(sendResponse);
  }
};

// Function to handle Clickup API with API key
const handleDataKey = async (apikey) => {
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
};

// Function to handle form data
const handleFormData = async ({ team, email, key }) => {
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
          ApiKey: key,
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
};

// Function to Reset All Authentication Data
const handleResetAuthAll = (sendResponse) => {
  chrome.storage.local.clear()
  sendResponse({ resetAuthAll: true });
}


// Add listener to handle messages
chrome.runtime.onMessage.addListener(handleMessage); 
/*###################################### END AUTHENTICATION CODE ################################## */