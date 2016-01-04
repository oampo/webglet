// Well, this is evil.  Finding the gl viewport through gl.getParameter is
// woefully slow.  This function monkey patches the gl.viewport method to
// store the current viewport and make it available on the gl object.
// We use this when rendering to a Framebuffer so we can restore the correct
// viewport when we are done.
exports.monkeyPatchViewport = function(gl) {
    var oldViewport = gl.viewport.bind(gl);
    gl.viewport = function(x, y, width, height) {
        gl.currentViewport = [x, y, width, height];
        oldViewport(x, y, width, height);
    };
    return gl;
};
