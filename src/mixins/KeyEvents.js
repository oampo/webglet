var KeyEvents = new Class({
    initKeyEvents: function() {
        document.addEvent("keydown", this.preKeyPressed.bind(this));
        document.addEvent("keyup", this.preKeyReleased.bind(this));
    },

    preKeyPressed: function(event) {
        this.keyPressed(event.key);
    },

    keyPressed: function(key) {
    },

    preKeyReleased: function(event) {
        this.keyReleased(event.key);
    },

    keyReleased: function(key) {
    }   
});
