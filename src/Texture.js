/**
 * @depends App.js
 */

 var Texture = new Class({
    initialize: function(width, height) {
        this.texture = gl.createTexture();
        this.bind();
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA,
                      gl.UNSIGNED_BYTE);
        this.end();
    },

    begin: function(textureUnit) {
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        this.bind();
    },

    bind: function() {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    },

    end: function() {
        gl.bindTexture(gl.TEXTURE_2D, null);
    },

    getTexture: function() {
        return (this.texture);
    }
});
