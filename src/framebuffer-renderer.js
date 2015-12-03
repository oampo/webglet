var Framebuffer = require('./framebuffer').Framebuffer;
var BasicRenderer = require('./basic-renderer').BasicRenderer;

var FramebufferRenderer = function(width, height,
                                   vertexShader, fragmentShader) {
    BasicRenderer.call(this, vertexShader, fragmentShader);
    this.framebuffer = new Framebuffer(width, height);
};
FramebufferRenderer.prototype = Object.create(BasicRenderer.prototype);
FramebufferRenderer.prototype.constructor = FramebufferRenderer;

FramebufferRenderer.prototype.render = function(mesh, offset,
                                                numberOfVertices) {
    this.shaderProgram.use();
    mesh.associate(this.shaderProgram);
    this.framebuffer.begin();
    mesh.render(offset, numberOfVertices);
    this.framebuffer.end();
};

exports.FramebufferRenderer = FramebufferRenderer;
