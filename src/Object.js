/**
 * @depends App.js
 * @depends Buffer.js
 */

var Object = new Class({
    Implements: Options,
    options: {
        drawMode: gl.POINTS,
        vertexUsage: gl.STATIC_DRAW,
        colorUsage: gl.STATIC_DRAW,
        normalUsage: gl.DYNAMIC_DRAW
    },

    initialize: function(numVertices, options) {
        this.setOptions(options);
        this.numVertices = numVertices;
        this.vertexBuffer = new Buffer(numVertices, this.options.vertexUsage);
        this.normalBuffer = new Buffer(numVertices, this.options.normalUsage);
        this.colorBuffer = new Buffer(numVertices, this.options.colorUsage);

        this.position = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.scale = [1, 1, 1];
    }
});

