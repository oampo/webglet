/**
 * @depends App.js
 * @depends Buffer.js
 * @depends Mesh.js
 */

var RectMesh = new Class({
    Extends: Mesh,
    initialize: function(width, height, vertexUsage, colorUsage, normalUsage,
                         texCoordUsage) {
        this.parent(4, gl.TRIANGLE_STRIP, vertexUsage, colorUsage, normalUsage,
                    texCoordUsage);

        this.vertexBuffer.setValues([0,     0,      0,
                                     0,     height, 0,
                                     width,     0, 0,
                                     width, height, 0]);
        if ($chk(this.texCoordUsage)) {
            this.texCoordBuffer.setValues([0, 1,
                                           0, 0,
                                           1, 1,
                                           1, 0]);
        }
    }
});

