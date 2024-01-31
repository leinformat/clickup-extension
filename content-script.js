(async () => {
  const getCustomField = (data, fieldName) =>{
    if (data.length < 1) return 0;
    fieldName = fieldName.toLowerCase();
    const field = data.find((item) => item.name.toLowerCase() === fieldName);
    if (!!field.value) {
      return field.value;
    }
    return 0;
  }
  // Funtion GET QA data
const getDataFromObject = (object, value) => {
  if (!object.length) return "Unassigned";
  let data = "";
  object.forEach((item) => {
    const name = item[value] || item["name"];
    data += name + ", ";
  });

  return data.slice(0, -2);
};

  // ******************* Task Changes Notifications **********************/
  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 10000,
    timerProgressBar: true,
    showCloseButton: true,
  });

const soundNotification = () => {
  var sources = {
    src: chrome.runtime.getURL("audio/tarea-actualizada.mp3"),
    type: "audio/mp3",
  };
  const audioElement = document.createElement("audio");
  audioElement.autoplay = true;

  const sourceElement = document.createElement("source");
  sourceElement.src = sources.src;
  sourceElement.type = sources.type;

  audioElement.appendChild(sourceElement);

  const body = document.body;
  body.appendChild(audioElement);
};

const formatMessage = (dataMessage) =>{
  let message = '';
  dataMessage.forEach(item =>{
    // Get QA DATA ...
    const customField = getCustomField(item.custom_fields,'qa');
    const qa = getDataFromObject(customField,'username');
    message += `<div class="task__notification-container">
                  <p><span class="task__bold">PM:</span> ${ item.creator.username }</p>
                  <p><span class="task__bold">QA:</span> ${ qa }</p>
                  <p><span class="task__bold">Task Status:</span> ${ item.status.status }</p>
                  <p>
                    <span class="task__bold">Task Name:</span>
                    <span><a target="__blank" href="${item.url}"> ${ item.name }</a></span> 
                  </p>
                </div>`;
  });
  return message;
}

chrome.runtime.onMessage.addListener(async function (request){
    if (request.notification) {
      const message = formatMessage(request.notification); 
      Toast.fire({
        icon: "info",
        html: message,
      });
      // Sound Notification Actived
      chrome.storage.local.get(["offNotification"], function (result){
        if (!!Object.keys(result).length){
          !result.offNotification && soundNotification();
        }
      });
    }
});
// ******************* End Task Changes Notifications **********************/
})();

//******************** */ Developer Options ************************* //

// Utility functions

const createButton = (data) =>{
  const button = document.createElement(data.type);
  button.classList.add(data.class);
  if(!!data.url && data.type == 'a') button.href = data.url;
  if(!!data.title) button.title = data.title;
  button.textContent = data.text;
  return button;
}

const getPageId = (url) => {
  const match = url.match(/\/editor\/(\d+)/);
  const pageId = match[1];
  return pageId;
};

const handlerLiveReload = (currentUrl) =>{
  const pageId = getPageId(currentUrl);
  // Send message to background
  chrome.runtime.sendMessage({ pageToreload: pageId });
};
// End Utility functions

window.addEventListener("load", (e) =>{
  const currentUrl = window.location.href;
  // Drag androp Page
  if (
    currentUrl.includes("https://app.hubspot.com/pages/") && !currentUrl.includes("developerMode=true") || 
    currentUrl.includes("https://app.hubspot.com/blog/") && !currentUrl.includes("developerMode=true") ||
    currentUrl.includes("https://app-eu1.hubspot.com/pages/") && !currentUrl.includes("developerMode=true")
    ) {
    // Body
    const bodyContainer = document.body;
    
    // Developer Mode Container
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("container--developer-mode");

    // Developer Mode Button
    const dvmButton = createButton({
      url: `${currentUrl}?developerMode=true`,
      class:"button--developer-mode",
      text: "Developer Mode",
      type: 'a'
    });

    // Developer Mode Show Controls
    const ShowControls = createButton({
      class:"button--show-controls",
      text: "",
      title:"Show Dev Controls",
      type: 'div'
    });
    //--> Show Listener
    ShowControls.addEventListener("click",()=>{
      ShowControls.classList.toggle('active');
      buttonContainer.classList.toggle('active');
      !!ShowControls.classList.contains('active') ? ShowControls.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1.25em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#f66129}</style><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm79 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>' : ShowControls.innerHTML = ""
    });

    buttonContainer.append(dvmButton);
    //buttonContainer.append(liveReload);
    bodyContainer.prepend(buttonContainer);
    bodyContainer.prepend(ShowControls);   
  }

  if (
    currentUrl.includes("https://app.hubspot.com/pages/") ||
    currentUrl.includes("https://app.hubspot.com/blog/") ||
    currentUrl.includes("https://app-eu1.hubspot.com/pages/") ||
    currentUrl.includes("https://app-eu1.hubspot.com/blog/") ||
    currentUrl.includes("https://app.hubspot.com/global-content/") ||
    currentUrl.includes("https://app.hubspot.com/email/")){
  
     // When you keydown
     document.addEventListener("keydown", function (event){
        if (event.ctrlKey){
          if (event.key.toLowerCase() === "s") {
            event.preventDefault();
            event.stopPropagation();
            // Control + s
            handlerLiveReload(currentUrl);
          }
        }
    });

    // Observe Save change
    setTimeout(() => {
      // Select the element you want to observe
      const targetNode = document.querySelector(".private-template__section--header span[data-key]");
      console.log(document.querySelectorAll('span[data-key]'));
      console.log(targetNode)
      // Set up the MutationObserver with a callback function
      const observer = new MutationObserver(function (mutations){
        mutations.forEach(function (mutation) {
          // Check if the mutation is an attribute change and the attribute is "data-key"
          if (mutation.type === "attributes" && mutation.attributeName === "data-key"){
            const targetObserved = targetNode.getAttribute("data-key").toLowerCase();
            if(targetObserved === ('epsavelabel.saved') || targetObserved.includes('autosaved')){
              handlerLiveReload(currentUrl);
            }
          }
        });
      });

      // Configure and start observing the target node and the mutation
      const config = { attributes: true };
      observer.observe(targetNode, config);
    }, 2000);
  }
});