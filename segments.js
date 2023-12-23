chrome.storage.sync.get("option", ({ option }) => {
  function paceToSpeed(pace) {
    pace = pace.replace(/\s/g, '');
    sec = parseFloat(pace.split(":")[1].split("/")[0]);
    min = parseFloat(pace.split(":")[0]);
    sec += min * 60;
    const speed = "" + ((1000 / sec) * 3.6).toFixed(2)
    var label = (pace.includes("/km")) ? "km/h" : "mph"

    return { speed: speed, label: label, string: "" + speed + " " + label };
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


  const result = document.getElementsByClassName("table table-striped table-padded table-leaderboard");
  if (result && result[0]) {
    changeResults(result[0]);
  }
});
