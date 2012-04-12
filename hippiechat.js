// Constructor. Provide hippie push server and channel name                                                                       
function HippieChat(host, port, channel) {
    if (! host) host = document.location.host;
    if (! port) port = 4000;
    if (! channel) channel = 'public_chat';
    var hostLocation = "ws://" + host + ":" + port;

    var self = this;
    
    var h = new Hippie.Pipe();
    this.h = h;
    h.args = channel;
    $(h)
        .bind("connected", $.proxy(this._connected, this))
	.bind("disconnected", $.proxy(this._disconnected, this))
        .bind("event", $.proxy(this._event, this));
    h.init({ 'host': hostLocation });
}

$.extend(HippieChat.prototype, {
    sendEvent: function (evt) {
        return this.h.send(evt);
    },
    
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
    
    addChatMessage: function (user, msg) {
        if (msg && this.chatbox && this.chatbox.chatbox) {
            this.chatbox.chatbox("option", "boxManager").addMsg(user, msg);
        }
    },

    messageSent: function(id, user, msg) {
        this.h.send({
            'name': user,
            'chatMessage': msg
        });
    },
    
    _connected: function () {
        this.sendEvent({
            'user': this.chatUsername,
            chatEnter: 1
        });
        this.trigger('connected');
    },
    
    _disconnected: function () {
        this.addChatMessage("", "Chat ended");
        this.trigger('disconnected');
    },
    
    _event: function (jevt, hevt) {
        if (hevt.chatEnter && hevt.user && hevt.user != this.chatUsername) {
            this.addChatMessage(null, "Chat session started with " + hevt.user + ".");
        }

        if (evt.chatMessage) {
            this.addChatMessage(hevt.name, hevt.chatMessage);
        }
        
        this.trigger('event', hevt);
    },

    // borrow some methods from jQuery                                                                                                         
    trigger: function (name, evt) { $(this).trigger(name, evt) },
    on: function (name, cb) { $(this).on(name, cb) }
});

