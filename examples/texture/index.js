window.onload = function() {
    var mat4 = webglet.glMatrix.mat4;

    var TextureExample = function(options) {
        webglet.App.call(this, options);

        this.texture = new webglet.Texture(163, 75);
        this.texture.loadFromFile("WebGL_logo.png");

        // For rendering the texture to the screen
        var vertexShader = document.getElementById('texture-vert');
        vertexShader = vertexShader.textContent;

        var fragmentShader = document.getElementById('texture-frag');
        fragmentShader = fragmentShader.textContent;

        this.texRenderer = new webglet.BasicRenderer(vertexShader,
                                                     fragmentShader);

        this.orthoProjection = new webglet.MatrixStack();
        mat4.ortho(this.orthoProjection.matrix, 0, this.canvas.width,
                   this.canvas.height, 0, -1, 1);
        this.texRenderer.setUniform('uProjectionMatrix',
                                    this.orthoProjection.matrix);

        this.orthoModelview = new webglet.MatrixStack();
        this.texRenderer.setUniform('uModelviewMatrix',
                                    this.orthoModelview.matrix);

        this.textureMesh = new webglet.RectMesh(163, 75, gl.STATIC_DRAW, null,
                                                null, gl.STATIC_DRAW);
    };
    TextureExample.prototype = Object.create(webglet.App.prototype);
    TextureExample.prototype.constructor = TextureExample;

    TextureExample.prototype.draw = function() {
        this.updateViewport();
        gl.clear(gl.COLOR_BUFFER_BIT)
        this.texture.begin();
        this.texRenderer.render(this.textureMesh);
        this.texture.end();
        window.requestAnimationFrame(this.draw.bind(this));
    };

    TextureExample.prototype.run = function() {
        window.requestAnimationFrame(this.draw.bind(this));
    };

    window.app = new TextureExample({
        canvas: document.getElementById('main-canvas'),
        debug: true
    });
    window.app.run();
};
