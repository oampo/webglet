var UniformFloatFunctions = new Hash({
    gl.FLOAT: gl.uniform1fv,
    gl.FLOAT_VEC2: gl.uniform2fv,
    gl.FLOAT_VEC3: gl.uniform3fv,
    gl.FLOAT_VEC4: gl.uniform4fv
});
var UniformIntFunctions = new Hash({
    gl.INT: gl.uniform1iv,
    gl.INT_VEC2: gl.uniform2iv,
    gl.INT_VEC3: gl.uniform3iv,
    gl.INT_VEC4: gl.uniform4iv
});
var UniformBoolFunctions = new Hash({
    gl.BOOL: gl.uniform1iv,
    gl.BOOL_VEC2: gl.uniform2iv,
    gl.BOOL_VEC3: gl.uniform3iv,
    gl.BOOL_VEC4: gl.unform4iv
});
var UniformMatrixFunctions = new Hash({
    gl.FLOAT_MAT_2: gl.uniformMatrix2fv,
    gl.FLOAT_MAT_3: gl.uniformMatrix3fv,
    gl.FLOAT_MAT_4: gl.uniformMatrix4fv
});
var UniformSamplerFunctions = new Hash({
    gl.SAMPLER_2D: gl.uniform1iv,
    gl.SAMPLER_CUBE: gl.uniform1iv
});

var Uniform = new Class({
    initialize: function(uniformInfo, program) {
        this.size = uniformInfo.size;
        this.type = uniformInfo.type;
        this.name = uniformInfo.name;
        this.location = gl.getUniformLocation(this.program, this.name);
    },

    setValues: function(values) {
        if (UniformFloatFunctions.has(this.type)) {
            setFloat(values);
        }
        else if (UniformIntFunctions.has(this.type)) {
            setInt(values);
        }
        else if (UniformBoolFunctions.has(this.type)) {
            setBool(values);
        }
        else if (UniformMatrixFunctions.has(this.type)) {
            setMatrix(values);
        }
        else if (UniformSamplerFunctions.has(this.type)) {
            setSampler(values);
        }
    },

    setFloat: function(values) {
        (UniformFloatFunctions[this.type])(this.location, values)
    },
    
    setInt: function(values) {
        (UniformIntFunctions[this.type])(this.location, values)
    },

    setBool: function(values) {
        (UniformBoolFunctions[this.type])(this.location, values)
    },

    setMatrix: function(values) {
        (UniformMatrixFunctions[this.type])(this.location, false, values)
    },

    setSampler: function(values) {
        (UniformSamplerFunctions[this.type])(this.location, values)
    }
});
