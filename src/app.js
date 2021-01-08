var vec2 = require('gl-matrix').vec2;
var WebGLDebugUtils = require('webgl-debug/webgl-debug');

var util = require('./util');

var App = function(options) {
    options = options || {};
    this.canvas = options.canvas;
    var contextAttributes = options.contextAttributes || {};
    try {
        global.gl = (this.canvas.getContext("webgl", contextAttributes) ||
                     this.canvas.getContext('experimental-webgl',
                                            options.contextAttributes));
        gl = util.monkeyPatchViewport(gl);
        if (options.debug) {
            gl = WebGLDebugUtils.makeDebugContext(gl);
        }
    }
    catch (error) {
        gl = null;
    }
};

App.prototype.updateViewport = function() {
    if (this.canvas.clientWidth && this.canvas.clientHeight &&
        (this.canvas.width != this.canvas.clientWidth ||
        this.canvas.height != this.canvas.clientHeight)) {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
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
