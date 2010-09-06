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
    },

    createShaderProgram: function() {
        this.shaderProgram = new ShaderProgram();
    },

    createShaders: function(ids) {
        for (var i = 0; i < ids; i++) {
            this.shaderProgram.addShader(ids[i]);
        }
    },

    render: function(objects, camera) {
        this.shaderProgram.use();
        for (var i = 0; i < objects.length; i++) {
            // Render
            this.renderObject(objects[i]);
        }
    },

    renderObject: function(object, camera) {
        camera.modelview.pushMatrix();

        mat4.translate(camera.modelview.matrix, object.position);
        mat4.mult(camera.modelview.matrix, object.rotation);
        mat4.scale(camera.modelview.matrix, object.scale);

        var sp = this.shaderProgram;
        var projectionUniform = sp.getUniform('uProjectionMatrix');
        projectionUniform.setValue(camera.projection.matrix);
        var modelviewUniform = sp.getUniform('uModelviewMatrix');
        modelviewUniform.setValue(camera.modelview.matrix);

        camera.modelview.popMatrix();

        var vertexAttribute = sp.getAttribute('aVertex');
        object.vertexBuffer.associate(vertexAttribute);

        var colorAttribute = sp.getAttribute('aColor');
        object.colorBuffer.associate(colorAttribute);

        var normalAttribute = sp.getAttribute('aNormal');
        object.normalBuffer.associate(normalAttribute);

        gl.drawArrays(object.drawMode, 0, object.numVertices);
    }
});
