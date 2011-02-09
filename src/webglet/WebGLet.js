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


var App = new Class({
    Implements: Options,
    options: {
        name: 'webglet-app',
        width: 800,
        height: 600,
        frameRate: 60
    },

    initialize: function(element, options) {
        this.setOptions(options);
        this.element = element;
        this.createCanvas();
        this.frameCount = 0;
    },

    createCanvas: function() {
        this.canvas = new Element('canvas', {'id': this.options.name,
                                             'width': this.options.width,
                                             'height': this.options.height});
        try {
            gl = this.canvas.getContext('experimental-webgl');
            if (this.options.debug) {
                gl = WebGLDebugUtils.makeDebugContext(gl);
            }
            gl.viewport(0, 0, this.options.width, this.options.height);
        }
        catch (error) {
        }

        if (gl) {
            this.canvas.inject(this.element);
        }
        else {
            var alertDiv = new Element('div', {'class': 'webglet-alert'});
            var alertString = '<strong>WebGL not enabled</strong><br/>For ' +
                'instructions on how to get a WebGL enabled browser <a ' +
                'href="http://www.khronos.org/webgl/wiki/' +
                'Getting_a_WebGL_Implementation">click here</a>';
            alertDiv.set('html', alertString);
            alertDiv.inject(this.element);
            var scripts = $$('script');
            for (var i = 0; i < scripts.length; i++) {
                var src = scripts[i].getProperty('src');
                if (src) {
                    src = src.trim();
                    var index = src.search('WebGLet.js$|WebGLet.min.js$');
                    if (index != -1) {
                        src = src.slice(0, index) + 'images/error.png';
                        var image = new Element('img',
                                                {'src': src,
                                                 'style': 'float: left'});
                        image.inject(alertDiv, 'top');
                    }
                }
            }
        }
    },

    preDraw: function() {
        this.frameCount += 1;
        this.draw();
    },

    draw: function() {
    },

    run: function() {
        this.timer = this.preDraw.periodical(1000 / this.options.frameRate,
                                             this);
    },

    stop: function() {
        clearInterval(this.timer);
    },

    clear: function(color) {
        gl.clearColor(color[0], color[1], color[2], color[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
});


/**
 * @depends App.js
 */

var Attribute = new Class({
    initialize: function(attribInfo, program) {
        this.size = attribInfo.size;
        this.type = attribInfo.type;
        this.name = attribInfo.name;
        this.location = gl.getAttribLocation(program, this.name);
        this.createFunctionHashes();
        this.createSizeHash();
    },

    createFunctionHashes: function() {
        this.floatFunctions = {};
        this.floatFunctions[gl.FLOAT] = gl.vertexAttrib1fv;
        this.floatFunctions[gl.FLOAT_VEC2] = gl.vertexAttrib2fv;
        this.floatFunctions[gl.FLOAT_VEC3] = gl.vertexAttrib3fv;
        this.floatFunctions[gl.FLOAT_VEC4] = gl.vertexAttrib4fv;

        this.matrixFunctions = {};
        this.matrixFunctions[gl.FLOAT_MAT2] = gl.vertexAttrib2fv;
        this.matrixFunctions[gl.FLOAT_MAT3] = gl.vertexAttrib3fv;
        this.matrixFunctions[gl.FLOAT_MAT4] = gl.vertexAttrib4fv;
    },

    createSizeHash: function() {
        this.sizes = {};
        this.sizes[gl.FLOAT] = 1;
        this.sizes[gl.FLOAT_VEC2] = 2;
        this.sizes[gl.FLOAT_VEC3] = 3;
        this.sizes[gl.FLOAT_VEC4] = 4;
        this.sizes[gl.FLOAT_MAT2] = 4;
        this.sizes[gl.FLOAT_MAT3] = 9;
        this.sizes[gl.FLOAT_MAT4] = 16;
    },

    setValue: function(value) {
        if (typeOf(value) == 'number') {
            value = [value];
        }
        if (this.floatFunctions[this.type]) {
            this.setFloat(value);
        }
        else if (this.matrixFunctions[this.type]) {
            this.setMatrix(value);
        }
    },

    setFloat: function(value) {
        this.floatFunctions[this.type].apply(gl, [this.location, value]);
    },

    setMatrix: function(value) {
        this.matrixFunctions[this.type].apply(gl, [this.location, value]);
    },

    setPointer: function() {
        gl.enableVertexAttribArray(this.location);
        gl.vertexAttribPointer(this.location, this.sizes[this.type],
                               gl.FLOAT, false, 0, 0);
    }
});



var Shader = new Class({
    initialize: function(shaderId) {
        this.name = shaderId;
        var sourceElement = $(this.name);
        var typeString = sourceElement.get('type');
        if (typeString == 'x-shader/x-vertex') {
            this.type = gl.VERTEX_SHADER;
        }
        else if (typeString == 'x-shader/x-fragment') {
            this.type = gl.FRAGMENT_SHADER;
        }

        console.log('Creating %s shader %s', typeString, this.name);
        this.shader = gl.createShader(this.type);

        gl.shaderSource(this.shader, sourceElement.get('text'));
        gl.compileShader(this.shader);

        if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
            console.error('Could not compile shader ', this.name, '\n',
                          gl.getShaderInfoLog(this.shader));
        }
    },

    getShader: function() {
        return (this.shader);
    }
});

/**
 * @depends App.js
 */

var Uniform = new Class({
    initialize: function(uniformInfo, program) {
        this.size = uniformInfo.size;
        this.type = uniformInfo.type;
        this.name = uniformInfo.name;
        this.location = gl.getUniformLocation(program, this.name);
        this.createFunctionHashes();
    },

    createFunctionHashes: function() {
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
    },

    setValue: function(value) {
        if (typeOf(value) == 'number') {
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
    },

    setFloat: function(value) {
        this.floatFunctions[this.type].apply(gl, [this.location, value]);
    },

    setInt: function(value) {
        this.intFunctions[this.type].apply(gl, [this.location, value]);
    },

    setBool: function(value) {
        this.boolFunctions[this.type].apply(gl, [this.location, value]);
    },

    setMatrix: function(value) {
        this.matrixFunctions[this.type].apply(gl, [this.location, false,
                                                   value]);
    },

    setSampler: function(value) {
        this.samplerFunctions[this.type].apply(gl, [this.location, value]);
    }
});

/**
 * @depends App.js
 * @depends Shader.js
 * @depends Attribute.js
 * @depends Uniform.js
 */

var ShaderProgram = new Class({
    initialize: function() {
    },

    program: null,
    shaders: {},
    shaderIds: [],
    uniforms: {},
    attributes: {},
    needRecompile: true,

    addShader: function(shaderId) {
        var shader = new Shader(shaderId);
        this.shaders[shaderId] = shader;
        this.shaderIds.push(shaderId);
        this.needRecompile = true;
    },

    removeShader: function(shaderId) {
        for (var i = 0; i < this.shaderIds.length; i++) {
            if (this.shaderIds[i] == shaderId) {
                delete this.shaderIds[i];
            }
        }
        delete this.shaders[shaderId];
        this.needRecompile = true;
    },

    createProgram: function() {
        this.program = gl.createProgram();
    },

    deleteProgram: function() {
        gl.deleteProgram(this.program);
    },

    attachShaders: function() {
        for (var i = 0; i < this.shaderIds.length; i++) {
            var shader = this.shaders[this.shaderIds[i]];
            gl.attachShader(this.program, shader.getShader());
        }
    },

    getAttributes: function() {
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
    },

    getUniforms: function() {
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
    },


    linkProgram: function() {
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('Could not link shader program, %i', this.program);
            return (false);
        }
        return (true);
    },

    useProgram: function() {
        gl.useProgram(this.program);
    },

    use: function() {
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
    },

    getUniform: function(name) {
        return (this.uniforms[name]);
    },

    setUniform: function(name, value) {
        this.use();
        this.uniforms[name].setValue(value);
    },

    getAttribute: function(name) {
        return (this.attributes[name]);
    },

    setAttribute: function(name, value) {
        this.use();
        this.attributes[name].setValue(value);
    }
});

ShaderProgram.activeProgram = null;

/**
 * @depends App.js
 * @depends ShaderProgram.js
 */

var BasicRenderer = new Class({
    initialize: function(vertexShader, fragmentShader) {
        this.shaderProgram = new ShaderProgram();
        this.shaderProgram.addShader(vertexShader);
        this.shaderProgram.addShader(fragmentShader);
        this.shaderProgram.use();
    },

    render: function(mesh) {
        this.shaderProgram.use();
        mesh.associate(this.shaderProgram);
        mesh.render();
    },

    setUniform: function(name, value) {
        this.shaderProgram.setUniform(name, value);
    }
});

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
        this.array = new Float32Array(numItems * itemSize);
    },

    getBuffer: function() {
        return(this.buffer);
    },

    setValues: function(values) {
        if (values) {
            this.array.set(values);
        }
        this.bind();
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.array);
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


/**
 * @depends App.js
 */

 var Texture = new Class({
    initialize: function(width, height) {
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
    },

    begin: function(textureUnit) {
        if (!textureUnit) {
            textureUnit = 0;
        }
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        this.bind();
    },

    bind: function() {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    },

    end: function() {
        gl.bindTexture(gl.TEXTURE_2D, null);
    },

    getTexture: function() {
        return (this.texture);
    },

    flipY: function() {
        if (!this.flipped) {
            this.bind();
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            this.end();
            this.flipped = true;
        }
    },

    loadFromFile: function(filename) {
        var image = new Image();
        image.src = filename;
        image.addEvent('load', function() {
            this.loadFromExisting(image);
        }.bind(this));
    },

    loadFromExisting: function(image) {
        this.image = image;
        this.flipY();
        this.bind();
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
                      this.image);
        this.end();
    }
});

