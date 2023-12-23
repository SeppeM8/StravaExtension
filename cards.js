chrome.storage.sync.get("option", async ({option}) => {
  function paceToSpeed(pace) {
    pace = pace.replace(/\s/g, '');
    sec = parseFloat(pace.split(":")[1].split("/")[0]);
    min = parseFloat(pace.split(":")[0]);
    sec += min*60;    
    const speed = "" + ((1000/sec)*3.6).toFixed(2)
    var label = (pace.includes("/km")) ? "km/h" : "mph"

    return {speed: speed, label: label, string: "" + speed + " " + label};
  }


function editCard(card) {
  const listItems = card.getElementsByTagName("LI");
  for (var item of listItems) {
    if (item.outerText.includes("/km") || item.outerText.includes("mph")) {
      const paceDiv = item.childNodes[0].childNodes[1];
      if (paceDiv) {
        const pace = paceDiv.innerText;          
          if (option === "Tooltip") {
            paceDiv.title = paceToSpeed(pace).string;
          } else if (option === "Add"){
            const speed = item.cloneNode(true);
            speed.childNodes[0].childNodes[0].innerText = chrome.i18n.getMessage("speed");
            speed.childNodes[0].childNodes[1].innerText = paceToSpeed(pace).string;
            item.parentNode.appendChild(speed);
          } else if (option === "Replace") { 
            paceDiv.parentNode.childNodes[0].innerText = chrome.i18n.getMessage("speed");
            paceDiv.innerText = paceToSpeed(pace).string;
          }
      }
    }
  }
}


const selector = "------packages-feed-ui-src-components-media-Card-Card__feed-entry--WKvAQ";

// Initial loaded cards

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(async node => {
      if (node.classList && node.classList.contains(selector)) {
        editCard(node);
      } else if (node.childNodes.length > 0 && node.childNodes[0].childNodes.length > 0) {
        const card = node.childNodes[0].childNodes[0];
        if (card.classList && card.classList.contains(selector)) {
          editCard(card);
        }
      } else if (node.classList && node.classList.contains("content")) { // Athlete page
        
        const feedUi = await waitForElm(".feed-ui");

        feedUi.childNodes.forEach(async feedNode => {
          if (feedNode.childNodes.length > 0 && feedNode.childNodes[0].childNodes.length > 0) {
            const card = feedNode.childNodes[0].childNodes[0];
            if (card.classList && card.classList.contains(selector)) {
              editCard(card);
            }
          }
        });
      }
    });
  });
});


observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Cards loaded after scrolling


function waitForElm(selector) {
  return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
          if (document.querySelector(selector)) {
              observer.disconnect();
              resolve(document.querySelector(selector));
          }
      });

      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
}


const feedUi = await waitForElm(".feed-ui");

observer.observe(feedUi, {
  childList: true,
  subtree: true
});

const content = await waitForElm(".tab-content");

observer.observe(content, {
  childList: true,
  subtree: true
});

});
