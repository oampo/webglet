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

            this.projection = new MatrixStack();
            mat4.perspective(45, this.options.width/this.options.height,
                             0.1, 100, this.projection.matrix);
            this.fbRenderer.setUniform('uProjectionMatrix',
                                       this.projection.matrix);

            this.modelview = new MatrixStack();
            mat4.lookAt([0, 0, 5],
                        [0, 0, 0],
                        [0, 1, 0], this.modelview.matrix);
            this.fbRenderer.setUniform('uModelviewMatrix',
                                       this.modelview.matrix);

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

            this.orthoProjection = new MatrixStack();
            mat4.ortho(0, this.options.width, this.options.height, 0, -1, 1,
                       this.orthoProjection.matrix);
            this.texRenderer.setUniform('uProjectionMatrix',
                                       this.orthoProjection.matrix);
            
            this.orthoModelview = new MatrixStack();
            this.texRenderer.setUniform('uModelviewMatrix',
                                       this.orthoModelview.matrix);

            this.textureMesh = new RectMesh(this.options.width,
                                            this.options.height,
                                            gl.STATIC_DRAW, null,
                                            null, gl.STATIC_DRAW);
        },

        draw: function() {
            this.clear([1, 1, 1, 1]);
            this.fbRenderer.render(this.triangle);
            this.fbRenderer.framebuffer.texture.begin();
            this.texRenderer.render(this.textureMesh);
            this.fbRenderer.framebuffer.texture.end();
        }
    });

    var app = new FramebufferExample(document.body);
    app.run();
});
