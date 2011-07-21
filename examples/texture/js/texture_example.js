window.onload = function() {
    var TextureExample = function(element, options) {
        App.call(this, element, options);
        this.texture = new Texture(163, 75);
        this.texture.load("WebGL_logo.png");
        
        // For rendering the texture to the screen
        this.texRenderer = new BasicRenderer('texture-vert',
                                             'texture-frag');

        this.orthoProjection = new MatrixStack();
        mat4.ortho(0, this.options.width, this.options.height, 0, -1, 1,
                   this.orthoProjection.matrix);
        this.texRenderer.setUniform('uProjectionMatrix',
                                    this.orthoProjection.matrix);

        this.orthoModelview = new MatrixStack();
        this.texRenderer.setUniform('uModelviewMatrix',
                                    this.orthoModelview.matrix);

        this.textureMesh = new RectMesh(163, 75, gl.STATIC_DRAW, null,
                                        null, gl.STATIC_DRAW);
    };
    extend(TextureExample, App);

    TextureExample.prototype.draw = function() {
        this.clear([1, 1, 1, 1]);
        this.texture.begin();
        this.texRenderer.render(this.textureMesh);
        this.texture.end();
    };

    window.app = new TextureExample(document.body);
    window.app.run();
};
