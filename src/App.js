var gl;

var App = new Class({
    Implements: Options,
    options: {
        name: 'webglet-app',
        width: 800,
        height: 600,
        frameRate: 60,
    },

    initialize: function(element, options) {
        this.setOptions(options);
        this.element = element;
        this.createCanvas();
        this.frameCount = 0;
    },

    createCanvas: function() {
        this.canvas = new Element('canvas', {'id': this.options.name,
                                             'width': this.options.width,
                                             'height': this.options.height});
        try {
            gl = this.canvas.getContext('experimental-webgl');
            if (this.options.debug) {
                gl = WebGLDebugUtils.makeDebugContext(gl);
            }
            gl.viewport(0, 0, this.options.width, this.options.height);
        }
        catch (error) {
        }

        if (gl) {
            this.canvas.inject(this.element);
            this.canvas.addEvent("click", this.preMouseClicked.bind(this));
            this.canvas.addEvent("mousedown", this.preMousePressed.bind(this));
            this.canvas.addEvent("mouseup", this.preMouseReleased.bind(this));
            this.canvas.addEvent("mousemove", this.preMouseMoved.bind(this));
        }
        else {
            var alertDiv = new Element('div', {'class': 'webglet-alert'});
            alertDiv.set('text', 'WebGL not enabled');
            alertDiv.inject(this.element);
        }
    },

    preDraw: function() {
        this.frameCount += 1;
        this.draw();
    },

    draw: function() {
    },

    run: function() {
        this.preDraw.periodical(1000 / this.options.frameRate, this);
    },

    clear: function(color) {
        gl.clearColor(color[0], color[1], color[2], color[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);
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

