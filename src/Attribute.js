var AttributeFloatFunctions = new Hash({
    gl.FLOAT: gl.attrib1fv,
    gl.FLOAT_VEC2: gl.attrib2fv,
    gl.FLOAT_VEC3: gl.attrib3fv,
    gl.FLOAT_VEC4: gl.attrib4fv
});

var AttributeMatrixFunctions = new Hash({
    gl.FLOAT_MAT_2: gl.attrib2fv,
    gl.FLOAT_MAT_3: gl.attrib3fv,
    gl.FLOAT_MAT_4: gl.attrib4fv
});

var AttributeSizes = new Hash({
    gl.FLOAT: 1,
    gl.FLOAT_VEC2: 2,
    gl.FLOAT_VEC3: 3,
    gl.FLOAT_VEC4: 4,
    gl.FLOAT_MAT_2: 4,
    gl.FLOAT_MAT_3: 9,
    gl.FLOAT_MAT_4: 16
});


var Attribute = new Class({
    initialize: function(attribInfo, program) {
        this.size = attribInfo.size;
        this.type = attribInfo.type;
        this.name = attribInfo.name;
        this.location = gl.getAttribLocation(this.program, this.name);
    },

    setValues: function(values) {
        if (AttributeFloatFunctions.has(this.type)) {
            setFloat(values);
        }
        else if (AttributeMatrixFunctions.has(this.type)) {
            setMatrix(values);
        }
        else if (UniformSamplerFunctions.has(this.type)) {
            setSampler(values);
        }
    },

    setFloat: function(values) {
        (AttributeFloatFunctions[this.type])(this.location, values)
    },
    
    setMatrix: function(values) {
        (AttributeMatrixFunctions[this.type])(this.location, values)
    },

    setPointer: function() {
        gl.enableVertexAttribArray(this.location);
        gl.vertexAttribPointer(this.location, AttributeSizes[this.type],
                               gl.FLOAT, false, 0, 0);
    }
});
