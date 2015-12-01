window.onload = function() {
    var mat4 = webglet.glMatrix.mat4;

    var BasicApp = function(options) {
        webglet.App.call(this, options);

        var vertexShader = document.getElementById('basic-vert');
        vertexShader = vertexShader.textContent;

        var fragmentShader = document.getElementById('basic-frag');
        fragmentShader = fragmentShader.textContent;

        this.renderer = new webglet.BasicRenderer(vertexShader,
                                                  fragmentShader);

        this.projection = new webglet.MatrixStack();
        mat4.perspective(this.projection.matrix, 45,
                         this.canvas.offsetWidth/this.canvas.offsetHeight,
                         0.1, 100);
        this.renderer.setUniform('uProjectionMatrix',
                                 this.projection.matrix);

        this.modelview = new webglet.MatrixStack();
        mat4.lookAt(this.modelview.matrix, [0, 0, 5],
                                           [0, 0, 0],
                                           [0, 1, 0]);
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
        this.updateViewport();
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.renderer.render(this.triangle);
    };

    BasicApp.prototype.run = function() {
        window.requestAnimationFrame(this.draw.bind(this));
    }

    var app = new BasicApp({
        canvas: document.getElementById('main-canvas')
    });
    app.run();
};
