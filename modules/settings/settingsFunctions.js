export const goToSettings = () =>{
    chrome.runtime.openOptionsPage();
}

export const getUserData = () =>{
    chrome.storage.local.get(["userName", "userEmail", "userAvatar", ""], function (result) {
        if (!Object.keys(result).length) {
          return "without data"
        } 
        console.log(result);
      });
}