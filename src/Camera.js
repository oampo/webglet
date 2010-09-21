/**
 * @depends MatrixStack.js
 */
var Camera = new Class({
    initialize: function() {
        this.projection = new MatrixStack();
        this.modelview = new MatrixStack();
    },

    perspective: function(fovy, aspect, near, far) {
        mat4.perspective(fovy, aspect, near, far, this.projection.matrix);
    },

    ortho: function(left, right, top, bottom, near, far) {
        mat4.ortho(left, right, top, bottom, near, far, this.projection.matrix);
    },

    lookAt: function(eye, center, up) {
        mat4.lookAt(eye, center, up, this.modelview.matrix);
    },

    setUniforms: function(shaderProgram) {
        var projectionUniform = shaderProgram.getUniform('uProjectionMatrix');
        projectionUniform.setValue(this.projection.matrix);
        var modelviewUniform = shaderProgram.getUniform('uModelviewMatrix');
        modelviewUniform.setValue(this.modelview.matrix); 
    }
});
