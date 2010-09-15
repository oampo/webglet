window.addEvent("domready", function() {
    var BasicApp = new Class({
        Extends: App,
        initialize: function(element, options) {
            this.parent(element, options);
            this.renderer = new BasicRenderer();
            this.camera = new Camera();
            this.camera.perspective(45, this.options.width/this.options.height,
                                    0.1, 100);
            this.camera.lookAt([0, 0, 5],
                               [0, 0, 0],
                               [0, 1, 0]);
            this.triangle = new Mesh(3, gl.TRIANGLES, gl.STATIC_DRAW,
                                     gl.STATIC_DRAW, gl.STATIC_DRAW);
            this.triangle.vertexBuffer.setValues([ 0.0,  1.0, 0.0,
                                                  -1.0, -1.0, 0.0,
                                                   1.0, -1.0, 0.0]);
            this.triangle.colorBuffer.setValues([1.0, 0.0, 0.0, 1.0,
                                                 1.0, 0.0, 0.0, 1.0,
                                                 1.0, 0.0, 0.0, 1.0]);
        },

        draw: function() {
            this.clear();
            this.renderer.renderMesh(this.triangle, this.camera);
        }
    });

    var app = new BasicApp(document.body);
    app.run();
});
