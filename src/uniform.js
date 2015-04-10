var Uniform = function(uniformInfo, program) {
    this.size = uniformInfo.size;
    this.type = uniformInfo.type;
    this.name = uniformInfo.name;
    this.location = gl.getUniformLocation(program, this.name);
    this.createFunctionHashes();
};

Uniform.prototype.createFunctionHashes = function() {
    this.floatFunctions = {};
    this.floatFunctions[gl.FLOAT] = gl.uniform1fv;
    this.floatFunctions[gl.FLOAT_VEC2] = gl.uniform2fv;
    this.floatFunctions[gl.FLOAT_VEC3] = gl.uniform3fv;
    this.floatFunctions[gl.FLOAT_VEC4] = gl.uniform4fv;

    this.intFunctions = {};
    this.intFunctions[gl.INT] = gl.uniform1iv;
    this.intFunctions[gl.INT_VEC2] = gl.uniform2iv;
    this.intFunctions[gl.INT_VEC3] = gl.uniform3iv;
    this.intFunctions[gl.INT_VEC4] = gl.uniform4iv;

    this.boolFunctions = {};
    this.boolFunctions[gl.BOOL] = gl.uniform1iv;
    this.boolFunctions[gl.BOOL_VEC2] = gl.uniform2iv;
    this.boolFunctions[gl.BOOL_VEC3] = gl.uniform3iv;
    this.boolFunctions[gl.BOOL_VEC4] = gl.unform4iv;

    this.matrixFunctions = {};
    this.matrixFunctions[gl.FLOAT_MAT2] = gl.uniformMatrix2fv;
    this.matrixFunctions[gl.FLOAT_MAT3] = gl.uniformMatrix3fv;
    this.matrixFunctions[gl.FLOAT_MAT4] = gl.uniformMatrix4fv;

    this.samplerFunctions = {};
    this.samplerFunctions[gl.SAMPLER_2D] = gl.uniform1iv;
    this.samplerFunctions[gl.SAMPLER_CUBE] = gl.uniform1iv;
};

Uniform.prototype.setValue = function(value) {
    if (typeof value == 'number') {
        value = [value];
    }
    if (this.floatFunctions[this.type]) {
        this.setFloat(value);
    }
    else if (this.intFunctions[this.type]) {
        this.setInt(value);
    }
    else if (this.boolFunctions[this.type]) {
        this.setBool(value);
    }
    else if (this.matrixFunctions[this.type]) {
        this.setMatrix(value);
    }
    else if (this.samplerFunctions[this.type]) {
        this.setSampler(value);
    }
};

Uniform.prototype.setFloat = function(value) {
    this.floatFunctions[this.type].apply(gl, [this.location, value]);
};

Uniform.prototype.setInt = function(value) {
    this.intFunctions[this.type].apply(gl, [this.location, value]);
};

Uniform.prototype.setBool = function(value) {
    this.boolFunctions[this.type].apply(gl, [this.location, value]);
};

Uniform.prototype.setMatrix = function(value) {
    this.matrixFunctions[this.type].apply(gl, [this.location, false,
                                               value]);
};

Uniform.prototype.setSampler = function(value) {
    this.samplerFunctions[this.type].apply(gl, [this.location, value]);
};

exports.Uniform = Uniform;
