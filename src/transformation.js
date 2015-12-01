var glMatrix = require('gl-matrix');
var vec3 = glMatrix.vec3;
var quat = glMatrix.quat;
var mat4 = glMatrix.mat4;

var Transformation = function() {
    this.position = vec3.create();
    this.rotation = quat.create();
    this.scale = vec3.create();
    vec3.set(this.scale, 1, 1, 1);
};

Transformation.prototype.apply = function(matrix) {
    mat4.fromRotationTranslation(matrix, this.rotation, this.position);
    mat4.scale(matrix, matrix, this.scale);
};

exports.Transformation = Transformation;
