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
