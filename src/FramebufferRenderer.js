/**
 * @depends App.js
 * @depends Renderer.js
 * @depends ShaderProgram.js
 */

var FramebufferRenderer = new Class({
    Extends: BasicRenderer,
    initialize: function(width, height, vertexShader, fragmentShader,
                         options) {
        this.parent(vertexShader, fragmentShader, options);
        this.framebuffer = new Framebuffer(width, height);
    },

    renderMesh: function(mesh, camera) {
        camera.modelview.pushMatrix();
        mesh.applyTransformations(camera);
        camera.setUniforms(this.shaderProgram);
        camera.modelview.popMatrix();

        mesh.associate(this.shaderProgram);
        this.framebuffer.begin();
        mesh.render();
        this.framebuffer.end();
    }
});
