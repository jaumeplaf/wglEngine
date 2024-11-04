class Shader 
{
    constructor(vsSource, fsSource) 
    {
        this.gl = gl;
        this.program = this.compileAndLinkShaders(document.getElementById(vsSource).text, document.getElementById(fsSource).text);
        this.initializeUniforms();
    }

    compileAndLinkShaders(vertexSource, fragmentSource) 
    {
        const vertexShader = this.newShader(this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.newShader(this.gl.FRAGMENT_SHADER, fragmentSource);
        const newProgram = this.gl.createProgram();

        this.gl.attachShader(newProgram, vertexShader);
        this.gl.attachShader(newProgram, fragmentShader);
        this.gl.linkProgram(newProgram);

        if (!this.gl.getProgramParameter(newProgram, this.gl.LINK_STATUS)) {
            console.error("Error linking program:", this.gl.getProgramInfoLog(newProgram));
            return null;
        }

        return newProgram;
    }

    newShader(type, source) 
    {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error("Error compiling shader:", this.gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    use() 
    {
        if (this.program) {
            this.gl.useProgram(this.program);
        }
    }

    initializeUniforms()
    {
        
        this.program.vertexPositionAttribute = this.gl.getAttribLocation(this.program, "VertexPosition");
        this.gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
        
        //Uniforms
        this.program.modelMatrixIndex = this.gl.getUniformLocation(this.program, "modelMatrix");
        this.program.projectionMatrixIndex = this.gl.getUniformLocation(this.program, "projectionMatrix");
        
        this.program.progShadingMode = gl.getUniformLocation (this.program, "shadingMode");
        this.program.progWireframeOpacity = this.gl.getUniformLocation(this.program, "wireframeOpacity");
        
        this.program.progBaseColor = gl.getUniformLocation (this.program, "baseColor");
        this.program.progLineColor = gl.getUniformLocation (this.program, "lineColor");

        //Fog parameters
        this.program.progFogColor = this.gl.getUniformLocation(this.program, "fogColor");
        this.program.progFogAmount = this.gl.getUniformLocation(this.program, "fogAmount");
        this.program.progFogPower = this.gl.getUniformLocation(this.program, "fogPower");
        this.program.progWireframeIgnoreFog = this.gl.getUniformLocation(this.program, "wireframeIgnoreFog");
        this.program.progNearPlane = gl.getUniformLocation (this.program, "nPlane");
        this.program.progFarPlane = gl.getUniformLocation (this.program, "fPlane");
    }

    setProjection(projectionMatrix)
    {
        this.gl.uniformMatrix4fv(this.program.projectionMatrixIndex, false, projectionMatrix);
    }

    setModelMatrix(matrix)
    {
        this.gl.uniformMatrix4fv(this.program.modelMatrixIndex, false, matrix);
    }
}
