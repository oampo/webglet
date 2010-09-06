var Camera({
    initialize: function() {
        this.projection = new MatrixStack();
        this.modelview = new MatrixStack();
    },

    perspective: function(fovy, aspect, near, far) {
        mat4.perspective(fovy, aspect, near, far, this.projection);
    }

    ortho: function(left, right, top, bottom, near, far) {
        mat4.ortho(left, right, top, bottom, near, far, this.projection);
    }

    lookAt: function(eye, center, up) {
        mat4.lookAt(eye, center, up, this.modelview);
    }
});
