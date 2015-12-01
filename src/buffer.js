var Buffer = function(numVertices, itemSize, usage) {
    this.numVertices = numVertices;
    this.itemSize = itemSize;
    this.usage = usage;
    // Set up the buffer with no data
    this.buffer = gl.createBuffer();
    this.null();
    this.array = new Float32Array(numVertices * itemSize);
};

Buffer.prototype.getBuffer = function() {
    return this.buffer;
};

Buffer.prototype.null = function() {
    this.bind();
    // Num vertices multiplied by 4, which is size (bytes) of Float32
    gl.bufferData(gl.ARRAY_BUFFER,
                  this.numVertices * this.itemSize * 4,
                  this.usage);
};

Buffer.prototype.setValues = function(values, offset, length) {
    offset = offset || 0;
    if (length === undefined) {
        if (values) {
            length = values.length;
        }
        else {
            length = this.array.length;
        }
    }

    if (length == 0) {
        return;
    }

    var array = this.array.subarray(offset, length);
    if (values) {
        array.set(values);
    }
    this.bind();
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, array);
};

Buffer.prototype.bind = function() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
};

Buffer.prototype.unbind = function() {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

Buffer.prototype.associate = function(attribute) {
    this.bind();
    attribute.setPointer();
    this.unbind();
};

exports.Buffer = Buffer;
