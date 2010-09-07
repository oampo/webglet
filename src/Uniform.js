/**
 * @depends App.js
 */

var UniformFloatFunctions = new Hash();
UniformFloatFunctions.set(gl.FLOAT, gl.uniform1fv);
UniformFloatFunctions.set(gl.FLOAT_VEC2, gl.uniform2fv);
UniformFloatFunctions.set(gl.FLOAT_VEC3, gl.uniform3fv);
UniformFloatFunctions.set(gl.FLOAT_VEC4, gl.uniform4fv);

var UniformIntFunctions = new Hash();
UniformIntFunctions.set(gl.INT, gl.uniform1iv);
UniformIntFunctions.set(gl.INT_VEC2, gl.uniform2iv);
UniformIntFunctions.set(gl.INT_VEC3, gl.uniform3iv);
UniformIntFunctions.set(gl.INT_VEC4, gl.uniform4iv);

var UniformBoolFunctions = new Hash();
UniformBoolFunctions.set(gl.BOOL, gl.uniform1iv);
UniformBoolFunctions.set(gl.BOOL_VEC2, gl.uniform2iv);
UniformBoolFunctions.set(gl.BOOL_VEC3, gl.uniform3iv);
UniformBoolFunctions.set(gl.BOOL_VEC4, gl.unform4iv);

var UniformMatrixFunctions = new Hash();
UniformMatrixFunctions.set(gl.FLOAT_MAT_2, gl.uniformMatrix2fv);
UniformMatrixFunctions.set(gl.FLOAT_MAT_3, gl.uniformMatrix3fv);
UniformMatrixFunctions.set(gl.FLOAT_MAT_4, gl.uniformMatrix4fv);

var UniformSamplerFunctions = new Hash();
UniformSamplerFunctions.set(gl.SAMPLER_2D, gl.uniform1iv);
UniformSamplerFunctions.set(gl.SAMPLER_CUBE, gl.uniform1iv);

var Uniform = new Class({
    initialize: function(uniformInfo, program) {
        this.size = uniformInfo.size;
        this.type = uniformInfo.type;
        this.name = uniformInfo.name;
        this.location = gl.getUniformLocation(this.program, this.name);
    },

    setValues: function(values) {
        if (UniformFloatFunctions.has(this.type)) {
            this.setFloat(values);
        }
        else if (UniformIntFunctions.has(this.type)) {
            this.setInt(values);
        }
        else if (UniformBoolFunctions.has(this.type)) {
            this.setBool(values);
        }
        else if (UniformMatrixFunctions.has(this.type)) {
            this.setMatrix(values);
        }
        else if (UniformSamplerFunctions.has(this.type)) {
            this.setSampler(values);
        }
    },

    setFloat: function(values) {
        (UniformFloatFunctions[this.type])(this.location, values);
    },

    setInt: function(values) {
        (UniformIntFunctions[this.type])(this.location, values);
    },

    setBool: function(values) {
        (UniformBoolFunctions[this.type])(this.location, values);
    },

    setMatrix: function(values) {
        (UniformMatrixFunctions[this.type])(this.location, false, values);
    },

    setSampler: function(values) {
        (UniformSamplerFunctions[this.type])(this.location, values);
    }
});
