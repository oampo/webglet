window.addEvent("domready", function() {
    var FramebufferExample = new Class({
        Extends: App,
        initialize: function(element, options) {
            App.prototype.initialize.apply(this, [element, options]);
            // For rendering to the framebuffer
            this.fbRenderer = new FramebufferRenderer(this.options.width,
                                                      this.options.height,
                                                      'basic-renderer-vert',
                                                      'basic-renderer-frag');
            this.matrices = new TransformationMatrices();
            mat4.perspective(45, this.options.width/this.options.height,
                            0.1, 100, this.matrices.projection.matrix);
            mat4.lookAt([0, 0, 5],
                        [0, 0, 0],
                        [0, 1, 0], this.matrices.modelview.matrix);
            this.triangle = new Mesh(3, gl.TRIANGLES, gl.STATIC_DRAW,
                                     gl.STATIC_DRAW);
            this.triangle.vertexBuffer.setValues([ 0.0,  1.0, 0.0,
                                                  -1.0, -1.0, 0.0,
                                                   1.0, -1.0, 0.0]);
            this.triangle.colorBuffer.setValues([1.0, 0.0, 0.0, 1.0,
                                                 1.0, 0.0, 0.0, 1.0,
                                                 1.0, 0.0, 0.0, 1.0]);
            // For rendering the texture to the screen
            this.texRenderer = new BasicRenderer('texture-renderer-vert',
                                                 'texture-renderer-frag');

            this.orthoMatrices = new TransformationMatrices();
            mat4.ortho(0, this.options.width, this.options.height, 0, -1, 1,
                       this.orthoMatrices.projection.matrix);

            this.textureMesh = new RectMesh(this.options.width,
                                            this.options.height,
                                            gl.STATIC_DRAW, null,
                                            null, gl.STATIC_DRAW);
        },

        draw: function() {
            this.clear([1, 1, 1, 1]);
            this.fbRenderer.render([this.triangle], this.matrices);
            this.fbRenderer.framebuffer.texture.begin();
            this.texRenderer.render([this.textureMesh], this.orthoMatrices);
            this.fbRenderer.framebuffer.texture.end();
        }
    });

    var app = new FramebufferExample(document.body);
    app.run();
});
