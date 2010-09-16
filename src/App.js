var gl;

var App = new Class({
    Implements: Options,
    options: {
        name: 'webglet-app',
        width: 800,
        height: 600,
        frameRate: 60,
        backgroundColor: [1, 1, 1, 1]
    },

    initialize: function(element, options) {
        this.setOptions(options);
        this.element = element;
        this.createCanvas();
    },

    createCanvas: function() {
        this.canvas = new Element('canvas', {'id': this.options.name,
                                             'width': this.options.width,
                                             'height': this.options.height});
        try {
            gl = this.canvas.getContext('experimental-webgl');
            gl.viewport(0, 0, this.options.width, this.options.height);
            gl.clearColor(this.options.backgroundColor[0],
                          this.options.backgroundColor[1],
                          this.options.backgroundColor[2],
                          this.options.backgroundColor[3]);
        }
        catch (error) {
        }

        if (gl) {
            this.canvas.inject(this.element);
        }
        else {
            var alertDiv = new Element('div', {'class': 'webglet-alert'});
            alertDiv.set('text', 'WebGL not enabled');
            alertDiv.inject(this.element);
        }
    },

    draw: function() {
    },

    run: function() {
        this.draw.periodical(1000 / this.options.frameRate, this);
    },

    clear: function() {
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
});

