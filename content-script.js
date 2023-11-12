(async () => {
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
    message += `<div class="task__notification-container">
                  <p><span class="task__bold">PM:</span> ${ item.creator.username }</p>
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
  button.classList.add(data.class,"active");
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
    buttonContainer.classList.add("container--developer-mode","active");

    // Developer Mode Button
    const dvmButton = createButton({
      url: `${currentUrl}?developerMode=true`,
      class:"button--developer-mode",
      text: "Developer Mode",
      type: 'a'
    });

    /*
    // Live Reload Button
    const liveReload = createButton({
      url: "javascript:;",
      class:"button--live-reload",
      text: "Live Reload",
      type: 'a'
    });

    // --> Live Reload Listener
    liveReload.addEventListener("click", () => {
      const image = chrome.runtime.getURL("images/loader2.gif")
      const pageId = getPageId(currentUrl);
      liveReload.classList.add('reload');
      liveReload.style.backgroundImage = `url(${image})`;
      setTimeout(() => {
        // Send message to background
        chrome.runtime.sendMessage({ pageToreload: pageId });
        liveReload.style.backgroundImage = 'none';
        liveReload.classList.remove('reload');
      }, 2000);
    });
    */

    // Developer Mode Show Controls
    const ShowControls = createButton({
      class:"button--show-controls",
      text: "X",
      title:"Show Dev Controls",
      type: 'div'
    });
    //--> Show Listener
    ShowControls.addEventListener("click",()=>{
      ShowControls.classList.toggle('active');
      buttonContainer.classList.toggle('active');
      !!ShowControls.classList.contains('active') ? ShowControls.textContent = "X" : ShowControls.textContent = ""
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
    currentUrl.includes("https://app.hubspot.com/global-content/")){
  
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
    }, 1000);
  }
});

