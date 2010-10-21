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
        if (this.colorUsage) {
            this.colorBuffer = new Buffer(numVertices, 4, this.colorUsage);
        }
        if (this.normalUsage) {
            this.normalBuffer = new Buffer(numVertices, 3, this.normalUsage);
        }
        if (this.texCoordUsage) {
            this.texCoordBuffer = new Buffer(numVertices, 2,
                                             this.texCoordUsage);
        }

        this.position = vec3.create();
        vec3.set([0, 0, 0], this.position);
        this.rotation = quat4.create();
        this.scale = vec3.create();
        vec3.set([1, 1, 1], this.scale);
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
        if (!vertexAttribute) {
            console.error("Could not associate vertex attribute");
        }
        this.vertexBuffer.associate(vertexAttribute);

        if (this.colorUsage) {
            var colorAttribute = shaderProgram.getAttribute('aColor');
            if (!colorAttribute) {
                console.error("Could not associate color attribute");
            }
            this.colorBuffer.associate(colorAttribute);
        }
        if (this.normalUsage) {
            var normalAttribute = shaderProgram.getAttribute('aNormal');
            if (!normalAttribute) {
                console.error("Could not associate normal attribute");
            }
            this.normalBuffer.associate(normalAttribute);
        }
        if (this.texCoordUsage) {
            var texCoordAttribute = shaderProgram.getAttribute('aTexCoord');
            if (!texCoordAttribute) {
                console.error("Could not associate texCoord attribute");
            }
            this.texCoordBuffer.associate(texCoordAttribute);
        }
    },
        
    render: function() {
        gl.drawArrays(this.drawMode, 0, this.numVertices);
    }
});

