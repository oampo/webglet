/**
 * @depends App.js
 * @depends Buffer.js
 */

var Mesh = new Class({
    initialize: function(numVertices, drawMode, vertexUsage, colorUsage,
                         normalUsage, texCoordUsage) {
        this.numVertices = numVertices;
        this.drawMode = drawMode;
        this.vertexUsage = vertexUsage;
        this.colorUsage = colorUsage;
        this.normalUsage = normalUsage;
        this.texCoordUsage = texCoordUsage;

        this.vertexBuffer = new Buffer(numVertices, 3, this.vertexUsage);
        if (typeof this.colorUsage != 'undefined') {
            this.colorBuffer = new Buffer(numVertices, 4, this.colorUsage);
        }
        if (typeof this.normalUsage != 'undefined') {
            this.normalBuffer = new Buffer(numVertices, 3, this.normalUsage);
        }
        if (typeof this.texCoordUsage != 'undefined') {
            this.texCoordBuffer = new Buffer(numVertices, 2,
                                             this.texCoordUsage);
        }

        this.position = [0, 0, 0];
        this.rotation = quat4.create();
        this.scale = [1, 1, 1];
    },

    applyTransformations: function(matrix) {
       mat4.translate(matrix, this.position);
       var rotationMatrix = mat4.create();
       quat4.toMat4(this.rotation, rotationMatrix);
       mat4.multiply(matrix, rotationMatrix);
       mat4.scale(matrix, this.scale); 
    },

    associate: function(shaderProgram) {
        var vertexAttribute = shaderProgram.getAttribute('aVertex');
        this.vertexBuffer.associate(vertexAttribute);
        if (typeof this.colorUsage != 'undefined') {
            var colorAttribute = shaderProgram.getAttribute('aColor');
            this.colorBuffer.associate(colorAttribute);
        }
        if (typeof this.normalUsage != 'undefined') {
            var normalAttribute = shaderProgram.getAttribute('aNormal');
            this.normalBuffer.associate(normalAttribute);
        }
        if (typeof this.texCoordUsage != 'undefined') {
            var texCoordAttribute = shaderProgram.getAttribute('aTexCoord');
            this.texCoordBuffer.associate(texCoordAttribute);
        }
    },
        
    render: function() {
        gl.drawArrays(this.drawMode, 0, this.numVertices);
    }
});

