export const copyToClick = async (data,node) => {
const comment = `Client: ${data.client} | ${data.subClient}\nURL:${data.url}\nResponsible: @${data.qa}\nDeliver date:  Today or  Tomorrow, please :handshake:\nPM: @${data.pm}`;
  try {
    await navigator.clipboard.writeText(comment);
    node.classList.remove('fa-beat')
    node.closest('.clickup-extension__copy-container').classList.add('copy--ok');
    setTimeout(() => {
      node.closest('.clickup-extension__copy-container').classList.remove('copy--ok');
    },200);
  } catch (error) {
    console.log(error);
  }
};