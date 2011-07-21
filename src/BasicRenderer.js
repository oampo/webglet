/**
 * @depends App.js
 * @depends ShaderProgram.js
 */

var BasicRenderer = function(vertexShader, fragmentShader) {
    this.shaderProgram = new ShaderProgram();
    this.shaderProgram.addShader(vertexShader);
    this.shaderProgram.addShader(fragmentShader);
    this.shaderProgram.use();
};

BasicRenderer.prototype.render = function(mesh) {
    this.shaderProgram.use();
    mesh.associate(this.shaderProgram);
    mesh.render();
};

BasicRenderer.prototype.setUniform = function(name, value) {
    this.shaderProgram.setUniform(name, value);
};
