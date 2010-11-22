/**
 * @depends MatrixStack.js
 */
var TransformationMatrices = new Class({
    initialize: function() {
        this.projection = new MatrixStack();
        this.modelview = new MatrixStack();
    }
});
