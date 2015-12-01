var Shader = function(source, type) {
    this.source = source;
    this.type = type;

    this.shader = gl.createShader(this.type);

    gl.shaderSource(this.shader, this.source);
    gl.compileShader(this.shader);

    if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
        console.error('Could not compile shader ', this.name, '\n',
                      gl.getShaderInfoLog(this.shader));
    }
};

Shader.prototype.getShader = function() {
    return (this.shader);
};

exports.Shader = Shader;
