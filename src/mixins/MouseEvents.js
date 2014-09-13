var MouseEvents = {};

MouseEvents.initMouseEvents = function() {
    this.canvas.onclick = this.preMouseClicked.bind(this);
    this.canvas.onmousedown = this.preMousePressed.bind(this);
    this.canvas.onmouseup = this.preMouseReleased.bind(this);
    this.canvas.onmousemove = this.preMouseMoved.bind(this);
};

MouseEvents.preMouseClicked = function(event) {
    var position = this.getCanvasPosition();
    this.mouseClicked(event.pageX - position[0],
                      event.pageY - position[1]);
};

MouseEvents.mouseClicked = function() {
};

MouseEvents.preMousePressed = function(event) {
    var position = this.getCanvasPosition();
    this.mousePressed(event.pageX - position[0],
                      event.pageY - position[1]);
};

MouseEvents.mousePressed = function() {
};

MouseEvents.preMouseReleased = function(event) {
    var position = this.getCanvasPosition();
    this.mouseReleased(event.pageX - position[0],
                       event.pageY - position[1]);
};

MouseEvents.mouseReleased = function() {
};

MouseEvents.preMouseMoved = function(event) {
    var position = this.getCanvasPosition();
    this.mouseMoved(event.pageX - position[0],
                    event.pageY - position[1]);
};

MouseEvents.mouseMoved = function() {
};
