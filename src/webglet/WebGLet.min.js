var gl;

// Shim for subarray/slice
var Int8Array, Uint8Array, Int16Array, Uint16Array;
var Int32Array, Uint32Array, Float32Array, Float64Array;
var types = [Int8Array, Uint8Array, Int16Array, Uint16Array,
             Int32Array, Uint32Array, Float32Array, Float64Array];
var original, shim;
for (var i = 0; i < types.length; ++i) {
    if (types[i]) {
        if (types[i].prototype.slice === undefined) {
            original = "subarray";
            shim = "slice";
        }
        else if (types[i].prototype.subarray === undefined) {
            original = "slice";
            shim = "subarray";
        }
        Object.defineProperty(types[i].prototype, shim, {
            value: types[i].prototype[original],
            enumerable: false
        });
    }
}

// Shim for requestAnimationFrame
window.requestAnimationFrame = (function(){
    return window.requestAnimationFrame       || 
           window.webkitRequestAnimationFrame || 
           window.mozRequestAnimationFrame    || 
           window.oRequestAnimationFrame      || 
           window.msRequestAnimationFrame     || 
           function(/* function */ callback, /* DOMElement */ element){
               window.setTimeout(callback, 1000 / 60);
           };
})();


var App = function(element, options) {
    this.options = {
        name: 'webglet-app',
        width: 800,
        height: 600,
        frameRate: 60,
        antialias: true
    };
    for (var option in options) {
        this.options[option] = options[option];
    }
    this.element = element;
    this.createCanvas();
    this.frameCount = 0;
    this.running = false;
};

App.prototype.createCanvas = function() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    this.canvas.id = this.options.name;
    try {
        gl = this.canvas.getContext('experimental-webgl', {
                                        antialias: this.options.antialias
                                    });
        if (this.options.debug) {
            gl = WebGLDebugUtils.makeDebugContext(gl);
        }
        gl.viewport(0, 0, this.options.width, this.options.height);
    }
    catch (error) {
    }

    if (gl) {
        this.element.appendChild(this.canvas);
    }
    else {
        var alertDiv = document.createElement('div');
        var alertString = '<strong>WebGL not enabled</strong><br/>For ' +
            'instructions on how to get a WebGL enabled browser <a ' +
            'href="http://get.webgl.org">click here</a>';
        alertDiv.innerHTML = alertString;
        this.element.appendChild(alertDiv);
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].src;
            if (src) {
                src = src.trim();
                var index = src.search('WebGLet.js$|WebGLet.min.js$');
                if (index != -1) {
                    src = src.slice(0, index) + 'images/error.png';
                    var img = document.createElement('img');
                    img.src = src;
                    img.style = 'float: left';
                    alertDiv.insertBefore(img, alertDiv.firstChild);
                }
            }
        }
    }
};

App.prototype.preDraw = function() {
    this.frameCount += 1;
    this.draw();
    if (this.running) {
        requestAnimationFrame(this.preDraw.bind(this), this.canvas);
    }
};

App.prototype.draw = function() {
};

App.prototype.run = function() {
    this.running = true;
    requestAnimationFrame(this.preDraw.bind(this), this.canvas);
};

App.prototype.stop = function() {
    this.running = false;
};

