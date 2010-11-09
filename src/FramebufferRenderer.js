/**
 * @depends App.js
 * @depends BasicRenderer.js
 * @depends Framebuffer.js
 */

var FramebufferRenderer = new Class({
    Extends: BasicRenderer,
    initialize: function(width, height, vertexShader, fragmentShader,
                         options) {
        BasicRenderer.prototype.initialize.apply(this, [vertexShader,
                                                        fragmentShader,
                                                        options]);
        this.framebuffer = new Framebuffer(width, height);
    },

    renderMesh: function(mesh, camera) {
        camera.modelview.pushMatrix();
        mesh.transformation.apply(camera.modelview.matrix);
        camera.setUniforms(this.shaderProgram);
        camera.modelview.popMatrix();

        mesh.associate(this.shaderProgram);
        this.framebuffer.begin();
        mesh.render();
        this.framebuffer.end();
    }
});
