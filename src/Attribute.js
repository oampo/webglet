/**
 * @depends App.js
 */

var Attribute = new Class({
    initialize: function(attribInfo, program) {
        this.size = attribInfo.size;
        this.type = attribInfo.type;
        this.name = attribInfo.name;
        this.location = gl.getAttribLocation(this.program, this.name);
        this.createFunctionHashes();
        this.createSizeHash();
    },

    createFunctionHashes: function() {
        this.floatFunctions = new Hash();
        this.floatFunctions.set(gl.FLOAT, gl.attrib1fv);
        this.floatFunctions.set(gl.FLOAT_VEC2, gl.attrib2fv);
        this.floatFunctions.set(gl.FLOAT_VEC3, gl.attrib3fv);
        this.floatFunctions.set(gl.FLOAT_VEC4, gl.attrib4fv);

        this.matrixFunctions = new Hash();
        this.matrixFunctions.set(gl.FLOAT_MAT_2, gl.attrib2fv);
        this.matrixFunctions.set(gl.FLOAT_MAT_3, gl.attrib3fv);
        this.matrixFunctions.set(gl.FLOAT_MAT_4, gl.attrib4fv);
    },

    createSizeHash: function() {
        this.sizes = new Hash();
        this.sizes.set(gl.FLOAT, 1);
        this.sizes.set(gl.FLOAT_VEC2, 2);
        this.sizes.set(gl.FLOAT_VEC3, 3);
        this.sizes.set(gl.FLOAT_VEC4, 4);
        this.sizes.set(gl.FLOAT_MAT_2, 4);
        this.sizes.set(gl.FLOAT_MAT_3, 9);
        this.sizes.set(gl.FLOAT_MAT_4, 16);
    },

    setValue: function(value) {
        if (this.floatFunctions.has(this.type)) {
            this.setFloat(value);
        }
        else if (this.matrixFunctions.has(this.type)) {
            this.setMatrix(value);
        }
    },

    setFloat: function(value) {
        (this.floatFunctions[this.type])(this.location, value);
    },

    setMatrix: function(value) {
        (this.matrixFunctions[this.type])(this.location, value);
    },

    setPointer: function() {
        gl.enableVertexAttribArray(this.location);
        gl.vertexAttribPointer(this.location, this.sizes[this.type],
                               gl.FLOAT, false, 0, 0);
    }
});
