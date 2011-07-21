/**
 * @depends App.js
 * @depends BasicRenderer.js
 * @depends Framebuffer.js
 */

var FramebufferRenderer = function(width, height,
                                   vertexShader, fragmentShader) {
    BasicRenderer.call(this, vertexShader, fragmentShader);
    this.framebuffer = new Framebuffer(width, height);
};
extend(FramebufferRenderer, BasicRenderer);

FramebufferRenderer.prototype.render = function(mesh, storedViewport) {
    this.shaderProgram.use();
    mesh.associate(this.shaderProgram);
    this.framebuffer.begin(storedViewport);
    mesh.render();
    this.framebuffer.end();
};

