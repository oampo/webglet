var Transformation = new Class({
    initialize: function() {
        this.position = vec3.create();
        this.rotation = quat4.create();
        this.scale = vec3.create();
        vec3.set([1, 1, 1], this.scale);

        // Cache matrix 
        this.rotationMatrix = mat4.create();
    },

    apply: function(matrix) {
        mat4.translate(matrix, this.position);
        quat4.toMat4(this.rotation, this.rotationMatrix);
        mat4.multiply(matrix, this.rotationMatrix);
        mat4.scale(matrix, this.scale);
    }
});
