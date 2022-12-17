async function blockBody(id) {
  await chrome.scripting.executeScript({
    target: { tabId: id },
    func: block,
  });
}

function block() {
  chrome.storage.local.get("isBlocked").then((data) => {
    console.log(data);
    if (data?.isBlocked) {
      document.body.innerHTML =
        '<div style="display: flex;justify-content: center;align-items: center;width: 100vw;height: 100vh;  background-color: rgb(215, 215, 215) !important;"> <h1>Please focus on your work.</h1> </div>';
    }
  });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  try {
    chrome.storage.local.get("url").then((data) => {
      let urls = data.url || [];
      const tabUrl = new URL(tab.url).hostname;
      console.log(urls.includes(tabUrl));
      if (urls.includes(tabUrl)) {
        blockBody(tabId);
      }
    });
  } catch (error) {
    console.log(error);
  }
});
chrome.storage.onChanged.addListener(function (changes, area) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.storage.local.get("url").then((data) => {
      let urls = data.url || [];
      const tabUrl = new URL(tabs[0].url).hostname;
      console.log(urls.includes(tabUrl));
      if (urls.includes(tabUrl)) {
        blockBody(tabs[0].id);
      }
    });
  });
});
