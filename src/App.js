var gl;

var App = new Class({
    Implements: Options,
    options: {
        name: 'webglet-app',
        width: 800,
        height: 600,
        frameRate: 60
    },

    initialize: function(element, options) {
        this.setOptions(options);
        this.element = element;
        this.typedArraySubsetShim();
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
        }
        else {
            var alertDiv = new Element('div', {'class': 'webglet-alert'});
            var alertString = '<strong>WebGL not enabled</strong><br/>For ' +
                'instructions on how to get a WebGL enabled browser <a ' +
                'href="http://www.khronos.org/webgl/wiki/' +
                'Getting_a_WebGL_Implementation">click here</a>';
            alertDiv.set('html', alertString);
            alertDiv.inject(this.element);
            var scripts = $$('script');
            for (var i = 0; i < scripts.length; i++) {
                var src = scripts[i].getProperty('src');
                if (src) {
                    src = src.trim();
                    var index = src.search('WebGLet.js$|WebGLet.min.js$');
                    if (index != -1) {
                        src = src.slice(0, index) + 'images/error.png';
                        var image = new Element('img',
                                                {'src': src,
                                                 'style': 'float: left'});
                        image.inject(alertDiv, 'top');
                    }
                }
            }
        }
    },


    typedArraySubsetShim: function() {
        // Forward/backward compatibility shim for change from slice -> subset
        var Int8Array, Uint8Array, Int16Array, Uint16Array;
        var Int32Array, Uint32Array, Float32Array, Float64Array;
        var types = [Int8Array, Uint8Array, Int16Array, Uint16Array,
                     Int32Array, Uint32Array, Float32Array, Float64Array];
        var original, shim;
        for (var i = 0; i < types.length; ++i) {
            if (types[i]) {
                if (types[i].prototype.slice === undefined) {
                    original = "subset";
                    shim = "slice";
                }
                else if (types[i].prototype.subset === undefined) {
                    original = "slice";
                    shim = "subset";
                }
                Object.defineProperty(types[i].prototype, shim, {
                    value: types[i].prototype[original],
                    enumerable: false
                });
            }
        }
    },

    preDraw: function() {
        this.frameCount += 1;
        this.draw();
    },

    draw: function() {
    },

    run: function() {
        this.timer = this.preDraw.periodical(1000 / this.options.frameRate,
                                             this);
    },

    stop: function() {
        clearInterval(this.timer);
    },

    clear: function(color) {
        gl.clearColor(color[0], color[1], color[2], color[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
});

