var ShaderProgram = function() {
    this.program = null;
    this.shaders = {};
    this.shaderIds = [];
    this.uniforms = {};
    this.attributes = {};
    this.needRecompile = true;
};

ShaderProgram.prototype.addShader = function(shaderId) {
    var shader = new Shader(shaderId);
    this.shaders[shaderId] = shader;
    this.shaderIds.push(shaderId);
    this.needRecompile = true;
};

ShaderProgram.prototype.removeShader = function(shaderId) {
    for (var i = 0; i < this.shaderIds.length; i++) {
        if (this.shaderIds[i] == shaderId) {
            delete this.shaderIds[i];
        }
    }
    delete this.shaders[shaderId];
    this.needRecompile = true;
};

ShaderProgram.prototype.createProgram = function() {
    this.program = gl.createProgram();
};

ShaderProgram.prototype.deleteProgram = function() {
    gl.deleteProgram(this.program);
};

ShaderProgram.prototype.attachShaders = function() {
    for (var i = 0; i < this.shaderIds.length; i++) {
        var shader = this.shaders[this.shaderIds[i]];
        gl.attachShader(this.program, shader.getShader());
    }
};

ShaderProgram.prototype.getAttributes = function() {
    var numAttributes = gl.getProgramParameter(this.program,
                                               gl.ACTIVE_ATTRIBUTES);
    console.log('Program %i has %i active attributes', this.program,
                numAttributes);
    for (var i = 0; i < numAttributes; i++) {
        var attributeInfo = gl.getActiveAttrib(this.program, i);
        var attribute = new Attribute(attributeInfo, this.program);
        this.attributes[attribute.name] = attribute;
        console.log('Attribute %i: %s', i, attribute.name);
    }
};

ShaderProgram.prototype.getUniforms = function() {
    var numUniforms = gl.getProgramParameter(this.program,
                                             gl.ACTIVE_UNIFORMS);
    console.log('Program %i has %i active uniforms', this.program,
                numUniforms);
    for (var i = 0; i < numUniforms; i++) {
        var uniformInfo = gl.getActiveUniform(this.program, i);
        var uniform = new Uniform(uniformInfo, this.program);
        this.uniforms[uniform.name] = uniform;
        console.log('Uniform %i: %s', i, uniform.name);
    }
};

ShaderProgram.prototype.linkProgram = function() {
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        console.error('Could not link shader program, %i', this.program);
        return (false);
    }
    return (true);
};

ShaderProgram.prototype.useProgram = function() {
    gl.useProgram(this.program);
};

ShaderProgram.prototype.use = function() {
    if (this.needRecompile ||
        ShaderProgram.activeProgram != this.program) {
        if (this.needRecompile) {
            if (this.program !== null) {
                this.deleteProgram();
            }
            this.createProgram();
            this.attachShaders();
            this.linkProgram();
            this.getAttributes();
            this.getUniforms();
            this.needRecompile = false;
        }
        this.useProgram();
        ShaderProgram.activeProgram = this.program;
    }
};

ShaderProgram.prototype.getUniform = function(name) {
    return (this.uniforms[name]);
};

ShaderProgram.prototype.setUniform = function(name, value) {
    this.use();
    this.uniforms[name].setValue(value);
};

ShaderProgram.prototype.getAttribute = function(name) {
    return (this.attributes[name]);
};

ShaderProgram.prototype.setAttribute = function(name, value) {
    this.use();
    this.attributes[name].setValue(value);
};

ShaderProgram.activeProgram = null;
