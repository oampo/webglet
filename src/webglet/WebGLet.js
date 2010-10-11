var gl;

var App = new Class({
    Implements: Options,
    options: {
        name: 'webglet-app',
        width: 800,
        height: 600,
        frameRate: 60,
        backgroundColor: [1, 1, 1, 1]
    },

    initialize: function(element, options) {
        this.setOptions(options);
        this.element = element;
        this.createCanvas();
    },

    createCanvas: function() {
        this.canvas = new Element('canvas', {'id': this.options.name,
                                             'width': this.options.width,
                                             'height': this.options.height});
        try {
            gl = this.canvas.getContext('experimental-webgl');
            gl.viewport(0, 0, this.options.width, this.options.height);
            gl.clearColor(this.options.backgroundColor[0],
                          this.options.backgroundColor[1],
                          this.options.backgroundColor[2],
                          this.options.backgroundColor[3]);
        }
        catch (error) {
        }

        if (gl) {
            this.canvas.inject(this.element);
            this.canvas.addEvent("click", this.preMouseClicked.bind(this));
            this.canvas.addEvent("mousedown", this.preMousePressed.bind(this));
            this.canvas.addEvent("mouseup", this.preMouseReleased.bind(this));
            this.canvas.addEvent("mousemove", this.preMouseMoved.bind(this));
        }
        else {
            var alertDiv = new Element('div', {'class': 'webglet-alert'});
            alertDiv.set('text', 'WebGL not enabled');
            alertDiv.inject(this.element);
        }
    },

    draw: function() {
    },

    run: function() {
        this.draw.periodical(1000 / this.options.frameRate, this);
    },

    clear: function() {
        gl.clear(gl.COLOR_BUFFER_BIT);
    },

    preMouseClicked: function(event) {
        var position = this.canvas.getPosition();
        this.mouseClicked(event.page.x - position.x,
                          event.page.y - position.y);
    },

    mouseClicked: function(mouseX, mouseY) {
    },

    preMousePressed: function(event) {
        var position = this.canvas.getPosition();
        this.mousePressed(event.page.x - position.x,
                          event.page.y - position.y);
    },

    mousePressed: function(mouseX, mouseY) {
    },

    preMouseReleased: function(event) {
        var position = this.canvas.getPosition();
        this.mouseReleased(event.page.x - position.x,
                           event.page.y - position.y);
    },

    mouseReleased: function(mouseX, mouseY) {
    },

    preMouseMoved: function(event) {
        var position = this.canvas.getPosition();
        this.mouseMoved(event.page.x - position.x,
                        event.page.y - position.y);
    },

    mouseMoved: function(mouseX, mouseY) {
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
        this.floatFunctions = new Hash();
        this.floatFunctions.set(gl.FLOAT, gl.attrib1fv);
        this.floatFunctions.set(gl.FLOAT_VEC2, gl.attrib2fv);
        this.floatFunctions.set(gl.FLOAT_VEC3, gl.attrib3fv);
        this.floatFunctions.set(gl.FLOAT_VEC4, gl.attrib4fv);

        this.matrixFunctions = new Hash();
        this.matrixFunctions.set(gl.FLOAT_MAT2, gl.attrib2fv);
        this.matrixFunctions.set(gl.FLOAT_MAT3, gl.attrib3fv);
        this.matrixFunctions.set(gl.FLOAT_MAT4, gl.attrib4fv);
    },

    createSizeHash: function() {
        this.sizes = new Hash();
        this.sizes.set(gl.FLOAT, 1);
        this.sizes.set(gl.FLOAT_VEC2, 2);
        this.sizes.set(gl.FLOAT_VEC3, 3);
        this.sizes.set(gl.FLOAT_VEC4, 4);
        this.sizes.set(gl.FLOAT_MAT2, 4);
        this.sizes.set(gl.FLOAT_MAT3, 9);
        this.sizes.set(gl.FLOAT_MAT4, 16);
    },

    setValue: function(value) {
        if (this.floatFunctions.has(this.type)) {
            this.setFloat(value);
        }
        else if (this.matrixFunctions.has(this.type)) {
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

var Renderer = new Class({
    Implements: Options,
    options: {},

    initialize: function(options) {
        this.setOptions(options);
    },

    render: function() {
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
        this.floatFunctions = new Hash();
        this.floatFunctions.set(gl.FLOAT, gl.uniform1fv);
        this.floatFunctions.set(gl.FLOAT_VEC2, gl.uniform2fv);
        this.floatFunctions.set(gl.FLOAT_VEC3, gl.uniform3fv);
        this.floatFunctions.set(gl.FLOAT_VEC4, gl.uniform4fv);

        this.intFunctions = new Hash();
        this.intFunctions.set(gl.INT, gl.uniform1iv);
        this.intFunctions.set(gl.INT_VEC2, gl.uniform2iv);
        this.intFunctions.set(gl.INT_VEC3, gl.uniform3iv);
        this.intFunctions.set(gl.INT_VEC4, gl.uniform4iv);

        this.boolFunctions = new Hash();
        this.boolFunctions.set(gl.BOOL, gl.uniform1iv);
        this.boolFunctions.set(gl.BOOL_VEC2, gl.uniform2iv);
        this.boolFunctions.set(gl.BOOL_VEC3, gl.uniform3iv);
        this.boolFunctions.set(gl.BOOL_VEC4, gl.unform4iv);

        this.matrixFunctions = new Hash();
        this.matrixFunctions.set(gl.FLOAT_MAT2, gl.uniformMatrix2fv);
        this.matrixFunctions.set(gl.FLOAT_MAT3, gl.uniformMatrix3fv);
        this.matrixFunctions.set(gl.FLOAT_MAT4, gl.uniformMatrix4fv);

        this.samplerFunctions = new Hash();
        this.samplerFunctions.set(gl.SAMPLER_2D, gl.uniform1iv);
        this.samplerFunctions.set(gl.SAMPLER_CUBE, gl.uniform1iv);
    },

    setValue: function(value) {
        if (this.floatFunctions.has(this.type)) {
            this.setFloat(value);
        }
        else if (this.intFunctions.has(this.type)) {
            this.setInt(value);
        }
        else if (this.boolFunctions.has(this.type)) {
            this.setBool(value);
        }
        else if (this.matrixFunctions.has(this.type)) {
            this.setMatrix(value);
        }
        else if (this.samplerFunctions.has(this.type)) {
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

    getAttribute: function(name) {
        return (this.attributes[name]);
    }
});

/**
 * @depends App.js
 * @depends Renderer.js
 * @depends ShaderProgram.js
 */

var BasicRenderer = new Class({
    Extends: Renderer,
    initialize: function(vertexShader, fragmentShader, options) {
        this.parent(options);
        this.shaderProgram = new ShaderProgram();
        this.shaderProgram.addShader(vertexShader);
        this.shaderProgram.addShader(fragmentShader);
        this.shaderProgram.use();
    },

    render: function(meshes, camera) {
        this.shaderProgram.use();
        for (var i = 0; i < meshes.length; i++) {
            // Render
            this.renderMesh(meshes[i], camera);
        }
    },

    renderMesh: function(mesh, camera) {
        camera.modelview.pushMatrix();
        mesh.applyTransformations(camera.modelview.matrix);
        camera.setUniforms(this.shaderProgram);
        camera.modelview.popMatrix();

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

/**
 * @depends MatrixStack.js
 */
var Camera = new Class({
    initialize: function() {
        this.projection = new MatrixStack();
        this.modelview = new MatrixStack();
    },

    perspective: function(fovy, aspect, near, far) {
        mat4.perspective(fovy, aspect, near, far, this.projection.matrix);
    },

    ortho: function(left, right, top, bottom, near, far) {
        mat4.ortho(left, right, top, bottom, near, far, this.projection.matrix);
    },

    lookAt: function(eye, center, up) {
        mat4.lookAt(eye, center, up, this.modelview.matrix);
    },

    setUniforms: function(shaderProgram) {
        var projectionUniform = shaderProgram.getUniform('uProjectionMatrix');
        projectionUniform.setValue(this.projection.matrix);
        var modelviewUniform = shaderProgram.getUniform('uModelviewMatrix');
        modelviewUniform.setValue(this.modelview.matrix); 
    }
});

/**
 * @depends App.js
 */

 var Texture = new Class({
    initialize: function(width, height) {
        this.texture = gl.createTexture();
        this.bind();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA,
                      gl.UNSIGNED_BYTE, null);
        this.end();
    },

    begin: function(textureUnit) {
        if (!$chk(textureUnit)) {
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

    clear: function() {
        this.begin();
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
    initialize: function(width, height, vertexShader, fragmentShader,
                         options) {
        this.parent(vertexShader, fragmentShader, options);
        this.framebuffer = new Framebuffer(width, height);
    },

    renderMesh: function(mesh, camera) {
        camera.modelview.pushMatrix();
        mesh.applyTransformations(camera);
        camera.setUniforms(this.shaderProgram);
        camera.modelview.popMatrix();

        mesh.associate(this.shaderProgram);
        this.framebuffer.begin();
        mesh.render();
        this.framebuffer.end();
    }
});

var PointRendererMixin = new Class({
    getPointSizeUniforms: function(shaderProgram) {
        this.pointSizeUniform = shaderProgram.getUniform('uPointSize');
        this.constantAttenuationUniform = shaderProgram.getUniform('uConstantAttenuation');
        this.linearAttenuationUniform = shaderProgram.getUniform('uLinearAttenuation');
        this.quadraticAttenuationUniform = shaderProgram.getUniform('uQuadraticAttenuation');
        this.minPointSizeUniform = shaderProgram.getUniform('uMinPointSize');
        this.maxPointSizeUniform = shaderProgram.getUniform('uMaxPointSize');
    },

    setPointSizeUniforms: function(params) {
        this.pointSizeUniform.setValue([params.pointSize]);
        this.constantAttenuationUniform.setValue([params.constantAttenuation]);
        this.linearAttenuationUniform.setValue([params.linearAttenuation]);
        this.quadraticAttenuationUniform.setValue([params.quadraticAttenuation]);
        this.minPointSizeUniform.setValue([params.minPointSize]);
        this.maxPointSizeUniform.setValue([params.maxPointSize]);
    }
});

/**
 * @depends App.js
 * @depends FramebufferRenderer.js
 * @depends PointRendererMixin.js
 */

var FramebufferPointRenderer = new Class({
    Extends: FramebufferRenderer,
    Implements: PointRendererMixin,
    initialize: function(width, height, pointParams, vertexShader,
                         fragmentShader, options) {
        this.parent(width, height, vertexShader, fragmentShader, options);
        this.pointParams = pointParams;
        this.getPointSizeUniforms(this.shaderProgram);
    },

    renderMesh: function(mesh, camera) {
        camera.modelview.pushMatrix();
        mesh.applyTransformations(camera.modelview.matrix);
        camera.setUniforms(this.shaderProgram);
        camera.modelview.popMatrix();

        this.setPointSizeUniforms(this.pointParams);
        mesh.associate(this.shaderProgram);
        this.framebuffer.begin();
        mesh.render();
        this.framebuffer.end();
    }
});

/**
 * @depends App.js
 * @depends Buffer.js
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
        if ($chk(this.colorUsage)) {
            this.colorBuffer = new Buffer(numVertices, 4, this.colorUsage);
        }
        if ($chk(this.normalUsage)) {
            this.normalBuffer = new Buffer(numVertices, 3, this.normalUsage);
        }
        if ($chk(this.texCoordUsage)) {
            this.texCoordBuffer = new Buffer(numVertices, 2,
                                             this.texCoordUsage);
        }

        this.position = [0, 0, 0];
        this.rotation = quat4.create();
        this.scale = [1, 1, 1];
    },

    applyTransformations: function(matrix) {
       mat4.translate(matrix, this.position);
       var rotationMatrix = mat4.create();
       quat4.toMat4(this.rotation, rotationMatrix);
       mat4.multiply(matrix, rotationMatrix);
       mat4.scale(matrix, this.scale); 
    },

    associate: function(shaderProgram) {
        var vertexAttribute = shaderProgram.getAttribute('aVertex');
        this.vertexBuffer.associate(vertexAttribute);
        if ($chk(this.colorUsage)) {
            var colorAttribute = shaderProgram.getAttribute('aColor');
            this.colorBuffer.associate(colorAttribute);
        }
        if ($chk(this.normalUsage)) {
            var normalAttribute = shaderProgram.getAttribute('aNormal');
            this.normalBuffer.associate(normalAttribute);
        }
        if ($chk(this.texCoordUsage)) {
            var texCoordAttribute = shaderProgram.getAttribute('aTexCoord');
            this.texCoordBuffer.associate(texCoordAttribute);
        }
    },
        
    render: function() {
        gl.drawArrays(this.drawMode, 0, this.numVertices);
    }
});


/**
 * @depends App.js
 * @depends BasicRenderer.js
 * @depends PointRendererMixin.js
 * @depends ShaderProgram.js
 */

var PointRenderer = new Class({
    Extends: BasicRenderer,
    Implements: PointRendererMixin,
    initialize: function(pointParams, vertexShader, fragmentShader, options) {
        this.parent(vertexShader, fragmentShader, options);
        this.pointParams = pointParams;
        this.getPointSizeUniforms(this.shaderProgram);
    },

    renderMesh: function(mesh, camera) {
        camera.modelview.pushMatrix();
        mesh.applyTransformations(camera.modelview.matrix);
        camera.setUniforms(this.shaderProgram);
        camera.modelview.popMatrix();

        this.setPointSizeUniforms(this.pointParams);
        mesh.associate(this.shaderProgram);
        mesh.render();
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


