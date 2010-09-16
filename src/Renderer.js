var Renderer = new Class({
    Implements: Options,
    options: {},

    initialize: function(options) {
        this.setOptions(options);
        this.shaderProgram = new ShaderProgram();
    },

    render: function(meshes, camera) {
    }
});
