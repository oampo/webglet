var FramebufferRenderer = function(width, height,
                                   vertexShader, fragmentShader) {
    BasicRenderer.call(this, vertexShader, fragmentShader);
    this.framebuffer = new Framebuffer(width, height);
};
extend(FramebufferRenderer, BasicRenderer);

FramebufferRenderer.prototype.render = function(mesh, offset, numberOfVertices,
                                                storedViewport) {
    this.shaderProgram.use();
    mesh.associate(this.shaderProgram);
    this.framebuffer.begin(storedViewport);
    mesh.render(offset, numberOfVertices);
    this.framebuffer.end();
};

