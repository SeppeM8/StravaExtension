chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({"option": "Add"}, function(data) {
    chrome.storage.sync.set(data, function() {
    });
  });
});