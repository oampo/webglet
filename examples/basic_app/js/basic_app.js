window.onload = function() {
    var BasicApp = function(element, options) {
        App.call(this, element, options);
        this.renderer = new BasicRenderer('basic-renderer-vert',
                                          'basic-renderer-frag');

        this.projection = new MatrixStack();
        mat4.perspective(45, this.options.width/this.options.height,
                         0.1, 100, this.projection.matrix);
        this.renderer.setUniform('uProjectionMatrix',
                                 this.projection.matrix);
        
        this.modelview = new MatrixStack();
        mat4.lookAt([0, 0, 5],
                    [0, 0, 0],
                    [0, 1, 0], this.modelview.matrix);
        this.renderer.setUniform('uModelviewMatrix',
                                 this.modelview.matrix);


        this.triangle = new Mesh(3, gl.TRIANGLES, gl.STATIC_DRAW,
                                 gl.STATIC_DRAW);
        this.triangle.vertexBuffer.setValues([ 0.0,  1.0, 0.0,
                                              -1.0, -1.0, 0.0,
                                               1.0, -1.0, 0.0]);
        this.triangle.colorBuffer.setValues([1.0, 0.0, 0.0, 1.0,
                                             1.0, 0.0, 0.0, 1.0,
                                             1.0, 0.0, 0.0, 1.0]);
    };
    extend(BasicApp, App);

    BasicApp.prototype.draw = function() {
        this.clear([1, 1, 1, 1]);
        this.renderer.render(this.triangle);
    };

    var app = new BasicApp(document.body);
    app.run();
};
