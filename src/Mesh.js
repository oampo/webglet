var Mesh = function(numVertices, drawMode, vertexUsage, colorUsage,
                    normalUsage, texCoordUsage) {
    this.numVertices = numVertices;
    this.drawMode = drawMode;
    this.buffers = {};

    this.createBuffer('vertex', numVertices, 3, vertexUsage);
    if (colorUsage) {
        this.createBuffer('color', numVertices, 4, colorUsage);
    }
    if (normalUsage) {
        this.createBuffer('normal', numVertices, 3, normalUsage);
    }
    if (texCoordUsage) {
        this.createBuffer('texCoord', numVertices, 2, texCoordUsage);
    }
};

Mesh.prototype.createBuffer = function(name, numVertices, stride, usage) {
    this.buffers[name] = new Buffer(numVertices, stride, usage);
    // Also store the buffer in this, for ease of access and backwards
    // compatibility
    this[name + 'Buffer'] = this.buffers[name];
};

Mesh.prototype.associate = function(shaderProgram) {
    for (var bufferName in this.buffers) {
        var buffer = this.buffers[bufferName];
        // Convert bufferName to aAttributeName
        var attributeName = 'a' + bufferName.charAt(0).toUpperCase() +
                            bufferName.slice(1);
        var attribute = shaderProgram.getAttribute(attributeName);
        if (!attribute) {
            console.error('Could not associate ' + attributeName +
                          ' attribute');
        }
        buffer.associate(attribute);
    }
};

Mesh.prototype.render = function(offset, numberOfVertices) {
    if (numberOfVertices == null) {
        numberOfVertices = this.numVertices;
    }
    gl.drawArrays(this.drawMode, offset || 0, numberOfVertices);
};

