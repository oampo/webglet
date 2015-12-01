var Texture = function(width, height) {
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
};

Texture.prototype.begin = function(textureUnit) {
    if (!textureUnit) {
        textureUnit = 0;
    }
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    this.bind();
};

Texture.prototype.bind = function() {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
};

Texture.prototype.end = function() {
    gl.bindTexture(gl.TEXTURE_2D, null);
};

Texture.prototype.getTexture = function() {
    return this.texture;
};

Texture.prototype.flipY = function() {
    if (!this.flipped) {
        this.bind();
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        this.end();
        this.flipped = true;
    }
};

Texture.prototype.loadFromFile = function(filename) {
    var image = new Image();
    image.src = filename;
    image.onload = this.loadFromExisting.bind(this, image);
};

Texture.prototype.loadFromExisting = function(image) {
    this.image = image;
    this.flipY();
    this.bind();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
                  this.image);
    this.end();
};

exports.Texture = Texture;

