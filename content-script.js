console.log('aqui')

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.notification) {
        console.log("Recibido en content Script Gooood",request.notification);
    }
})