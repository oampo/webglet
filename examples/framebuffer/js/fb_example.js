window.onload = function() {
    var mat4 = webglet.glMatrix.mat4;

    var FramebufferExample = function(canvas) {
        webglet.App.call(this, canvas);
        // For rendering to the framebuffer
        this.fbRenderer = new webglet.FramebufferRenderer(this.canvas.width,
                                                  this.canvas.height,
                                                  'basic-renderer-vert',
                                                  'basic-renderer-frag');

        this.projection = new webglet.MatrixStack();
        mat4.perspective(this.projection.matrix,
                         45, this.canvas.width/this.canvas.height,
                         0.1, 100);
        this.fbRenderer.setUniform('uProjectionMatrix',
                                   this.projection.matrix);

        this.modelview = new webglet.MatrixStack();
        mat4.lookAt(this.modelview.matrix, [0, 0, 5],
                                           [0, 0, 0],
                                           [0, 1, 0]);
        this.fbRenderer.setUniform('uModelviewMatrix',
                                   this.modelview.matrix);

        this.triangle = new webglet.Mesh(3, gl.TRIANGLES, gl.STATIC_DRAW,
                                 gl.STATIC_DRAW);
        this.triangle.vertexBuffer.setValues([ 0.0,  1.0, 0.0,
                                              -1.0, -1.0, 0.0,
                                               1.0, -1.0, 0.0]);
        this.triangle.colorBuffer.setValues([1.0, 0.0, 0.0, 1.0,
                                             1.0, 0.0, 0.0, 1.0,
                                             1.0, 0.0, 0.0, 1.0]);

        // For rendering the texture to the screen
        this.texRenderer = new webglet.BasicRenderer('texture-renderer-vert',
                                             'texture-renderer-frag');

        this.orthoProjection = new webglet.MatrixStack();
        mat4.ortho(this.orthoProjection.matrix,
                   0, this.canvas.width, this.canvas.height, 0, -1, 1);
        this.texRenderer.setUniform('uProjectionMatrix',
                                   this.orthoProjection.matrix);

        this.orthoModelview = new webglet.MatrixStack();
        this.texRenderer.setUniform('uModelviewMatrix',
                                   this.orthoModelview.matrix);

        this.textureMesh = new webglet.RectMesh(this.canvas.width,
                                        this.canvas.height,
                                        gl.STATIC_DRAW, null,
                                        null, gl.STATIC_DRAW);
    };
    FramebufferExample.prototype = Object.create(webglet.App.prototype);
    FramebufferExample.prototype.constructor = FramebufferExample;

    FramebufferExample.prototype.draw = function() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.fbRenderer.render(this.triangle);
        this.fbRenderer.framebuffer.texture.begin();
        this.texRenderer.render(this.textureMesh);
        this.fbRenderer.framebuffer.texture.end();
    };

    var app = new FramebufferExample({
        canvas: document.getElementById('main-canvas')
    });
    app.run();
};
