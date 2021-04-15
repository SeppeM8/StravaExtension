var dropDown = document.getElementById("option");

if (dropDown) {
    chrome.storage.sync.get("option", ({option}) => {

        var add = document.createElement("option");
        add.value = "Add";
        add.text = chrome.i18n.getMessage("option_add");
        add.title = chrome.i18n.getMessage("option_add_description");
        dropDown.appendChild(add)

        var replace = document.createElement("option");
        replace.value = "Replace";
        replace.text = chrome.i18n.getMessage("option_replace");
        replace.title = chrome.i18n.getMessage("option_replace_description");
        dropDown.appendChild(replace)

        var tooltip = document.createElement("option");
        tooltip.value = "Tooltip";
        tooltip.text = chrome.i18n.getMessage("option_tooltip");
        tooltip.title = chrome.i18n.getMessage("option_tooltip_description");
        dropDown.appendChild(tooltip)
        
        dropDown.value = option;
    });
}

dropDown.addEventListener("change", () => {
    chrome.storage.sync.set({option: dropDown.value});
});