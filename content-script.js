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

const createButton = (data) =>{
  const button = document.createElement(data.type);
  button.classList.add(data.class);
  button.href = data.url;
  button.textContent = data.text;

  return button;
}

const getPageId = (url) => {
  const match = url.match(/\/editor\/(\d+)/);
  const pageId = match[1];
  return pageId;
};

window.addEventListener("load", (e) => {
  const currentUrl = window.location.href;
  if (currentUrl.includes("https://app.hubspot.com/pages/") && !currentUrl.includes("developerMode=true") || currentUrl.includes("https://app.hubspot.com/blog/")) {
    const bodyContainer = document.body;
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("container--developer-mode");

    // Developer Mode Button
    const dvmButton = createButton({
      url: `${currentUrl}?developerMode=true`,
      class:"button--developer-mode",
      text: "Developer Mode",
      type: 'a'
    });

    // Live Reload Button
    const liveReload = createButton({
      url: "javascript:;",
      class:"button--live-reload",
      text: "Live Reload",
      type: 'a'
    });

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


    buttonContainer.append(dvmButton);
    buttonContainer.append(liveReload);
    bodyContainer.prepend(buttonContainer);
  }
});

document.addEventListener("keydown", function (event) {
  const currentUrl = window.location.href;
  if (event.ctrlKey){
    if (event.key.toLowerCase() === 's') {
      event.preventDefault();
      event.stopPropagation();
      // Control + s
      if (currentUrl.includes("https://app.hubspot.com/pages/") || currentUrl.includes("https://app.hubspot.com/global-content/")) {
        const pageId = getPageId(currentUrl);
        const buttonReload = document.querySelector('.button--live-reload');
        if (!!buttonReload) {
          const image = chrome.runtime.getURL("images/loader2.gif");
          buttonReload.classList.add("reload");
          buttonReload.style.backgroundImage = `url(${image})`;
        }
        console.log('yes',pageId)
        // Delay 2 seconds
        setTimeout(() => {
          // Send message to background
          chrome.runtime.sendMessage({ pageToreload: pageId });
          if (!!buttonReload) {
            buttonReload.style.backgroundImage = "none";
            buttonReload.classList.remove("reload");
          }
        }, 2000);
      }
    }
  }
});