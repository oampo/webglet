var gl;

// Shim for subarray/slice
var Int8Array, Uint8Array, Int16Array, Uint16Array;
var Int32Array, Uint32Array, Float32Array, Float64Array;
var types = [Int8Array, Uint8Array, Int16Array, Uint16Array,
             Int32Array, Uint32Array, Float32Array, Float64Array];
var original, shim;
for (var i = 0; i < types.length; ++i) {
    if (types[i]) {
        if (types[i].prototype.slice === undefined) {
            original = "subarray";
            shim = "slice";
        }
        else if (types[i].prototype.subarray === undefined) {
            original = "slice";
            shim = "subarray";
        }
        Object.defineProperty(types[i].prototype, shim, {
            value: types[i].prototype[original],
            enumerable: false
        });
    }
}


var App = function(element, options) {
    this.options = {
        name: 'webglet-app',
        width: 800,
        height: 600,
        frameRate: 60
    };
    for (var option in options) {
        this.options[option] = options[option];
    }
    this.element = element;
    this.createCanvas();
    this.frameCount = 0;
};

App.prototype.createCanvas = function() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    this.canvas.id = this.options.name;
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
        this.element.appendChild(this.canvas);
    }
    else {
        var alertDiv = document.createElement('div');
        var alertString = '<strong>WebGL not enabled</strong><br/>For ' +
            'instructions on how to get a WebGL enabled browser <a ' +
            'href="http://www.khronos.org/webgl/wiki/' +
            'Getting_a_WebGL_Implementation">click here</a>';
        alertDiv.innerHTML = alertString;
        this.element.appendChild(alertDiv);
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].src;
            if (src) {
                src = src.trim();
                var index = src.search('WebGLet.js$|WebGLet.min.js$');
                if (index != -1) {
                    src = src.slice(0, index) + 'images/error.png';
                    var image = document.createElement('img');
                    image.src = src;
                    img.style = 'float: left';
                    alertDiv.insertBefore(img, alertDiv.firstChild);
                }
            }
        }
    }
};

App.prototype.preDraw = function() {
    this.frameCount += 1;
    this.draw();
};

App.prototype.draw = function() {
};

App.prototype.run = function() {
    this.timer = setInterval(this.preDraw.bind(this),
                             1000 / this.options.frameRate);
};

App.prototype.stop = function() {
    clearInterval(this.timer);
};

App.prototype.clear = function(color) {
    gl.clearColor(color[0], color[1], color[2], color[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
};

App.prototype.getCanvasPosition = function() {
    var left = 0;
    var top = 0;
    var object = this.canvas;
    do {
        left += object.offsetLeft;
        top += object.offsetTop;
    } while (object = object.offsetParent);
    return [left, top];
};

