/**
 * @depends App.js
 * @depends BasicRenderer.js
 * @depends Framebuffer.js
 */

var FramebufferRenderer = new Class({
    Extends: BasicRenderer,
    initialize: function(width, height, vertexShader, fragmentShader) {
        BasicRenderer.prototype.initialize.apply(this, [vertexShader,
                                                        fragmentShader]);
        this.framebuffer = new Framebuffer(width, height);
    },

    render: function(mesh, needViewportPush) {
        this.shaderProgram.use();
        mesh.associate(this.shaderProgram);
        this.framebuffer.begin(needViewportPush);
        mesh.render();
        this.framebuffer.end();
    }

});
