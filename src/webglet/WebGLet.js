var gl;

var App = new Class({
    Implements: Options,
    options: {
        name: 'webglet-app',
        width: 800,
        height: 600,
        frameRate: 60,
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
            alertDiv.set('text', 'WebGL not enabled');
            alertDiv.inject(this.element);
        }
    },

    preDraw: function() {
        this.frameCount += 1;
        this.draw();
    },

    draw: function() {
    },

    run: function() {
        this.preDraw.periodical(1000 / this.options.frameRate, this);
    },

    clear: function(color) {
        gl.clearColor(color[0], color[1], color[2], color[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);
    },
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
        this.floatFunctions[gl.FLOAT] = gl.attrib1fv;
        this.floatFunctions[gl.FLOAT_VEC2] = gl.attrib2fv;
        this.floatFunctions[gl.FLOAT_VEC3] = gl.attrib3fv;
        this.floatFunctions[gl.FLOAT_VEC4] = gl.attrib4fv;

        this.matrixFunctions = {};
        this.matrixFunctions[gl.FLOAT_MAT2] = gl.attrib2fv;
        this.matrixFunctions[gl.FLOAT_MAT3] = gl.attrib3fv;
        this.matrixFunctions[gl.FLOAT_MAT4] = gl.attrib4fv;
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
    },

    getUniform: function(name) {
        return (this.uniforms[name]);
    },

    setUniform: function(name, value) {
        this.uniforms[name].setValue(value);
    },

    getAttribute: function(name) {
        return (this.attributes[name]);
    },

    setAttribute: function(name, value) {
        this.attributes[name].setValue(value);
    }
});

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

    render: function(meshes, matrices) {
        this.shaderProgram.use();
        for (var i = 0; i < meshes.length; i++) {
            // Render
            this.renderMesh(meshes[i], matrices);
        }
    },

    renderMesh: function(mesh, matrices) {
        matrices.modelview.pushMatrix();
        mesh.transformation.apply(matrices.modelview.matrix);
        this.shaderProgram.setUniform('uProjectionMatrix',
                                      matrices.projection.matrix);
        this.shaderProgram.setUniform('uModelviewMatrix',
                                      matrices.modelview.matrix);
        matrices.modelview.popMatrix();

        mesh.associate(this.shaderProgram);
        mesh.render();
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

    setValues: function(values) {
        this.array.set(values);
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

    load: function(filename) {
        this.image = new Image();
        this.image.src = filename;
        this.image.addEvent('load', function() {
            this.bind();
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
                          this.image);
            this.end();
        }.bind(this));
        this.image.src = filename;
    }
});

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

        // Add texture for color
        this.texture = new Texture(width, height);
        this.texture.begin();
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                                gl.TEXTURE_2D, this.texture.getTexture(),
                                0);
        this.texture.end();

        // Check it all worked
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !=
            gl.FRAMEBUFFER_COMPLETE) {
            console.error('Could not create framebuffer - error ',
                          gl.checkFramebufferStatus(gl.FRAMEBUFFER));
        }

        this.end();
    },

    begin: function() {
        this.pushViewport();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    },

    end: function() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.popViewport();
    },

    clear: function(color) {
        this.begin();
        gl.clearColor(color[0], color[1], color[2], color[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.end();
    },

    pushViewport: function() {
        this.storedViewport = gl.getParameter(gl.VIEWPORT);
        if (!this.storedViewport) {
            this.storedViewport = gl.getParameter(gl.VIEWPORT_RECT);
        }
        gl.viewport(0, 0, this.width, this.height);
    },

    popViewport: function() {
        gl.viewport(this.storedViewport[0], this.storedViewport[1],
                    this.storedViewport[2], this.storedViewport[3]);
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

    renderMesh: function(mesh, matrices) {
        matrices.modelview.pushMatrix();
        mesh.transformation.apply(matrices.modelview.matrix);
        this.shaderProgram.setUniform('uProjectionMatrix',
                                      matrices.projection.matrix);
        this.shaderProgram.setUniform('uModelviewMatrix',
                                      matrices.modelview.matrix);
        matrices.modelview.popMatrix();

        mesh.associate(this.shaderProgram);
        this.framebuffer.begin();
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
        this.vertexUsage = vertexUsage;
        this.colorUsage = colorUsage;
        this.normalUsage = normalUsage;
        this.texCoordUsage = texCoordUsage;

        this.vertexBuffer = new Buffer(numVertices, 3, this.vertexUsage);
        if (this.colorUsage) {
            this.colorBuffer = new Buffer(numVertices, 4, this.colorUsage);
        }
        if (this.normalUsage) {
            this.normalBuffer = new Buffer(numVertices, 3, this.normalUsage);
        }
        if (this.texCoordUsage) {
            this.texCoordBuffer = new Buffer(numVertices, 2,
                                             this.texCoordUsage);
        }
        
        this.transformation = new Transformation();
    },

    associate: function(shaderProgram) {
        var vertexAttribute = shaderProgram.getAttribute('aVertex');
        if (!vertexAttribute) {
            console.error("Could not associate vertex attribute");
        }
        this.vertexBuffer.associate(vertexAttribute);

        if (this.colorUsage) {
            var colorAttribute = shaderProgram.getAttribute('aColor');
            if (!colorAttribute) {
                console.error("Could not associate color attribute");
            }
            this.colorBuffer.associate(colorAttribute);
        }
        if (this.normalUsage) {
            var normalAttribute = shaderProgram.getAttribute('aNormal');
            if (!normalAttribute) {
                console.error("Could not associate normal attribute");
            }
            this.normalBuffer.associate(normalAttribute);
        }
        if (this.texCoordUsage) {
            var texCoordAttribute = shaderProgram.getAttribute('aTexCoord');
            if (!texCoordAttribute) {
                console.error("Could not associate texCoord attribute");
            }
            this.texCoordBuffer.associate(texCoordAttribute);
        }
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

        this.vertexBuffer.setValues([0,     0,      0,
                                     0,     height, 0,
                                     width,     0, 0,
                                     width, height, 0]);
        if (this.texCoordUsage) {
            this.texCoordBuffer.setValues([0, 1,
                                           0, 0,
                                           1, 1,
                                           1, 0]);
        }
    }
});


/**
 * @depends MatrixStack.js
 */
var TransformationMatrices = new Class({
    initialize: function() {
        this.projection = new MatrixStack();
        this.modelview = new MatrixStack();
    }
});

