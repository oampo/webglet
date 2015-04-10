window.onload = function() {
    var mat4 = webglet.glMatrix.mat4;

    var BasicApp = function(canvas) {
        webglet.App.call(this, canvas);
        this.renderer = new webglet.BasicRenderer('basic-renderer-vert',
                                                  'basic-renderer-frag');

        this.projection = new webglet.MatrixStack();
        mat4.perspective(45, this.canvas.offsetWidth/this.canvas.offsetHeight,
                         0.1, 100, this.projection.matrix);
        this.renderer.setUniform('uProjectionMatrix',
                                 this.projection.matrix);

        this.modelview = new webglet.MatrixStack();
        mat4.lookAt([0, 0, 5],
                    [0, 0, 0],
                    [0, 1, 0], this.modelview.matrix);
        this.renderer.setUniform('uModelviewMatrix',
                                 this.modelview.matrix);


        this.triangle = new webglet.Mesh(3, gl.TRIANGLES, gl.STATIC_DRAW,
                                         gl.STATIC_DRAW);
        this.triangle.vertexBuffer.setValues([ 0.0,  1.0, 0.0,
                                              -1.0, -1.0, 0.0,
                                               1.0, -1.0, 0.0]);
        this.triangle.colorBuffer.setValues([1.0, 0.0, 0.0, 1.0,
                                             1.0, 0.0, 0.0, 1.0,
                                             1.0, 0.0, 0.0, 1.0]);
    };
    BasicApp.prototype = Object.create(webglet.App.prototype);
    BasicApp.prototype.constructor = BasicApp;

    BasicApp.prototype.draw = function() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.renderer.render(this.triangle);
    };

    var app = new BasicApp({
        canvas: document.getElementById('main-canvas')
    });
    app.run();
};
