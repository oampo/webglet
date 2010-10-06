/**
 * @depends App.js
 * @depends BasicRenderer.js
 * @depends PointRendererMixin.js
 * @depends ShaderProgram.js
 */

var PointRenderer = new Class({
    Extends: BasicRenderer,
    Implements: PointRendererMixin,
    initialize: function(pointParams, vertexShader, fragmentShader, options) {
        this.parent(vertexShader, fragmentShader, options);
        this.pointParams = pointParams;
        this.getPointSizeUniforms(this.shaderProgram);
    },

    renderMesh: function(mesh, camera) {
        camera.modelview.pushMatrix();
        mesh.applyTransformations(camera.modelview.matrix);
        camera.setUniforms(this.shaderProgram);
        camera.modelview.popMatrix();

        this.setPointSizeUniforms(this.pointParams);
        mesh.associate(this.shaderProgram);
        mesh.render();
    }
});
