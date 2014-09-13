VERSION = 0.3

SRC_DIR = src
OUTPUT_DIR = dist
LIB_DIR = lib

JS = WebGLet-$(VERSION).js
MIN = WebGLet-$(VERSION).min.js

LIB = $(LIB_DIR)/gl-matrix/gl-matrix.js

FILES = Extend.js Implement.js \
		MatrixStack.js Transformation.js\
		Attribute.js Uniform.js \
		ShaderProgram.js Shader.js \
		Buffer.js Mesh.js RectMesh.js \
		Texture.js Framebuffer.js \
		BasicRenderer.js FramebufferRenderer.js \
		mixins/MouseEvents.js mixins/KeyEvents.js \
		App.js
FILES := $(addprefix $(SRC_DIR)/, $(FILES))

all: $(JS) $(MIN)

lint:
	gjslint $(FILES)

$(JS): | $(OUTPUT_DIR)
	cat $(LIB) $(FILES) > $(OUTPUT_DIR)/$@

$(MIN): | $(OUTPUT_DIR)
	uglifyjs $(LIB) $(FILES) -m -c -o $(OUTPUT_DIR)/$@

$(OUTPUT_DIR):
	mkdir -p $@

clean:
	rm -rf $(OUTPUT_DIR)
