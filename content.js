function checkOn(callback) {
    chrome.runtime.sendMessage({ action: 'isOn' }, function(response) {
        if (response.on)
            callback();
        else
            console.debug("not on, doing nothing");
    });
}

function ping() {
    chrome.runtime.sendMessage({ action: 'ping' }, function(response) {
        console.debug("got: " + JSON.stringify(response));
    });
}

checkOn(ping);
