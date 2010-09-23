window.addEvent("domready", function() {
    var FramebufferExample = new Class({
        Extends: App,
        initialize: function(element, options) {
            this.parent(element, options);
            // For rendering to the framebuffer
            this.fbRenderer = new FramebufferRenderer(this.options.width,
                                                      this.options.height,
                                                      'basic-renderer-vert',
                                                      'basic-renderer-frag');
            this.camera = new Camera();
            this.camera.perspective(45, this.options.width/this.options.height,
                                    0.1, 100);
            this.camera.lookAt([0, 0, 5],
                               [0, 0, 0],
                               [0, 1, 0]);
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

            this.orthoCamera = new Camera();
            this.orthoCamera.ortho(0, this.options.width,
                                   this.options.height, 0,
                                   -1, 1);

            this.textureMesh = new Mesh(6, gl.TRIANGLES, gl.STATIC_DRAW, null,
                                        null, gl.STATIC_DRAW);
            var w = this.options.width;
            var h = this.options.height;
            this.textureMesh.vertexBuffer.setValues([0, 0, 0,
                                                     w, h, 0,
                                                     0, h, 0,
                                                     0, 0, 0,
                                                     w, h, 0,
                                                     w, 0, 0]);
            this.textureMesh.texCoordBuffer.setValues([0, 1,
                                                       1, 0,
                                                       0, 0,
                                                       0, 1,
                                                       1, 0,
                                                       1, 1]);
        },

        draw: function() {
            this.clear();
            this.fbRenderer.render([this.triangle], this.camera);
            this.fbRenderer.framebuffer.texture.begin();
            this.texRenderer.render([this.textureMesh], this.orthoCamera);
            this.fbRenderer.framebuffer.texture.end();
        }
    });

    var app = new FramebufferExample(document.body);
    app.run();
});
