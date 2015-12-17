var ffox = {
    _counter: 1,
    sendMessage: function(payload, callback) {
        id = ++this._counter;
        self.port.on('message_'+id, callback);
        self.port.emit('message', { id: id, payload: payload });
    }
};

function checkOn(callback) {
    ffox.sendMessage({ action: 'isOn' }, function(response) {
        if (response.on)
            callback();
        else
            console.log("C: not on, doing nothing");
    });
}

function ping() {
    ffox.sendMessage({ action: 'ping' }, function(response) {
        console.log("C: got: " + JSON.stringify(response));
    });
}

checkOn(ping);
