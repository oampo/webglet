/**
 * @depends App.js
 * @depends Shader.js
 * @depends Attribute.js
 * @depends Uniform.js
 */

var ShaderProgram = new Class({
    initialize: function() {
    },

    program: null,
    shaders: {},
    shaderIds: [],
    uniforms: {},
    attributes: {},
    needRecompile: true,

    addShader: function(shaderId) {
        var shader = new Shader(shaderId);
        this.shaders.shaderId = shader;
        this.shaderIds.push(shaderId);
        needRecompile = true;
    },

    removeShader: function(shaderId) {
        for (var i = 0; i < this.shaderIds.length; i++) {
            if (this.shadersIds[i] == shaderId) {
                delete this.shaders[i];
            }
        }
        delete this.shaders.shaderId;
        needRecompile = true;
    },

    createProgram: function() {
        this.program = gl.createProgram();
    },

    deleteProgram: function() {
        gl.deleteProgram(this.program);
    },

    attachShaders: function() {
        for (var i = 0; i < this.shadersIds.length; i++) {
            var shader = this.shaders[this.shaderIds[i]];
            gl.attachShader(this.program, shader.getShader());
        }
    },

    getAttributes(): function() {
        var numAttributes = gl.getProgramParameter(this.program,
                                                   gl.ACTIVE_ATTRIBUTES);
        for (var i = 0; i < numAttributes; i++) {
            var attributeInfo = gl.getActiveAttribute(this.program, i);
            var attribute = new Attribute(attributeInfo, this.program);
            attributes[attribute.name] = attribute;
        }
    },

    getUniforms(): function() {
        var numUniforms = gl.getProgramParameter(this.program,
                                                 gl.ACTIVE_UNIFORMS);
        for (var i = 0; i < numUniforms; i++) {
            var uniformInfo = gl.getActiveUniform(this.program, i);
            var uniform = new Uniform(uniformInfo, this.program);
            uniforms[uniform.name] = uniform;
        }
    },


    linkProgram: function() {
        gl.linkProgram(this.program);
    },

    useProgram: function() {
        gl.useProgram(this.program);
    },

    use: function() {
        if (needRecompile) {
            if (this.program !== null) {
                this.deleteProgram();
            }
            this.createProgram();
            this.attachShaders();
            this.linkProgram();
            this.getAttributes();
            this.getUniforms();
            needRecompile = false;
        }
        this.useProgram();
    },

    getUniform: function(name) {
        return (this.uniforms[name]);
    },

    getAttribute: function(name) {
        return (this.attributes[name]);
    }
});