App.prototype.clear = function(color) {
    gl.clearColor(color[0], color[1], color[2], color[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
};

App.prototype.getCanvasPosition = function() {
    var left = 0;
    var top = 0;
    var object = this.canvas;
    do {
        left += object.offsetLeft;
        top += object.offsetTop;
    } while (object = object.offsetParent);
    return [left, top];
};


/**
 * @depends App.js
 */

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



var Shader = function(shaderId) {
    this.name = shaderId;
    var sourceElement = document.getElementById(this.name);
    var typeString = sourceElement.type;
    if (typeString == 'x-shader/x-vertex') {
        this.type = gl.VERTEX_SHADER;
    }
    else if (typeString == 'x-shader/x-fragment') {
        this.type = gl.FRAGMENT_SHADER;
    }

    console.log('Creating %s shader %s', typeString, this.name);
    this.shader = gl.createShader(this.type);

    gl.shaderSource(this.shader, sourceElement.text);
    gl.compileShader(this.shader);

    if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
        console.error('Could not compile shader ', this.name, '\n',
                      gl.getShaderInfoLog(this.shader));
    }
};

Shader.prototype.getShader = function() {
    return (this.shader);
};

/**
 * @depends App.js
 */

var Uniform = function(uniformInfo, program) {
    this.size = uniformInfo.size;
    this.type = uniformInfo.type;
    this.name = uniformInfo.name;
    this.location = gl.getUniformLocation(program, this.name);
    this.createFunctionHashes();
};

Uniform.prototype.createFunctionHashes = function() {
    this.floatFunctions = {};
    this.floatFunctions[gl.FLOAT] = gl.uniform1fv;
    this.floatFunctions[gl.FLOAT_VEC2] = gl.uniform2fv;
    this.floatFunctions[gl.FLOAT_VEC3] = gl.uniform3fv;
    this.floatFunctions[gl.FLOAT_VEC4] = gl.uniform4fv;

    this.intFunctions = {};
    this.intFunctions[gl.INT] = gl.uniform1iv;
    this.intFunctions[gl.INT_VEC2] = gl.uniform2iv;
    this.intFunctions[gl.INT_VEC3] = gl.uniform3iv;
    this.intFunctions[gl.INT_VEC4] = gl.uniform4iv;

    this.boolFunctions = {};
    this.boolFunctions[gl.BOOL] = gl.uniform1iv;
    this.boolFunctions[gl.BOOL_VEC2] = gl.uniform2iv;
    this.boolFunctions[gl.BOOL_VEC3] = gl.uniform3iv;
    this.boolFunctions[gl.BOOL_VEC4] = gl.unform4iv;

    this.matrixFunctions = {};
    this.matrixFunctions[gl.FLOAT_MAT2] = gl.uniformMatrix2fv;
    this.matrixFunctions[gl.FLOAT_MAT3] = gl.uniformMatrix3fv;
    this.matrixFunctions[gl.FLOAT_MAT4] = gl.uniformMatrix4fv;

    this.samplerFunctions = {};
    this.samplerFunctions[gl.SAMPLER_2D] = gl.uniform1iv;
    this.samplerFunctions[gl.SAMPLER_CUBE] = gl.uniform1iv;
};

Uniform.prototype.setValue = function(value) {
    if (typeof value == 'number') {
        value = [value];
    }
    if (this.floatFunctions[this.type]) {
        this.setFloat(value);
    }
    else if (this.intFunctions[this.type]) {
        this.setInt(value);
    }
    else if (this.boolFunctions[this.type]) {
        this.setBool(value);
    }
    else if (this.matrixFunctions[this.type]) {
        this.setMatrix(value);
    }
    else if (this.samplerFunctions[this.type]) {
        this.setSampler(value);
    }
};

Uniform.prototype.setFloat = function(value) {
    this.floatFunctions[this.type].apply(gl, [this.location, value]);
};

Uniform.prototype.setInt = function(value) {
    this.intFunctions[this.type].apply(gl, [this.location, value]);
};

Uniform.prototype.setBool = function(value) {
    this.boolFunctions[this.type].apply(gl, [this.location, value]);
};

Uniform.prototype.setMatrix = function(value) {
    this.matrixFunctions[this.type].apply(gl, [this.location, false,
                                               value]);
};

Uniform.prototype.setSampler = function(value) {
    this.samplerFunctions[this.type].apply(gl, [this.location, value]);
};

/**
 * @depends App.js
 * @depends Shader.js
 * @depends Attribute.js
 * @depends Uniform.js
 */

var ShaderProgram = function() {
    this.program = null;
    this.shaders = {};
    this.shaderIds = [];
    this.uniforms = {};
    this.attributes = {};
    this.needRecompile = true;
};

ShaderProgram.prototype.addShader = function(shaderId) {
    var shader = new Shader(shaderId);
    this.shaders[shaderId] = shader;
    this.shaderIds.push(shaderId);
    this.needRecompile = true;
};

ShaderProgram.prototype.removeShader = function(shaderId) {
    for (var i = 0; i < this.shaderIds.length; i++) {
        if (this.shaderIds[i] == shaderId) {
            delete this.shaderIds[i];
        }
    }
    delete this.shaders[shaderId];
    this.needRecompile = true;
};

ShaderProgram.prototype.createProgram = function() {
    this.program = gl.createProgram();
};

ShaderProgram.prototype.deleteProgram = function() {
    gl.deleteProgram(this.program);
};

ShaderProgram.prototype.attachShaders = function() {
    for (var i = 0; i < this.shaderIds.length; i++) {
        var shader = this.shaders[this.shaderIds[i]];
        gl.attachShader(this.program, shader.getShader());
    }
};

ShaderProgram.prototype.getAttributes = function() {
    var numAttributes = gl.getProgramParameter(this.program,
                                               gl.ACTIVE_ATTRIBUTES);
    console.log('Program %i has %i active attributes', this.program,
                numAttributes);
    for (var i = 0; i < numAttributes; i++) {
        var attributeInfo = gl.getActiveAttrib(this.program, i);
        var attribute = new Attribute(attributeInfo, this.program);
        this.attributes[attribute.name] = attribute;
        console.log('Attribute %i: %s', i, attribute.name);
    }
};

ShaderProgram.prototype.getUniforms = function() {
    var numUniforms = gl.getProgramParameter(this.program,
                                             gl.ACTIVE_UNIFORMS);
    console.log('Program %i has %i active uniforms', this.program,
                numUniforms);
    for (var i = 0; i < numUniforms; i++) {
        var uniformInfo = gl.getActiveUniform(this.program, i);
        var uniform = new Uniform(uniformInfo, this.program);
        this.uniforms[uniform.name] = uniform;
        console.log('Uniform %i: %s', i, uniform.name);
    }
};

ShaderProgram.prototype.linkProgram = function() {
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        console.error('Could not link shader program, %i', this.program);
        return (false);
    }
    return (true);
};

