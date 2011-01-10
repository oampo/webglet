/**
 * @depends App.js
 * @depends Buffer.js
 * @depends Transformation.js
 */

var Mesh = new Class({
    initialize: function(numVertices, drawMode, vertexUsage, colorUsage,
                         normalUsage, texCoordUsage) {
        this.numVertices = numVertices;
        this.drawMode = drawMode;
        this.buffers = {};

        this.createBuffer('vertex', numVertices, 3, vertexUsage);
        if (colorUsage) {
            this.createBuffer('color', numVertices, 4, colorUsage);
        }
        if (normalUsage) {
            this.createBuffer('normal', numVertices, 3, normalUsage);
        }
        if (texCoordUsage) {
            this.createBuffer('texCoord', numVertices, 2, texCoordUsage);
        }
    },

    createBuffer: function(name, numVertices, stride, usage) {
        this.buffers[name] = new Buffer(numVertices, stride, usage);
        // Also store the buffer in this, for ease of access and backwards
        // compatibility
        this[name + 'Buffer'] = this.buffers[name];
    },

    associate: function(shaderProgram) {
        Object.each(this.buffers, function(buffer, bufferName) {
            // Convert bufferName to aAttributeName
            var attributeName = 'a' + bufferName.capitalize();
            var attribute = shaderProgram.getAttribute(attributeName);
            if (!attribute) {
                console.error('Could not associate ' + attributeName +
                              ' attribute');
            }
            buffer.associate(attribute);
        }, this);
    },

    render: function() {
        gl.drawArrays(this.drawMode, 0, this.numVertices);
    }
});

