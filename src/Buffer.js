/**
 * @depends App.js
 */

var Buffer = new Class({
    initialize: function(numItems, itemSize, usage) {
        this.numVertices = numItems;
        this.itemSize = itemSize;
        this.usage = usage;
        // Set up the buffer with no data
        this.buffer = gl.createBuffer();
        this.bind();
        gl.bufferData(gl.ARRAY_BUFFER,
                      numItems * itemSize * 4, // 4 is size (bytes) of Float32 
                      this.usage);
    },

    setValues: function(values) {
        this.bind();
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(values));
    },

    bind: function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    },

    unbind: function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    },

    associate: function(attribute) {
        this.bind();
        attribute.setPointer();
        this.unbind();
    }
});

