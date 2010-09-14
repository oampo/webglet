window.addEvent("domready", function() {
    var BasicApp = new Class({
        Extends: App,
        initialize: function(element, options) {
            this.parent(element, options);
            this.renderer = new BasicRenderer();
            this.camera = new Camera();
            this.triangle = new Mesh(3);
            
        },

        draw: function() {
            this.renderer.renderMesh(this.triangle, this.camera);
        }
    });

    var app = new BasicApp(document.body);
    app.run();
});
