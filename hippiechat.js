// Constructor. Provide hippie push server and channel name                                                                       
function HippieChat(host, port, channel) {
    if (! host) host = document.location.host;
    if (! port) port = 4000;
    if (! channel) channel = 'public_chat';

    var self = this;
    
    this.h = new Hippie(
        host + ":" + port,
        channel,
        $.proxy(this._connected, this),
        $.proxy(this._disconnected, this),
        function (evt) { self._event(evt) }
    );
}

$.extend(HippieChat.prototype, {
    setChatTitle: function (title) {
        this.chatTitle = title;
        if (this.chatbox)
            this.chatbox.chatbox("option", "title", title);
    },
    
    setChatUsername: function (name) {
        this.chatUsername = name;
        if (this.chatbox)
            this.chatbox.chatbox("option", "user", chatUsername);
    },
    
    showChatbox: function () {
        if (this.chatbox) {
            this.chatbox.fadeIn();
            return;
        } 
        
        var chatbox = $(document.createElement("div"));
        this.chatbox = chatbox;
        chatbox.chatbox({
            title: this.chatTitle, 
            user: this.chatUsername,
            messageSent: $.proxy(this.messageSent, this)
        });
    },

    messageSent: function(id, user, msg) {
        this.h.send({
            'name': user,
            'chatMessage': msg
        });
    },
    
    _connected: function () {
        this.trigger('connected');
    },
    
    _disconnected: function () {
        this.trigger('disconnected');
    },
    
    _event: function (evt) {
        if (evt.chatMessage && this.chatbox && this.chatbox.chatbox) {
            this.chatbox.chatbox("option", "boxManager").addMsg(evt.name, evt.chatMessage);
        }
        this.trigger('event', evt);
    },

    // borrow some methods from jQuery                                                                                                         
    trigger: function (name, evt) { $(this).trigger(name, evt) },
    on: function (name, cb) { $(this).on(name, cb) }
});

