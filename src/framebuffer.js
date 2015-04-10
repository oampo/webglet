var Texture = require('./texture').Texture;

var Framebuffer = function(width, height) {
    this.width = width;
    this.height = height;

    this.framebuffer = gl.createFramebuffer();

    this.begin();

    // Add depth buffer
    this.depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width,
                           height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                               gl.RENDERBUFFER, this.depthBuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    this.end();

    // Add texture for color
    this.texture = new Texture(width, height);
    this.attachTexture(this.texture);

    this.begin();
    // Check it all worked
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !=
        gl.FRAMEBUFFER_COMPLETE) {
        console.error('Could not create framebuffer - error ',
                      gl.checkFramebufferStatus(gl.FRAMEBUFFER));
    }
    this.end();
};

Framebuffer.prototype.begin = function(storedViewport) {
    if (storedViewport) {
        this.pushViewport(storedViewport);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
};

Framebuffer.prototype.end = function() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (this.storedViewport) {
        this.popViewport();
    }
};

Framebuffer.prototype.attachTexture = function(texture) {
    this.texture = texture;
    this.begin();
    this.texture.begin();
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                            gl.TEXTURE_2D, this.texture.getTexture(),
                            0);
    this.texture.end();
    this.end();
};

Framebuffer.prototype.clear = function(color) {
    this.begin();
    gl.clearColor(color[0], color[1], color[2], color[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.end();
};

Framebuffer.prototype.pushViewport = function(storedViewport) {
    this.storedViewport = storedViewport;
    gl.viewport(0, 0, this.width, this.height);
};

Framebuffer.prototype.popViewport = function() {
    gl.viewport(this.storedViewport[0], this.storedViewport[1],
                this.storedViewport[2], this.storedViewport[3]);
    this.storedViewport = null;
};

exports.Framebuffer = Framebuffer;
