export const pageReload = (pageId) => {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach((tab) => {
    console.log(tab.url);
      if (tab.url.includes(pageId) && tab.url.includes("hs_preview") || tab.url.includes(pageId) && tab.url.includes("preview")) {
        chrome.tabs.reload(tab.id, { bypassCache: true });
      }
    });
  });
};