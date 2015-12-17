// on/off state of the extension.
var isOn = localStorage.getItem("state") || false;

// Icons to be used for the on/off states.
var icons = {
    true: "icon.png",
    false: "icon_off.png"
};

// Toggle or set the on/off state.
function toggleOn(state) {
    if (state === undefined) state = !isOn;

    console.debug("toggling state to " + state);
    isOn = state;
    localStorage.setItem("state", isOn);

    // Set the proper icon on all the tabs.
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.browserAction.setIcon({
                path: icons[isOn],
                tabId: tab.id
            });
        });
    });
}

// Restore on/off state from the local storage.
function restoreOn() {
    var state = localStorage.getItem("state");
    if (state !== null) {
        console.debug("restoring previous state: " + state);
        toggleOn(state);
    }
}

chrome.runtime.onInstalled.addListener(function() {
    // Enable on install.
    toggleOn(true);
});

chrome.runtime.onStartup.addListener(function() {
    // Restore state on startup.
    restoreOn();
});

chrome.tabs.onCreated.addListener(function() {
    // Restore state on new tab.
    restoreOn();
});

chrome.browserAction.onClicked.addListener(function() {
    // Toggle state on click.
    toggleOn();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.action) {
    case "isOn":
        sendResponse({ on: isOn });
        break;
    case "ping":
        sendResponse({ message: "pong" });
        break;
    default:
        sendResponse({ message: "boh" });
    }
});

