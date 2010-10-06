/**
 * @depends App.js
 * @depends Renderer.js
 * @depends ShaderProgram.js
 */

var BasicRenderer = new Class({
    Extends: Renderer,
    initialize: function(vertexShader, fragmentShader, options) {
        this.parent(options);
        this.shaderProgram = new ShaderProgram();
        this.shaderProgram.addShader(vertexShader);
        this.shaderProgram.addShader(fragmentShader);
        this.shaderProgram.use();
    },

    render: function(meshes, camera) {
        this.shaderProgram.use();
        for (var i = 0; i < meshes.length; i++) {
            // Render
            this.renderMesh(meshes[i], camera);
        }
    },

    renderMesh: function(mesh, camera) {
        camera.modelview.pushMatrix();
        mesh.applyTransformations(camera.modelview.matrix);
        camera.setUniforms(this.shaderProgram);
        camera.modelview.popMatrix();

        mesh.associate(this.shaderProgram);
        mesh.render();
    }
});
