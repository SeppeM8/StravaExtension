
chrome.storage.sync.get("option", ({option}) => {
  function paceToSpeed(pace) {
    pace = pace.replace(/\s/g, '');
    sec = parseFloat(pace.split(":")[1].split("/")[0]);
    min = parseFloat(pace.split(":")[0]);
    sec += min*60;    
    const speed = "" + ((1000/sec)*3.6).toFixed(2)
    var label = (pace.includes("/km")) ? "km/h" : "mph"

    return {speed: speed, label: label, string: "" + speed + " " + label};
  }
  
  function changeCard(card) {
    const list = card.getElementsByClassName("list-stats")[0];
    const paceDiv = list.getElementsByClassName("stat")[1];
    const pace = paceDiv.getElementsByClassName("stat-text")[0].outerText;
    if (pace.includes("/km") || pace.includes("/mi")) {
  
      if (option === "Tooltip") {
        paceDiv.title = paceToSpeed(pace).string;
      } else if (option === "Add"){
        const speed = paceDiv.cloneNode(true);
        speed.getElementsByClassName("stat-subtext")[0].innerText = chrome.i18n.getMessage("speed");
        speed.getElementsByClassName("stat-text")[0].innerText = paceToSpeed(pace).string;
        const li = document.createElement("li");
        li.appendChild(speed);
        list.appendChild(li);
      } else if (option === "Replace") {      
        paceDiv.getElementsByClassName("stat-subtext")[0].innerText = chrome.i18n.getMessage("speed");
        paceDiv.getElementsByClassName("stat-text")[0].innerText = paceToSpeed(pace).string;
      }
    }
  }

  function changeListStats(list) {
    const paceLi = list.getElementsByTagName("li")[1];
    const pace = paceLi.outerText;
    if (pace.includes("/km") || pace.includes("/mi")) {
      if (option === "Tooltip") {
        paceLi.title = paceToSpeed(pace).string;
      } else if (option === "Add"){
        const speed = paceLi.cloneNode(true);
        speed.innerText = paceToSpeed(pace).string;
        speed.title = chrome.i18n.getMessage("speed");
        list.insertBefore(speed, list.getElementsByTagName("li")[2]);
      } else if (option === "Replace") {      
        paceLi.title = chrome.i18n.getMessage("speed")
        paceLi.innerText = paceToSpeed(pace).string;
      }
    }
  }

  function changeSection(section) {
    const paceLi = section.getElementsByTagName("li")[2];
    const pace = paceLi.innerText.split(".")[0];
    const speed = paceToSpeed(pace)
    if (option == "Tooltip") {
      paceLi.title = speed.string;
    } else if (option == "Add") {
      const speedLi = paceLi.cloneNode(true)
      const strong = speedLi.getElementsByTagName("STRONG")[0]
      strong.innerHTML = speed.speed + '\n<abbr class="unit">' + speed.label + '</abbr>';
      speedLi.getElementsByClassName("glossary-link run-version")[0].innerHTML = "\n"+chrome.i18n.getMessage("speed")+"\n"
      section.appendChild(speedLi);
    } else if (option == "Replace") {
      const strong = paceLi.getElementsByTagName("STRONG")[0]
      strong.innerHTML = speed.speed + '\n<abbr class="unit">' + speed.label + '</abbr>';
      paceLi.getElementsByClassName("glossary-link run-version")[0].innerHTML = "\n"+chrome.i18n.getMessage("speed")+"\n"
    }
  }

  function changeTable(table, map) {
    const rowCount = table.getElementsByTagName("TR")[0].childElementCount+1;
    if (option == "Replace") {
      table.getElementsByTagName("THEAD")[0].getElementsByClassName("glossary-link run-version")[0].innerText = chrome.i18n.getMessage("speed");
    } else if (option == "Add") {
      const header = table.getElementsByTagName("THEAD")[0]
      const speedHeader = header.getElementsByTagName("TH")[1].cloneNode(true);
      speedHeader.innerText = chrome.i18n.getMessage("speed");
      header.getElementsByTagName("TR")[0].insertBefore(speedHeader, header.getElementsByTagName("TH")[2])

      const container = document.getElementById("splits-container")
      container.style.width = "" + (8*rowCount) + "%";
      for (cel of container.getElementsByTagName("TD")) {
        cel.style.width = "" + (100/rowCount) + "%";
      }
      for (cel of container.getElementsByTagName("TH")) {
        cel.style.width = "" + (100/rowCount) + "%";
      }
      map.style.width = "" + (100 - 8*rowCount) + "%";
    }

    const rows = table.getElementsByTagName("TBODY")[0].getElementsByTagName("TR")
    for (row of rows) {
      const paceTd = row.getElementsByTagName("TD")[1];
      const speed = paceToSpeed(paceTd.innerText);
      if (option === "Tooltip") {
        paceTd.title = speed.string;
      } else if (option == "Add") {
        const speedTd = paceTd.cloneNode()
        speedTd.innerHTML = speed.speed + '\n<abbr class="unit">' + speed.label + '</abbr>';
        row.insertBefore(speedTd, row.getElementsByTagName("TD")[2]);
      } else if (option == "Replace") {
        paceTd.innerHTML = speed.speed + '\n<abbr class="unit">' + speed.label + '</abbr>';
      }
    }
  }

  function changeYAxis(axe) {
    if (option === "Replace") {
      for (row of axe.getElementsByClassName("tick")) {
        const text = row.getElementsByTagName("text")[0];
        text.innerHTML = paceToSpeed(text.innerHTML).string;
      }
    }
  }

  function changeResults(table) {

    if (option == "Replace") {
      table.getElementsByTagName("THEAD")[0].getElementsByTagName("TH")[3].innerText = chrome.i18n.getMessage("speed");
    } else if (option == "Add") {
      const header = table.getElementsByTagName("THEAD")[0]
      const speedHeader = header.getElementsByTagName("TH")[1].cloneNode(true);
      speedHeader.innerText = chrome.i18n.getMessage("speed");
      header.getElementsByTagName("TR")[0].insertBefore(speedHeader, header.getElementsByTagName("TH")[4]);
    }

    for (row of table.getElementsByTagName("TBODY")[0].getElementsByTagName("TR")) {
      const paceTd = row.getElementsByTagName("TD")[3]
      const speed = paceToSpeed(paceTd.innerText);
      if (option === "Tooltip") {
        paceTd.title = speed.string;
      } else if (option == "Add") {
        const speedTd = paceTd.cloneNode()
        speedTd.innerHTML = speed.speed + '\n<abbr class="unit">' + speed.label + '</abbr>';
        row.insertBefore(speedTd, row.getElementsByTagName("TD")[4]);
      } else if (option == "Replace") {
        paceTd.innerHTML = speed.speed + '\n<abbr class="unit">' + speed.label + '</abbr>';
      }
    }
  }


  // /dashboard
  for (card of document.getElementsByClassName("activity feed-entry card")) {
    changeCard(card);
  }

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.tagName === "DIV" && node.classList.value === "activity feed-entry card") {
          changeCard(node);
        }
      });
    })
  })
  
  const config = { attributes: false, childList: true, characterData: false };

  const feed = document.getElementsByClassName("feed")[0];
  if (feed) {
    observer.observe(feed, config);
  }


  // /athletes
  for (list of document.getElementsByClassName("inline-stats list-stats")) {
    changeListStats(list);
  }

  var athletesObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.tagName === "DIV") {
          for (activity of node.getElementsByClassName("activity entity-details feed-entry")) {
            changeListStats(activity.getElementsByClassName("inline-stats list-stats")[0])
          }          
        }
      });
    })
  })

  const intervalRides = document.getElementById("interval-rides");
  if (intervalRides) {
    athletesObserver.observe(intervalRides, config);
  }


  // /activities
  for (section of document.getElementsByClassName("inline-stats section")) {
    changeSection(section);
  }

  var splitsObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.tagName === "DIV") {
          const table = node.getElementsByTagName("TABLE")[0];
          if (table) {
            changeTable(table, document.getElementsByClassName("border-left map spans12")[0]);
          }
        }
      });
    });
  });

  const splits = document.getElementById("splits-container"); // Als splits na script laadt
  if (splits) {
    splitsObserver.observe(splits, config);
  }
  
  const table = splits.getElementsByTagName("TABLE"); // Als splits voor script geladen is
  if (table && table[0]) {
      changeTable(table[0], document.getElementsByClassName("border-left map spans12")[0]);
  }

  var elevationObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.id === "yaxis2") {
          changeYAxis(node);
        }
      })
    })
  })


  const graph = document.getElementById("elevation-chart");
  if (graph) {
    elevationObserver.observe(graph.childNodes[0], config);
  }
  


  // /segments

  const result = document.getElementsByClassName("table table-striped table-padded table-leaderboard");
  if (result && result[0]) {
    changeResults(result[0]);
  }
});