// Alias for backwards compatibility
Texture.prototype['load'] = Texture.prototype['loadFromFile'];

/**
 * @depends App.js
 * @depends Texture.js
 */

var Framebuffer = new Class({
    initialize: function(width, height) {
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
    },

    begin: function(storedViewport) {
        if (storedViewport) {
            this.pushViewport(storedViewport);
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    },

    end: function() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        if (this.storedViewport) {
            this.popViewport();
        }
    },

    attachTexture: function(texture) {
        this.texture = texture;
        this.begin();
        this.texture.begin();
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                                gl.TEXTURE_2D, this.texture.getTexture(),
                                0);
        this.texture.end();
        this.end();
    },

    clear: function(color) {
        this.begin();
        gl.clearColor(color[0], color[1], color[2], color[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.end();
    },

    pushViewport: function(storedViewport) {
        this.storedViewport = storedViewport;
        gl.viewport(0, 0, this.width, this.height);
    },

    popViewport: function() {
        gl.viewport(this.storedViewport[0], this.storedViewport[1],
                    this.storedViewport[2], this.storedViewport[3]);
        this.storedViewport = null;
    }
});

/**
 * @depends App.js
 * @depends BasicRenderer.js
 * @depends Framebuffer.js
 */

var FramebufferRenderer = new Class({
    Extends: BasicRenderer,
    initialize: function(width, height, vertexShader, fragmentShader) {
        BasicRenderer.prototype.initialize.apply(this, [vertexShader,
                                                        fragmentShader]);
        this.framebuffer = new Framebuffer(width, height);
    },

    render: function(mesh, storedViewport) {
        this.shaderProgram.use();
        mesh.associate(this.shaderProgram);
        this.framebuffer.begin(storedViewport);
        mesh.render();
        this.framebuffer.end();
    }

});

var MatrixStack = new Class({
    initialize: function() {
        this.stack = [];
        this.matrix = mat4.create();
        mat4.identity(this.matrix);
    },

    pushMatrix: function() {
        var newMatrix = mat4.create();
        mat4.set(this.matrix, newMatrix);
        this.stack.push(newMatrix);
    },

    popMatrix: function() {
        if (this.stack.length > 0) {
            this.matrix = this.stack.pop();
        }
    }
});

var Transformation = new Class({
    initialize: function() {
        this.position = vec3.create();
        this.rotation = quat4.create();
        this.scale = vec3.create();
        vec3.set([1, 1, 1], this.scale);

        // Cache matrix
        this.rotationMatrix = mat4.create();
    },

    apply: function(matrix) {
        mat4.translate(matrix, this.position);
        quat4.toMat4(this.rotation, this.rotationMatrix);
        mat4.multiply(matrix, this.rotationMatrix);
        mat4.scale(matrix, this.scale);
    }
});

/**
 * @depends App.js
 * @depends Buffer.js
 * @depends Transformation.js
 */

var Mesh = new Class({
    initialize: function(numVertices, drawMode, vertexUsage, colorUsage,
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
    },

    createBuffer: function(name, numVertices, stride, usage) {
        this.buffers[name] = new Buffer(numVertices, stride, usage);
        // Also store the buffer in this, for ease of access and backwards
        // compatibility
        this[name + 'Buffer'] = this.buffers[name];
    },

    associate: function(shaderProgram) {
        Object.each(this.buffers, function(buffer, bufferName) {
            // Convert bufferName to aAttributeName
            var attributeName = 'a' + bufferName.capitalize();
            var attribute = shaderProgram.getAttribute(attributeName);
            if (!attribute) {
                console.error('Could not associate ' + attributeName +
                              ' attribute');
            }
            buffer.associate(attribute);
        }, this);
    },

    render: function() {
        gl.drawArrays(this.drawMode, 0, this.numVertices);
    }
});


/**
 * @depends App.js
 * @depends Buffer.js
 * @depends Mesh.js
 */

var RectMesh = new Class({
    Extends: Mesh,
    initialize: function(width, height, vertexUsage, colorUsage, normalUsage,
                         texCoordUsage) {
        Mesh.prototype.initialize.apply(this, [4, gl.TRIANGLE_STRIP,
                                               vertexUsage, colorUsage,
                                               normalUsage, texCoordUsage]);

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
    }
});


