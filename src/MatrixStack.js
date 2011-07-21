var MatrixStack = function() {
    this.stack = [];
    this.matrix = mat4.create();
    mat4.identity(this.matrix);
};

MatrixStack.prototype.pushMatrix = function() {
    var newMatrix = mat4.create();
    mat4.set(this.matrix, newMatrix);
    this.stack.push(newMatrix);
};

MatrixStack.prototype.popMatrix = function() {
    if (this.stack.length > 0) {
        this.matrix = this.stack.pop();
    }
};
