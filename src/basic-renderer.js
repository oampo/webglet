var ShaderProgram = require('./shader-program').ShaderProgram;

var BasicRenderer = function(vertexShader, fragmentShader) {
    this.shaderProgram = new ShaderProgram();
    this.shaderProgram.addShader(vertexShader, gl.VERTEX_SHADER);
    this.shaderProgram.addShader(fragmentShader, gl.FRAGMENT_SHADER);
    this.shaderProgram.use();
};

BasicRenderer.prototype.render = function(mesh, offset, numberOfVertices) {
    this.shaderProgram.use();
    mesh.associate(this.shaderProgram);
    mesh.render(offset, numberOfVertices);
};

BasicRenderer.prototype.setUniform = function(name, value) {
    this.shaderProgram.setUniform(name, value);
};

exports.BasicRenderer = BasicRenderer;
