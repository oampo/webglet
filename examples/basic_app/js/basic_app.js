window.addEvent("domready", function() {
    var BasicApp = new Class({
        Extends: App,
        initialize: function(element, options) {
            App.prototype.initialize.apply(this, [element, options]);
            this.renderer = new BasicRenderer('basic-renderer-vert',
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
        },

        draw: function() {
            this.clear([1, 1, 1, 1]);
            this.renderer.render([this.triangle], this.matrices);
        }
    });

    var app = new BasicApp(document.body);
    app.run();
});
