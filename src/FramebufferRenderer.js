/**
 * @depends App.js
 * @depends BasicRenderer.js
 * @depends Framebuffer.js
 */

var FramebufferRenderer = new Class({
    Extends: BasicRenderer,
    initialize: function(width, height, vertexShader, fragmentShader) {
        BasicRenderer.prototype.initialize.apply(this, [vertexShader,
                                                        fragmentShader]);
        this.framebuffer = new Framebuffer(width, height);
    },

    renderMesh: function(mesh, matrices) {
        matrices.modelview.pushMatrix();
        mesh.transformation.apply(matrices.modelview.matrix);
        this.shaderProgram.setUniform('uModelviewMatrix',
                                      matrices.modelview.matrix);
        matrices.modelview.popMatrix();

        mesh.associate(this.shaderProgram);
        this.framebuffer.begin();
        mesh.render();
        this.framebuffer.end();
    }
});
