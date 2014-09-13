var Attribute = function(attribInfo, program) {
    this.size = attribInfo.size;
    this.type = attribInfo.type;
    this.name = attribInfo.name;
    this.location = gl.getAttribLocation(program, this.name);
    this.createFunctionHashes();
    this.createSizeHash();
};

Attribute.prototype.createFunctionHashes = function() {
    this.floatFunctions = {};
    this.floatFunctions[gl.FLOAT] = gl.vertexAttrib1fv;
    this.floatFunctions[gl.FLOAT_VEC2] = gl.vertexAttrib2fv;
    this.floatFunctions[gl.FLOAT_VEC3] = gl.vertexAttrib3fv;
    this.floatFunctions[gl.FLOAT_VEC4] = gl.vertexAttrib4fv;

    this.matrixFunctions = {};
    this.matrixFunctions[gl.FLOAT_MAT2] = gl.vertexAttrib2fv;
    this.matrixFunctions[gl.FLOAT_MAT3] = gl.vertexAttrib3fv;
    this.matrixFunctions[gl.FLOAT_MAT4] = gl.vertexAttrib4fv;
};

Attribute.prototype.createSizeHash = function() {
    this.sizes = {};
    this.sizes[gl.FLOAT] = 1;
    this.sizes[gl.FLOAT_VEC2] = 2;
    this.sizes[gl.FLOAT_VEC3] = 3;
    this.sizes[gl.FLOAT_VEC4] = 4;
    this.sizes[gl.FLOAT_MAT2] = 4;
    this.sizes[gl.FLOAT_MAT3] = 9;
    this.sizes[gl.FLOAT_MAT4] = 16;
};

Attribute.prototype.setValue = function(value) {
    if (typeof value == 'number') {
        value = [value];
    }
    if (this.floatFunctions[this.type]) {
        this.setFloat(value);
    }
    else if (this.matrixFunctions[this.type]) {
        this.setMatrix(value);
    }
};

Attribute.prototype.setFloat = function(value) {
    this.floatFunctions[this.type].apply(gl, [this.location, value]);
};

Attribute.prototype.setMatrix = function(value) {
    this.matrixFunctions[this.type].apply(gl, [this.location, value]);
};

Attribute.prototype.setPointer = function() {
    gl.enableVertexAttribArray(this.location);
    gl.vertexAttribPointer(this.location, this.sizes[this.type],
                           gl.FLOAT, false, 0, 0);
};
