
const test = async() =>{
    try {
      const req = await fetch('https://api.clickup.com/api/v2/team/6909093/task?subtasks=true', {
        method: "GET",
        headers: {
          Authorization: 'pk_43629781_B80XF63D0EETYTHFLM2CBIVCZ8JMUW7I',
        },
      });
  
      const response = await req.json();
  
      console.log(response);
  
    }catch(err){
      console.log(err);
    }
  }
  //test()

const pasteButton = document.querySelector('button');
const pasteArticle = document.querySelector('div');

pasteButton.addEventListener('click', async (event) => {
    //pasteArticle.textContent = '';
    // using 'await' to easily resolve the result of the promise
    const data = await navigator.clipboard.read();
    // data is an array of clipboard items
    // the actual clipboard content is in the first element.
    const clipboardContent = data[0]
    // clipboardContent could be an image or text
    try{
        // assuming the clipboard content is an image
        const imgBlob = await clipboardContent.getType('image/png')
        // retrieving the url for our blob
        const blobUrl = window.URL.createObjectURL(imageBlob);
        // load the blob into an image tag
        const img = document.createElement('img');
        img.setAttribute('src', blobUrl);
        // append the image element to pasteArticle
        pasteArticle.appendChild(img)
    }catch(err){
        console.log(err);
        // clipboard has text data
        // set pasteArticle to textContent
        const text = await navigator.clipboard.readText();
        pasteArticle.textContent = text;
    }
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




    const funtionality = () =>{
    console.log('Nuevo Nodo');
  }
  const regex = /design-manager\/(\d+)/;
  const match = currentUrl.match(regex);

  if (match && match[1]) {
      // Selecciona el div que deseas observar
      var targetDiv = document.querySelector('.private-tabs__list');

      // Crea una instancia de MutationObserver y proporciona una función de devolución de llamada
      var observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
              const modulesRegex = /design-manager\/(\d+)\/modules/;
              // Verifica si se agregaron nodos al div
              if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                if (!!currentUrl.match(modulesRegex)) {
                  console.log(currentUrl.match(modulesRegex))
                }
                
                funtionality();
              }
          });
      });

      // Configura el observador para observar cambios en la estructura del DOM
      var config = { childList: true };
      observer.observe(targetDiv, config);
  }
    */