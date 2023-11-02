export const copyToSlack = async (data,node) => {
const comment = `<p><strong>Client: </strong>${data.client} | ${data.subClient}</p>
                 <p><strong>URL: </strong>${data.url}</p>
                 <p><strong>Responsible: </strong>@${data.qa}</p>
                 <p><strong>Deliver date: </strong>Today or  Tomorrow, please :handshake:</p>
                 <p><strong>PM: <strong>@${data.pm}</p>`;
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

export const copyEstimation = async (data,node) => {
  const comment = `<p><strong>Hi: </strong><button data-test="mention" data-user="${data.pmId}" data-name="${data.pm}">@${data.pm}</button></p>
                   <p><strong>ACCEPTED: </strong>Yes</p>
                   <p><strong>ADD TO CALENDAR: </strong>Yes</p>
                   <p><strong>THE DIVISION NEEDED: </strong>N/A</p>
                   <p><strong>Q.A  ASSIGNED: </strong><button data-test="mention" data-user="${data.qaId}" data-name="${data.qa}">@${data.qa}</button></p>
                   <p><strong>DUE DATE TO DELIVER TO QA: </strong>${data.dueDate} COP time</p>`;
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

export const copydeliverToQA = async (data,node) => {
    const comment = `<p><strong>Hi: </strong><button data-test="mention" data-user="${data.pmId}" data-name="${data.pm}">@${data.pm}</button> and <button data-test="mention" data-user="${data.qaId}" data-name="${data.qa}">@${data.qa}</button></p>
                     <p><strong>URL: </strong></p><br>
                     <p><strong>WHAT I DID: </strong></p><br>
                     <p><strong>OMIT: </strong></p><br>
                     <p><strong>LIMITATION: </strong></p><br>
                     <p><strong>FILES ATTACHED: </strong></p><br>
                     <p><strong>FOR Q.A: </strong></p>
                     <p>VIDEO:</p>
                     <p><strong>ACTION REQUIRED: </strong></p>
                     <p><button data-test="mention" data-user="${data.pmId}" data-name="${data.pm}">@${data.pm}</button> please deliver the task after Q.A is approved.</p>`;
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

  /*

Hi  @Sebastián Vega and @Daniel Melan 
URL:

WHAT I DID:

OMIT: 

LIMITATION: 

FILES ATTACHED: 

FOR Q.A:

VIDEO:

ACTION REQUIRED:
@Sebastián Vega please deliver the task after Q.A is approved.
*/