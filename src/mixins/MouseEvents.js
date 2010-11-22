var MouseEvents = new Class({
    initMouseEvents: function() {
        this.canvas.addEvent("click", this.preMouseClicked.bind(this));
        this.canvas.addEvent("mousedown", this.preMousePressed.bind(this));
        this.canvas.addEvent("mouseup", this.preMouseReleased.bind(this));
        this.canvas.addEvent("mousemove", this.preMouseMoved.bind(this)); 
    },
   
    preMouseClicked: function(event) {
        var position = this.canvas.getPosition();
        this.mouseClicked(event.page.x - position.x,
                          event.page.y - position.y);
    },

    mouseClicked: function(mouseX, mouseY) {
    },

    preMousePressed: function(event) {
        var position = this.canvas.getPosition();
        this.mousePressed(event.page.x - position.x,
                          event.page.y - position.y);
    },

    mousePressed: function(mouseX, mouseY) {
    },

    preMouseReleased: function(event) {
        var position = this.canvas.getPosition();
        this.mouseReleased(event.page.x - position.x,
                           event.page.y - position.y);
    },

    mouseReleased: function(mouseX, mouseY) {
    },

    preMouseMoved: function(event) {
        var position = this.canvas.getPosition();
        this.mouseMoved(event.page.x - position.x,
                        event.page.y - position.y);
    },

    mouseMoved: function(mouseX, mouseY) {
    }
});
