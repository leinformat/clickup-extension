export const copyToClick = async (data,node) => {
const comment = `<p><strong>Client: </strong>${data.client} | ${data.subClient}</p>
                 <p><strong>URL: </strong>${data.url}</p>
                 <p><strong>Responsible: </strong>@${data.qa}</p>
                 <p><strong>Deliver date: </strong>Today or  Tomorrow, please :handshake:</p>
                 <p><strong>PM: <strong>@${data.pm}</p>`;
//const comment = `<strong>Client:</strong> ${data.client} | ${data.subClient}\nURL:${data.url}\n<strong>Responsible:</strong> @${data.qa}\n<strong>Deliver date:</strong>  Today or  Tomorrow, please :handshake:\n<strong>PM:<strong> @${data.pm}`;
  try {
    const blobHtml = new Blob([comment], { type: "text/html" });
    const blobText = new Blob([comment], { type: "text/plain" });
    const data = [new ClipboardItem({
        ["text/plain"]: blobText,
        ["text/html"]: blobHtml,
    })];

    await navigator.clipboard.write(data);
    
    node.classList.remove('fa-beat')
    node.closest('.clickup-extension__copy-container').classList.add('copy--ok');
    setTimeout(() => {
      node.closest('.clickup-extension__copy-container').classList.remove('copy--ok');
    },200);
  } catch (error) {
    console.log("We've been an Error to copy Comment: "+error);
  }
};