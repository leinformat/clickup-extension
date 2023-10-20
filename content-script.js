(async () => {
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
      console.log(message);
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
})();

window.addEventListener('load', (e)=> {
const currentUrl = window.location.href;
  if (currentUrl.includes("https://app.hubspot.com/pages/") && !currentUrl.includes("developerMode=true")){
    const buttonContainer = document.body;
    console.log(buttonContainer);
    const dvmButton = document.createElement("a");
    dvmButton.classList.add('button--developer-mode','private-button','private-button--secondary--ghost','private-button--sm');
    dvmButton.href = `${currentUrl}?developerMode=true`;
    dvmButton.textContent = 'Developer Mode';
    buttonContainer.prepend(dvmButton);
  }
});

document.addEventListener('keydown', function(event) {
  const currentUrl = window.location.href;
  if (event.ctrlKey && event.keyCode === 83) {
    if (currentUrl.includes("https://app.hubspot.com/pages/")) {
        const match = currentUrl.match(/\/editor\/(\d+)/);
        const pageId =match[1];
        
        // Delay 2 seconds
        setTimeout(() => {
          // Send message to background
          chrome.runtime.sendMessage({ pageToreload: pageId });
        }, 2000); 
    }
  }
});