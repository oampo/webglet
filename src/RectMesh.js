/**
 * @depends App.js
 * @depends Buffer.js
 * @depends Mesh.js
 */

var RectMesh = function(width, height, vertexUsage, colorUsage, normalUsage,
                        texCoordUsage) {
    Mesh.call(this, 4, gl.TRIANGLE_STRIP, vertexUsage, colorUsage,
              normalUsage, texCoordUsage);

    this.vertexBuffer.setValues([0, 0, 0,
                                 0, height, 0,
                                 width, 0, 0,
                                 width, height, 0]);
    if (texCoordUsage) {
        this.texCoordBuffer.setValues([0, 1,
                                       0, 0,
                                       1, 1,
                                       1, 0]);
    }
};
extend(RectMesh, Mesh);

