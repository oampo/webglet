/**
 * @depends App.js
 * @depends Renderer.js
 * @depends ShaderProgram.js
 */

var BasicRenderer = new Class({
    Extends: Renderer,
    initialize: function(options) {
        this.parent(options);
        this.createShaderProgram();
        this.createShaders(['basic-renderer-vert', 'basic-renderer-frag']);
        this.shaderProgram.use();
    },

    createShaderProgram: function() {
        this.shaderProgram = new ShaderProgram();
    },

    createShaders: function(ids) {
        for (var i = 0; i < ids.length; i++) {
            this.shaderProgram.addShader(ids[i]);
        }
    },

    render: function(meshes, camera) {
        this.shaderProgram.use();
        for (var i = 0; i < meshes.length; i++) {
            // Render
            this.renderMesh(meshes[i]);
        }
    },

    renderMesh: function(mesh, camera) {
        camera.modelview.pushMatrix();

        mat4.translate(camera.modelview.matrix, mesh.position);
        var rotationMatrix = mat4.create();
        quat4.toMat4(mesh.rotation, rotationMatrix);
        mat4.multiply(camera.modelview.matrix, rotationMatrix);
        mat4.scale(camera.modelview.matrix, mesh.scale);

        var sp = this.shaderProgram;
        var projectionUniform = sp.getUniform('uProjectionMatrix');
        projectionUniform.setValue(camera.projection.matrix);
        var modelviewUniform = sp.getUniform('uModelviewMatrix');
        modelviewUniform.setValue(camera.modelview.matrix);

        camera.modelview.popMatrix();

        var vertexAttribute = sp.getAttribute('aVertex');
        mesh.vertexBuffer.associate(vertexAttribute);

        var colorAttribute = sp.getAttribute('aColor');
        mesh.colorBuffer.associate(colorAttribute);

        gl.drawArrays(mesh.drawMode, 0, mesh.numVertices);
    }
});
