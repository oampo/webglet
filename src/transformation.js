var glMatrix = require('gl-matrix');
var vec3 = glMatrix.vec3;
var quat4 = glMatrix.quat4;
var mat4 = glMatrix.mat4;

var Transformation = function() {
    this.position = vec3.create();
    this.rotation = quat4.create();
    this.scale = vec3.create();
    vec3.set(this.scale, 1, 1, 1);

    // Cache matrix
    this.rotationMatrix = mat4.create();
};

Transformation.prototype.apply = function(matrix) {
    mat4.translate(matrix, this.position);
    quat4.toMat4(this.rotation, this.rotationMatrix);
    mat4.multiply(matrix, this.rotationMatrix);
    mat4.scale(matrix, this.scale);
};

exports.Transformation = Transformation;