ShaderProgram.prototype.useProgram = function() {
    gl.useProgram(this.program);
};

ShaderProgram.prototype.use = function() {
    if (this.needRecompile ||
        ShaderProgram.activeProgram != this.program) {
        if (this.needRecompile) {
            if (this.program !== null) {
                this.deleteProgram();
            }
            this.createProgram();
            this.attachShaders();
            this.linkProgram();
            this.getAttributes();
            this.getUniforms();
            this.needRecompile = false;
        }
        this.useProgram();
        ShaderProgram.activeProgram = this.program;
    }
};

ShaderProgram.prototype.getUniform = function(name) {
    return (this.uniforms[name]);
};

ShaderProgram.prototype.setUniform = function(name, value) {
    this.use();
    this.uniforms[name].setValue(value);
};

ShaderProgram.prototype.getAttribute = function(name) {
    return (this.attributes[name]);
};

ShaderProgram.prototype.setAttribute = function(name, value) {
    this.use();
    this.attributes[name].setValue(value);
};

ShaderProgram.activeProgram = null;

/**
 * @depends App.js
 * @depends ShaderProgram.js
 */

var BasicRenderer = function(vertexShader, fragmentShader) {
    this.shaderProgram = new ShaderProgram();
    this.shaderProgram.addShader(vertexShader);
    this.shaderProgram.addShader(fragmentShader);
    this.shaderProgram.use();
};

BasicRenderer.prototype.render = function(mesh, offset, numberOfVertices) {
    this.shaderProgram.use();
    mesh.associate(this.shaderProgram);
    mesh.render(offset, numberOfVertices);
};

BasicRenderer.prototype.setUniform = function(name, value) {
    this.shaderProgram.setUniform(name, value);
};

/**
 * @depends App.js
 */

var Buffer = function(numItems, itemSize, usage) {
    this.numVertices = numItems;
    this.itemSize = itemSize;
    this.usage = usage;
    // Set up the buffer with no data
    this.buffer = gl.createBuffer();
    this.bind();
    gl.bufferData(gl.ARRAY_BUFFER,
                  numItems * itemSize * 4, // 4 is size (bytes) of Float32
                  this.usage);
    this.array = new Float32Array(numItems * itemSize);
};

Buffer.prototype.getBuffer = function() {
    return(this.buffer);
};

Buffer.prototype.setValues = function(values) {
    if (values) {
        this.array.set(values);
    }
    this.bind();
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.array);
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


/*
 * A method for extending a javascript pseudo-class
 * Taken from
 * http://peter.michaux.ca/articles/class-based-inheritance-in-javascript
 *
 * @param {Object} subclass The class to extend.
 * @param {Object} superclass The class to be extended.
 */
function extend(subclass, superclass) {
    function Dummy() {}
    Dummy.prototype = superclass.prototype;
    subclass.prototype = new Dummy();
    subclass.prototype.constructor = subclass;
}

/**
 * @depends App.js
 */

var Texture = function(width, height) {
    this.texture = gl.createTexture();
    this.flipped = false;
    this.bind();
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA,
                  gl.UNSIGNED_BYTE, null);
    this.end();
};

