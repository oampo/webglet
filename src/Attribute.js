/**
 * @depends App.js
 */

var Attribute = new Class({
    initialize: function(attribInfo, program) {
        this.size = attribInfo.size;
        this.type = attribInfo.type;
        this.name = attribInfo.name;
        this.location = gl.getAttribLocation(program, this.name);
        this.createFunctionHashes();
        this.createSizeHash();
    },

    createFunctionHashes: function() {
        this.floatFunctions = {};
        this.floatFunctions[gl.FLOAT] = gl.attrib1fv;
        this.floatFunctions[gl.FLOAT_VEC2] = gl.attrib2fv;
        this.floatFunctions[gl.FLOAT_VEC3] = gl.attrib3fv;
        this.floatFunctions[gl.FLOAT_VEC4] = gl.attrib4fv;

        this.matrixFunctions = {};
        this.matrixFunctions[gl.FLOAT_MAT2] = gl.attrib2fv;
        this.matrixFunctions[gl.FLOAT_MAT3] = gl.attrib3fv;
        this.matrixFunctions[gl.FLOAT_MAT4] = gl.attrib4fv;
    },

    createSizeHash: function() {
        this.sizes = {};
        this.sizes[gl.FLOAT] = 1;
        this.sizes[gl.FLOAT_VEC2] = 2;
        this.sizes[gl.FLOAT_VEC3] = 3;
        this.sizes[gl.FLOAT_VEC4] = 4;
        this.sizes[gl.FLOAT_MAT2] = 4;
        this.sizes[gl.FLOAT_MAT3] = 9;
        this.sizes[gl.FLOAT_MAT4] = 16;
    },

    setValue: function(value) {
        if (this.floatFunctions[this.type]) {
            this.setFloat(value);
        }
        else if (this.matrixFunctions[this.type]) {
            this.setMatrix(value);
        }
    },

    setFloat: function(value) {
        this.floatFunctions[this.type].apply(gl, [this.location, value]);
    },

    setMatrix: function(value) {
        this.matrixFunctions[this.type].apply(gl, [this.location, value]);
    },

    setPointer: function() {
        gl.enableVertexAttribArray(this.location);
        gl.vertexAttribPointer(this.location, this.sizes[this.type],
                               gl.FLOAT, false, 0, 0);
    }
});
