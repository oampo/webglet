

var Shader = function(shaderId) {
    this.name = shaderId;
    var sourceElement = document.getElementById(this.name);
    var typeString = sourceElement.type;
    if (typeString == 'x-shader/x-vertex') {
        this.type = gl.VERTEX_SHADER;
    }
    else if (typeString == 'x-shader/x-fragment') {
        this.type = gl.FRAGMENT_SHADER;
    }

    console.log('Creating %s shader %s', typeString, this.name);
    this.shader = gl.createShader(this.type);

    gl.shaderSource(this.shader, sourceElement.text);
    gl.compileShader(this.shader);

    if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
        console.error('Could not compile shader ', this.name, '\n',
                      gl.getShaderInfoLog(this.shader));
    }
};

Shader.prototype.getShader = function() {
    return (this.shader);
};
