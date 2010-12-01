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

    render: function(mesh) {
        this.shaderProgram.use();
        mesh.associate(this.shaderProgram);
        mesh.render();
    },

    setUniform: function(name, value) {
        this.shaderProgram.setUniform(name, value);
    }   
});
