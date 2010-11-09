/**
 * @depends App.js
 * @depends FramebufferRenderer.js
 * @depends PointRendererMixin.js
 */

var FramebufferPointRenderer = new Class({
    Extends: FramebufferRenderer,
    Implements: PointRendererMixin,
    initialize: function(width, height, pointParams, vertexShader,
                         fragmentShader, options) {
        FramebufferRenderer.prototype.initialize.apply(this, [width, height,
                                                              vertexShader,
                                                              fragmentShader,
                                                              options]);
        this.pointParams = pointParams;
        this.getPointSizeUniforms(this.shaderProgram);
    },

    renderMesh: function(mesh, camera) {
        camera.modelview.pushMatrix();
        mesh.transformation.apply(camera.modelview.matrix);
        camera.setUniforms(this.shaderProgram);
        camera.modelview.popMatrix();

        this.setPointSizeUniforms(this.pointParams);
        mesh.associate(this.shaderProgram);
        this.framebuffer.begin();
        mesh.render();
        this.framebuffer.end();
    }
});
