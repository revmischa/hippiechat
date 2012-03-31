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
    showChatbox: function () {
        if (this.chatbox) {
            this.chatbox.fadeIn();
            return;
        } 
        
        var chatbox = $(document.createElement("div"));
        this.chatbox = chatbox;
        
        chatbox.chatbox({
            title : "test chat", 
            messageSent : function(id, user, msg) {
                console.log(id + " said: " + msg);
                chatbox.chatbox("option", "boxManager").addMsg(id, msg);
            }
        });
    },
    
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

