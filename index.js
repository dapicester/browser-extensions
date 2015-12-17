// Enable console logging.
require("sdk/preferences/service").set("extensions.sdk.console.logLevel", "all");

var self = require('sdk/self');
var tabs = require("sdk/tabs");
var pageWorkers = require("sdk/page-worker");
var { ToggleButton } = require("sdk/ui/button/toggle");
var prefs = require("sdk/simple-prefs").prefs;

// on/off state of the extension
var isOn = prefs["state"] || true;

var button = ToggleButton({
    id: 'foobar',
    label: 'Foobar button',
    icon: {
        "19": "./icon.png"
    },
    checked: isOn,
    onChange: function(state) {
        console.log("toggled to "+state.label+"=>"+state.checked);
        isOn = state.checked;
        prefs["state"] = isOn;
        // TODO: emit for the workers?
    }
});

tabs.on("ready", function(tab) {
    console.log("attaching content script to tab "+tab.url);
    var worker = tab.attach({
        contentScriptFile: self.data.url("content_script.js")
    });
    worker.port.on("message", function(message) {
        handleMessageFor(worker, message);
    });
});

function handleMessageFor(worker, message) {
    var event = "message_"+message.id;
    switch(message.payload.action) {
    case "isOn":
        worker.port.emit(event, { on: isOn });
        break;
    case "ping":
        worker.port.emit(event, { action: "pong" });
        break;
    default:
        worker.port.emit(event, { action: "boh" });
    }
}
