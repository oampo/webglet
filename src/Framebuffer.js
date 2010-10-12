/**
 * @depends App.js
 * @depends Texture.js
 */

var Framebuffer = new Class({
    initialize: function(width, height) {
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

        // Add texture for color
        this.texture = new Texture(width, height);
        this.texture.begin();
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                                gl.TEXTURE_2D, this.texture.getTexture(),
                                0);
        this.texture.end();

        // Check it all worked
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !=
            gl.FRAMEBUFFER_COMPLETE) {
            console.error('Could not create framebuffer - error ',
                          gl.checkFramebufferStatus(gl.FRAMEBUFFER));
        }

        this.end();
    },

    begin: function() {
        this.pushViewport();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    },

    end: function() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.popViewport();
    },

    clear: function() {
        this.begin();
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.end();
    },

    pushViewport: function() {
        this.storedViewport = gl.getParameter(gl.VIEWPORT);
        if (!this.storedViewport) {
            this.storedViewport = gl.getParameter(gl.VIEWPORT_RECT);
        }
        gl.viewport(0, 0, this.width, this.height);
    },

    popViewport: function() {
        gl.viewport(this.storedViewport[0], this.storedViewport[1],
                    this.storedViewport[2], this.storedViewport[3]);
    }
});
