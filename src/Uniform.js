/**
 * @depends App.js
 */

var Uniform = new Class({
    initialize: function(uniformInfo, program) {
        this.size = uniformInfo.size;
        this.type = uniformInfo.type;
        this.name = uniformInfo.name;
        this.location = gl.getUniformLocation(this.program, this.name);
        this.createFunctionHashes();
    },

    createFunctionHashes: function() {
        this.floatFunctions = new Hash();
        this.floatFunctions.set(gl.FLOAT, gl.uniform1fv);
        this.floatFunctions.set(gl.FLOAT_VEC2, gl.uniform2fv);
        this.floatFunctions.set(gl.FLOAT_VEC3, gl.uniform3fv);
        this.floatFunctions.set(gl.FLOAT_VEC4, gl.uniform4fv);

        this.intFunctions = new Hash();
        this.intFunctions.set(gl.INT, gl.uniform1iv);
        this.intFunctions.set(gl.INT_VEC2, gl.uniform2iv);
        this.intFunctions.set(gl.INT_VEC3, gl.uniform3iv);
        this.intFunctions.set(gl.INT_VEC4, gl.uniform4iv);

        this.boolFunctions = new Hash();
        this.boolFunctions.set(gl.BOOL, gl.uniform1iv);
        this.boolFunctions.set(gl.BOOL_VEC2, gl.uniform2iv);
        this.boolFunctions.set(gl.BOOL_VEC3, gl.uniform3iv);
        this.boolFunctions.set(gl.BOOL_VEC4, gl.unform4iv);

        this.matrixFunctions = new Hash();
        this.matrixFunctions.set(gl.FLOAT_MAT_2, gl.uniformMatrix2fv);
        this.matrixFunctions.set(gl.FLOAT_MAT_3, gl.uniformMatrix3fv);
        this.matrixFunctions.set(gl.FLOAT_MAT_4, gl.uniformMatrix4fv);

        this.samplerFunctions = new Hash();
        this.samplerFunctions.set(gl.SAMPLER_2D, gl.uniform1iv);
        this.samplerFunctions.set(gl.SAMPLER_CUBE, gl.uniform1iv);
    },

    setValue: function(value) {
        if (this.floatFunctions.has(this.type)) {
            this.setFloat(value);
        }
        else if (this.intFunctions.has(this.type)) {
            this.setInt(value);
        }
        else if (this.boolFunctions.has(this.type)) {
            this.setBool(value);
        }
        else if (this.matrixFunctions.has(this.type)) {
            this.setMatrix(value);
        }
        else if (this.samplerFunctions.has(this.type)) {
            this.setSampler(value);
        }
    },

    setFloat: function(value) {
        (this.floatFunctions[this.type])(this.location, value);
    },

    setInt: function(value) {
        (this.intFunctions[this.type])(this.location, value);
    },

    setBool: function(value) {
        (this.boolFunctions[this.type])(this.location, value);
    },

    setMatrix: function(value) {
        (this.matrixFunctions[this.type])(this.location, false, value);
    },

    setSampler: function(value) {
        (this.samplerFunctions[this.type])(this.location, value);
    }
});
