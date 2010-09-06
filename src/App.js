var gl;

var App = new Class({
    Implements: Options,
    options: {
        name: 'webglet-app',
        width: 800,
        height: 600
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
        }
        catch (error) {
        }

        if (gl) {
            this.canvas.inject(this.element);
            // Load other modules here
        }
        else {
            var alertDiv = new Element('div', {'class': 'webglet-alert'});
            alertDiv.set('text', 'WebGL not enabled');
            alertDiv.inject(this.element);
        }
    },

    update: function() {
    },

    render: function() {
    },

    run: function() {
    }
});

