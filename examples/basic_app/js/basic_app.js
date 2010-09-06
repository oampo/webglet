window.addEvent("domready", function() {
    var BasicApp = new Class({
        Extends: App,
        initialize: function(element, options) {
            this.parent(element, options);
            this.renderer = new BasicRenderer();
        }
    });

    var app = new BasicApp(document.body);
    app.run();
});
