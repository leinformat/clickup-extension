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
                  <p><span class="task__bold">Task Status:</span> ${ item.status.status }</p>
                  <p>
                    <span class="task__bold">Task Name:</span>
                    <span><a target="__blank" href="${item.url}">${ item.name }</a></span> 
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
      soundNotification();
    }
  });
})();