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
  if(!!data.text) button.textContent = data.text;
  
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

// Function to get clipboard content
async function getClipboardContent() {
  try {
      // Read text from the clipboard
      const clipboardText = await navigator.clipboard.readText();
      return clipboardText;
  } catch (error) {
      console.error('Error reading clipboard:', error);
      return null;
  }
}
// Function to write to the clipboard
async function writeToClipboard(text) {
  try {
      // Write text to the clipboard
      await navigator.clipboard.writeText(text);
      console.log('Text written to clipboard successfully.');
  } catch (error) {
      console.error('Error writing to clipboard:', error);
  }
}
// Usage
async function processClipboard() {
  // Get clipboard content
  const content = await getClipboardContent();
  if (content !== null) {
      // Perform replacement of {{ with ''
      const newContent = content.substring(3, content.length - 3);
      console.log("Clipboard content after replacement:", newContent);
      
      // Write new content to clipboard
      await writeToClipboard(newContent);
  } else {
      console.log("Failed to get clipboard content.");
  }
}
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

  if (currentUrl.includes("https://app.hubspot.com/design-manager/") || currentUrl.includes("https://app-eu1.hubspot.com/design-manager/")){
      // The element you want to observe
      const targetNode = document.querySelector("body");
      // Options for the observer
      const config = { childList: true, subtree: true };

      // Callback function
      const callback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (const addedNode of mutation.addedNodes){
              const copyValueButton = addedNode.querySelector('button *[data-key="DesignEditorsUI.customWidgetEditor.sidebar.copySnippetButton.valueLabel"]');
              const button = copyValueButton.closest('button');

              if(!!copyValueButton){
                const ListItem = copyValueButton.closest("li");

                const copyVariableList = createButton({
                  title: "Copy the variable name without the braces {{ }}",
                  class: "uiListItem",
                  type: "li",
                });
                copyVariableList.classList.add("private-list__item");

                const copyVariableButton = createButton({
                  class: "uiButton",
                  text: "Copy without braces",
                  type: "button",
                });
                copyVariableButton.classList.add(
                  "private-button",
                  "private-button__link",
                  "private-button--default"
                );
                
                if(button.classList.contains('private-button--disabled')){
                  copyVariableButton.classList.add(
                    "disabled",
                    "private-button--disabled"
                  );
                }

                copyVariableList.append(copyVariableButton);

                ListItem.insertAdjacentElement("afterend", copyVariableList);

                copyVariableList.addEventListener("click", () => {
                copyValueButton.click();

                // Call function to process clipboard
                processClipboard();
                });
                return;
              }
            }
          }
        }
      };

      // Create an instance of MutationObserver
      const observer = new MutationObserver(callback);

      // Observe the target element
      observer.observe(targetNode, config);
  }
});