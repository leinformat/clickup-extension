export const goToPage = ({ path }) =>{
  if (!path) {
    console.log("No path provided");
    return;
  }
  const uploadThemeUrl = chrome.runtime.getURL(path);
  chrome.tabs.create({ url: uploadThemeUrl });
}