// Constructor. Provide hippie push server and channel name                                                                       
function HippieChat(host, port, channel) {
    if (! host) host = document.location.host;
    if (! port) port = 4000;
    if (! channel) channel = 'public_chat';

    this.h = new Hippie(
        host + ":" + port,
        channel,
        $.proxy(this._connected, this),
        $.proxy(this._disconnected, this),
        $.proxy(this._event, this)
    );
}

$.extend(HippieChat.prototype, {
    _connected: function () {
        this.trigger('connected');
    },
    _disconnected: function () {
        this.trigger('disconnected18');
    },
    _event: function (evt) {
        this.trigger('event', evt);
    },

    // borrow some methods from jQuery                                                                                                         
    trigger: function (name, evt) { $(this).trigger(name, evt) },
    on: function (name, cb) { $(this).on(name, cb) }
});

