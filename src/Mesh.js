/**
 * @depends App.js
 * @depends Buffer.js
 */

var Mesh = new Class({
    initialize: function(numVertices, drawMode, vertexUsage, colorUsage,
                         normalUsage) {
        this.numVertices = numVertices;
        this.drawMode = drawMode;
        this.vertexUsage = vertexUsage;
        this.colorUsage = colorUsage;
        this.normalUsage = normalUsage;
        this.vertexBuffer = new Buffer(numVertices, this.options.vertexUsage);
        this.normalBuffer = new Buffer(numVertices, this.options.normalUsage);
        this.colorBuffer = new Buffer(numVertices, this.options.colorUsage);

        this.position = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.scale = [1, 1, 1];
    }
});