Texture.prototype.begin = function(textureUnit) {
    if (!textureUnit) {
        textureUnit = 0;
    }
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    this.bind();
};

Texture.prototype.bind = function() {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
};

Texture.prototype.end = function() {
    gl.bindTexture(gl.TEXTURE_2D, null);
};

Texture.prototype.getTexture = function() {
    return (this.texture);
};

Texture.prototype.flipY = function() {
    if (!this.flipped) {
        this.bind();
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        this.end();
        this.flipped = true;
    }
};

Texture.prototype.loadFromFile = function(filename) {
    var image = new Image();
    image.src = filename;
    image.onload = function() {
        this.loadFromExisting(image);
    }.bind(this);
};

Texture.prototype.loadFromExisting = function(image) {
    this.image = image;
    this.flipY();
    this.bind();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
                  this.image);
    this.end();
};

// Alias for backwards compatibility
Texture.prototype['load'] = Texture.prototype['loadFromFile'];

/**
 * @depends App.js
 * @depends Texture.js
 */

var Framebuffer = function(width, height) {
    this.width = width;
    this.height = height;

    this.framebuffer = gl.createFramebuffer();

    this.begin();

    // Add depth buffer
    this.depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width,
                           height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                               gl.RENDERBUFFER, this.depthBuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    this.end();

    // Add texture for color
    this.texture = new Texture(width, height);
    this.attachTexture(this.texture);

    this.begin();
    // Check it all worked
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !=
        gl.FRAMEBUFFER_COMPLETE) {
        console.error('Could not create framebuffer - error ',
                      gl.checkFramebufferStatus(gl.FRAMEBUFFER));
    }
    this.end();
};

Framebuffer.prototype.begin = function(storedViewport) {
    if (storedViewport) {
        this.pushViewport(storedViewport);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
};

Framebuffer.prototype.end = function() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (this.storedViewport) {
        this.popViewport();
    }
};

Framebuffer.prototype.attachTexture = function(texture) {
    this.texture = texture;
    this.begin();
    this.texture.begin();
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                            gl.TEXTURE_2D, this.texture.getTexture(),
                            0);
    this.texture.end();
    this.end();
};

Framebuffer.prototype.clear = function(color) {
    this.begin();
    gl.clearColor(color[0], color[1], color[2], color[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.end();
};

Framebuffer.prototype.pushViewport = function(storedViewport) {
    this.storedViewport = storedViewport;
    gl.viewport(0, 0, this.width, this.height);
};

Framebuffer.prototype.popViewport = function() {
    gl.viewport(this.storedViewport[0], this.storedViewport[1],
                this.storedViewport[2], this.storedViewport[3]);
    this.storedViewport = null;
};

/**
 * @depends App.js
 * @depends BasicRenderer.js
 * @depends Framebuffer.js
 */

var FramebufferRenderer = function(width, height,
                                   vertexShader, fragmentShader) {
    BasicRenderer.call(this, vertexShader, fragmentShader);
    this.framebuffer = new Framebuffer(width, height);
};
extend(FramebufferRenderer, BasicRenderer);

FramebufferRenderer.prototype.render = function(mesh, offset, numberOfVertices,
                                                storedViewport) {
    this.shaderProgram.use();
    mesh.associate(this.shaderProgram);
    this.framebuffer.begin(storedViewport);
    mesh.render(offset, numberOfVertices);
    this.framebuffer.end();
};


/*
 * A method for mixing in functions to a class.
 * Taken from http://michaux.ca/articles/transitioning-from-java-classes-to-javascript-prototypes
 *
 * @param {Object} subclass The class to mix into.
 * @param {Object} superclass The class containing the functions to mix in.
 */
function implement(subclass, superclass) {
    for (var fn in superclass) {
        subclass.prototype[fn] = superclass[fn];
    }
}

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

var Transformation = function() {
    this.position = vec3.create();
    this.rotation = quat4.create();
    this.scale = vec3.create();
    vec3.set([1, 1, 1], this.scale);

    // Cache matrix
    this.rotationMatrix = mat4.create();
};

Transformation.prototype.apply = function(matrix) {
    mat4.translate(matrix, this.position);
    quat4.toMat4(this.rotation, this.rotationMatrix);
    mat4.multiply(matrix, this.rotationMatrix);
    mat4.scale(matrix, this.scale);
};

/**
 * @depends App.js
 * @depends Buffer.js
 * @depends Transformation.js
 */

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


