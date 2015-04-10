var WebGLDebugUtils = require('../lib/webgl-debug/webgl-debug').WebGLDebugUtils;

var App = function(options) {
    this.canvas = options.canvas;
    try {
        gl = (this.canvas.getContext("webgl") ||
                   this.canvas.getContext('experimental-webgl'));
        if (options.debug) {
            gl = WebGLDebugUtils.makeDebugContext(gl);
        }
    }
    catch (error) {
        gl = null;
    }

    this.frameCount = 0;
    this.paused = true;
};

App.prototype.preDraw = function() {
    this.frameCount += 1;

    if (this.canvas.width != this.canvas.offsetWidth ||
        this.canvas.height != this.canvas.offsetHeight) {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    this.draw();
    if (!this.paused) {
        requestAnimationFrame(this.preDraw.bind(this), this.canvas);
    }
};

App.prototype.draw = function() {
};

App.prototype.update = function() {
};

App.prototype.run = function() {
    // Run the update loop
    this.interval = setInterval(this.update.bind(this), 1000 /60);
    // Run the render loop
    requestAnimationFrame(this.preDraw.bind(this));

    this.paused = false;
};

App.prototype.pause = function() {
    // Stop the update loop and set the paused flag
    if (this.interval != null) {
        clearInterval(this.interval);
        this.interval = null;
    }
    this.paused = true;
};

App.prototype.getCanvasPosition = function() {
    var position = vec2.create();
    var object = this.canvas;
    do {
        vec2[0] += object.offsetLeft;
        vec2[1] += object.offsetTop;
    } while (object = object.offsetParent);
    return position;
};

exports.App = App;
