/**
 * @depends App.js
 */

 var Texture = new Class({
    initialize: function(width, height) {
        this.texture = gl.createTexture();
        this.flipped = false;
        this.bind();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA,
                      gl.UNSIGNED_BYTE, null);
        this.end();
    },

    begin: function(textureUnit) {
        if (!textureUnit) {
            textureUnit = 0;
        }
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
    },

    flipY: function() {
        if (!this.flipped) {
            this.bind();
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            this.end();
            this.flipped = true;
        }
    },

    loadFromFile: function(filename) {
        var image = new Image();
        image.src = filename;
        image.addEvent('load', function() {
            this.loadFromExisting(image);
        }.bind(this));
    },

    loadFromExisting: function(image) {
        this.image = image;
        this.flipY();
        this.bind();
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
                      this.image);
        this.end();
    }
});

// Alias for backwards compatibility
Texture.prototype['load'] = Texture.prototype['loadFromFile'];
