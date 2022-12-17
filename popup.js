const switchButton = document.getElementById("switch");
const urlInput = document.getElementById("url-input");
function handleClick() {
  if (this.checked) {
    chrome.storage.local.set({ isBlocked: true });
  } else {
    chrome.storage.local.set({ isBlocked: false });
  }
}
switchButton.addEventListener("change", handleClick);

chrome.storage.local.get("isBlocked").then((data) => {
  if (data.isBlocked === true) {
    switchButton.checked = true;
  } else {
    switchButton.checked = false;
  }
});
// console.log(chrome.tabs);

function submitHandler() {
  try {
    const url = new URL(urlInput.value);
    chrome.storage.local.get("url").then(async (data) => {
      let urls = data.url || [];
      console.log(urls);
      urls.push(url.hostname);
      await chrome.storage.local.set({ url: urls });
      document.getElementById("error").style.display = "none";
    });
  } catch (error) {
    document.getElementById("error").style.display = "block";
    console.log(error);
  }
}
document.getElementById("submit").addEventListener("click", submitHandler);

function appendBlocklist() {
  chrome.storage.local.get("url").then((data) => {
    let urls = data.url || [];
    const myNode = document.getElementById("block-list");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.lastChild);
    }
    urls.forEach((url, index) => {
      const p = document.createElement("p");
      p.innerText = url;
      p.id = index;
      p.classList.add("block-list-item");
      p.addEventListener("click", deleteUrl);
      myNode.appendChild(p);
    });
  });
}
appendBlocklist();

chrome.storage.onChanged.addListener(function (changes, area) {
  appendBlocklist();
});

function deleteUrl(e) {
  chrome.storage.local.get("url").then((data) => {
    let urls = data.url || [];
    if (urls.includes(e.target.innerText)) {
      urls.splice(e.target.id, 1);
    }
    chrome.storage.local.set({ url: urls });
  });
}
