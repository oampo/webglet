var Shader = require('./shader').Shader;
var Attribute = require('./attribute').Attribute;
var Uniform = require('./uniform').Uniform;

var ShaderProgram = function() {
    this.id = ShaderProgram.id;
    ShaderProgram.id += 1;

    this.program = null;
    this.shaders = [];
    this.uniforms = {};
    this.attributes = {};
    this.needRecompile = true;
};

ShaderProgram.id = 0;

ShaderProgram.prototype.addShader = function(source, type) {
    var shader = new Shader(source, type);
    this.shaders.push(shader);
    this.needRecompile = true;
    return shader;
};

ShaderProgram.prototype.removeShader = function(shader) {
    var index = this.shaders.indexOf(shader);
    if (index != -1) {
        this.shaders.splice(index, 1);
    }
    this.needRecompile = true;
};

ShaderProgram.prototype.createProgram = function() {
    this.program = gl.createProgram();
};

ShaderProgram.prototype.deleteProgram = function() {
    gl.deleteProgram(this.program);
};

ShaderProgram.prototype.attachShaders = function() {
    for (var i = 0; i < this.shaders.length; i++) {
        var shader = this.shaders[i];
        gl.attachShader(this.program, shader.getShader());
    }
};

ShaderProgram.prototype.getAttributes = function() {
    var numAttributes = gl.getProgramParameter(this.program,
                                               gl.ACTIVE_ATTRIBUTES);
    console.log('Program %d has %d active attributes', this.id,
                numAttributes);
    for (var i = 0; i < numAttributes; i++) {
        var attributeInfo = gl.getActiveAttrib(this.program, i);
        var attribute = new Attribute(attributeInfo, this.program);
        this.attributes[attribute.name] = attribute;
        console.log('Attribute %d: %s', i, attribute.name);
    }
};

ShaderProgram.prototype.getUniforms = function() {
    var numUniforms = gl.getProgramParameter(this.program,
                                             gl.ACTIVE_UNIFORMS);
    console.log('Program %d has %d active uniforms', this.id,
                numUniforms);
    for (var i = 0; i < numUniforms; i++) {
        var uniformInfo = gl.getActiveUniform(this.program, i);
        var uniform = new Uniform(uniformInfo, this.program);
        this.uniforms[uniform.name] = uniform;
        console.log('Uniform %d: %s', i, uniform.name);
    }
};

ShaderProgram.prototype.linkProgram = function() {
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        console.error('Could not link shader program, %i', this.program);
        return false;
    }
    return true;
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
    return this.uniforms[name];
};

ShaderProgram.prototype.setUniform = function(name, value) {
    this.use();
    this.uniforms[name].setValue(value);
};

ShaderProgram.prototype.getAttribute = function(name) {
    return this.attributes[name];
};

ShaderProgram.prototype.setAttribute = function(name, value) {
    this.use();
    this.attributes[name].setValue(value);
};

ShaderProgram.activeProgram = null;

exports.ShaderProgram = ShaderProgram;
