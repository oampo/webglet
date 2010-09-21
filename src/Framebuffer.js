/**
 * @depends App.js
 * @depends Texture.js
 */

var Framebuffer = new Class({
    initialize: function(width, height) {
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
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT,
                                gl.TEXTURE_2D, this.texture.getTexture(),
                                0);
        this.texture.end();

        // Check it all worked
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !=
            gl.FRAMEBUFFER_COMPLETE) {
            console.error('Could not create framebuffer');
        }

        this.end();
    },

    begin: function() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    },

    end: function() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

});
