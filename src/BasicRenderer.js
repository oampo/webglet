/**
 * @depends App.js
 * @depends ShaderProgram.js
 */

var BasicRenderer = new Class({
    initialize: function(vertexShader, fragmentShader) {
        this.shaderProgram = new ShaderProgram();
        this.shaderProgram.addShader(vertexShader);
        this.shaderProgram.addShader(fragmentShader);
        this.shaderProgram.use();
    },

    render: function(meshes, matrices) {
        this.shaderProgram.use();
        for (var i = 0; i < meshes.length; i++) {
            // Render
            this.renderMesh(meshes[i], matrices);
        }
    },

    renderMesh: function(mesh, matrices) {
        matrices.modelview.pushMatrix();
        mesh.transformation.apply(matrices.modelview.matrix);
        this.shaderProgram.setUniform('uProjectionMatrix',
                                      matrices.projection.matrix);
        this.shaderProgram.setUniform('uModelviewMatrix',
                                      matrices.modelview.matrix);
        matrices.modelview.popMatrix();

        mesh.associate(this.shaderProgram);
        mesh.render();
    }
});
