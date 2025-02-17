class Material 
{
    constructor(inScene, vsSource, fsSource, inTextureBaseColor = false, inTextureNormal = false, flipVcoord = true, inNoise = false) 
    {
        this.scene = inScene;
        this.flipV = flipVcoord;
        this.useTextureBaseColor = inTextureBaseColor;
        this.useTextureNormal = inTextureNormal;
        this.useFog = true;
        this.useAdjugateNormal = false;
        this.useNoise = inNoise;
        this.vertexColorTint = true;
        this.shaderFeatures = '';

        this.program = this.compileAndLinkShaders(this.preprocessShaderSource(vsSource), this.preprocessShaderSource(fsSource));
        
        this.setMaterialAttributes();
        this.initializeUniforms();
        this.textures = {};

    }
    
    preprocessShaderSource(inSource) 
    {
        const source = document.getElementById(inSource).text;
        const versionDirective = '#version 300 es';
        if (this.flipV) {
            this.shaderFeatures += '#define USE_FLIP_V\n';
        }
        if (this.useTextureBaseColor) {
            this.shaderFeatures += '#define USE_TEXTURE_BASECOLOR\n';
        }
        if (this.useTextureNormal) {
            this.shaderFeatures += '#define USE_TEXTURE_NORMAL\n';
        }
        if (this.useFog) {
            this.shaderFeatures += '#define USE_FOG\n';
        }
        if (this.useAdjugateNormal) {
            this.shaderFeatures += '#define USE_ADJUGATE_NORMALS\n';
        }
        if(this.vertexColorTint){
            this.shaderFeatures += '#define USE_VERTEX_COLOR_TINT\n';
        }
        if(this.useNoise){
            this.shaderFeatures += '#define USE_NOISE\n';
        }
        this.shaderFeatures += `#define MAX_LIGHTS ${this.scene.maxLights}\n`;

        return `${versionDirective}\n${this.shaderFeatures}\n${source}`;
    }

    compileAndLinkShaders(vertexSource, fragmentSource) 
    {
        const vertexShader = this.newShader(window.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.newShader(window.gl.FRAGMENT_SHADER, fragmentSource);
        const newProgram = window.gl.createProgram();
        
        window.gl.attachShader(newProgram, vertexShader);
        window.gl.attachShader(newProgram, fragmentShader);
        window.gl.linkProgram(newProgram);
        
        if (!window.gl.getProgramParameter(newProgram, window.gl.LINK_STATUS)) {
            console.error("Error linking program:", window.gl.getProgramInfoLog(newProgram));
            return null;
        }
        
        return newProgram;
    }

    newShader(type, source) 
    {
        const material = window.gl.createShader(type);
        window.gl.shaderSource(material, source);
        window.gl.compileShader(material);
        
        if (!window.gl.getShaderParameter(material, window.gl.COMPILE_STATUS)) {
            console.error("Error compiling material:", window.gl.getShaderInfoLog(material));
            return null;
        }
        return material;
    }
    
    use(inInput) 
    {
        if (this.program) {
            window.gl.useProgram(this.program);
            inInput.setUniforms(this.program);
        }
        else console.error("Can't use material, program is null");
    }

    setMaterialAttributes(inMa = [ 1.0, 1.0, 1.0 ], inMd = [ 1.0, 1.0, 1.0 ], inMs = [ 1.0, 1.0, 1.0 ], inShininess = 10.0)
    {
        this.Ma = inMa;
        this.Md = inMd;
        this.Ms = inMs;
        this.shininess = inShininess;
    }
    
    initializeUniforms()
    {
        this.program.vertexPositionAttribute = window.gl.getAttribLocation(this.program, "VertexPosition");
        window.gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
        this.program.vertexNormalAttribute = window.gl.getAttribLocation(this.program, "VertexNormal");
        window.gl.enableVertexAttribArray(this.program.vertexNormalAttribute);
        this.program.vertexColorAttribute = window.gl.getAttribLocation(this.program, "VertexColor");
        window.gl.enableVertexAttribArray(this.program.vertexColorAttribute);
        this.program.texCoords1Attribute = window.gl.getAttribLocation(this.program, "TexCoords1");
        window.gl.enableVertexAttribArray(this.program.texCoords1Attribute);

        //Uniforms
        this.program.modelMatrixIndex = window.gl.getUniformLocation(this.program, "modelMatrix");
        this.program.projectionMatrixIndex = window.gl.getUniformLocation(this.program, "projectionMatrix");
        this.program.viewMatrixIndex = window.gl.getUniformLocation(this.program, "viewMatrix");
        
        //Fog parameters
        this.program.progFogColor = window.gl.getUniformLocation(this.program, "fogColor");
        this.program.progFogAmount = window.gl.getUniformLocation(this.program, "fogAmount");
        this.program.progFogPower = window.gl.getUniformLocation(this.program, "fogPower");
        this.program.progNearPlane = window.gl.getUniformLocation(this.program, "nPlane");
        this.program.progFarPlane = window.gl.getUniformLocation(this.program, "fPlane");

        this.program.progTime = window.gl.getUniformLocation(this.program, "time");

        //Point/line rendering
        this.program.isPoint = window.gl.getUniformLocation(this.program, "isPoint");
        this.program.celShading = window.gl.getUniformLocation(this.program, "celShading");
        this.program.celSteps = window.gl.getUniformLocation(this.program, "celSteps");
        this.program.celContrast = window.gl.getUniformLocation(this.program, "celContrast");

        // Texture uniforms
        this.program.baseColorSampler = window.gl.getUniformLocation(this.program, "t_baseColor");
        this.program.normalSampler = window.gl.getUniformLocation(this.program, "t_normal");


        // Light and Material structs
        this.program.numLights = window.gl.getUniformLocation(this.program, "numLights");
        this.program.Lights = [];
        for (let i = 0; i < this.scene.maxLights; i++) {
            this.program.Lights.push({
                La: window.gl.getUniformLocation(this.program, `Lights[${i}].La`),
                Ld: window.gl.getUniformLocation(this.program, `Lights[${i}].Ld`),
                Ls: window.gl.getUniformLocation(this.program, `Lights[${i}].Ls`),
                Lpos: window.gl.getUniformLocation(this.program, `Lights[${i}].Lpos`),
                Lintensity: window.gl.getUniformLocation(this.program, `Lights[${i}].Lintensity`),
                Lradius: window.gl.getUniformLocation(this.program, `Lights[${i}].Lradius`)
            });
        }
        this.program.Material = {
            Ma: window.gl.getUniformLocation(this.program, "Material.Ma"),
            Md: window.gl.getUniformLocation(this.program, "Material.Md"),
            Ms: window.gl.getUniformLocation(this.program, "Material.Ms"),
            shininess: window.gl.getUniformLocation(this.program, "Material.shininess")
        };
    }

    setProjection(projectionMatrix)
    {
        window.gl.uniformMatrix4fv(this.program.projectionMatrixIndex, false, projectionMatrix);
    }

    setView(viewMatrix)
    {
        window.gl.uniformMatrix4fv(this.program.viewMatrixIndex, false, viewMatrix);
    }

    setModelMatrix(matrix)
    {
        window.gl.uniformMatrix4fv(this.program.modelMatrixIndex, false, matrix);
    }

    setCelShading()
    {
        window.gl.uniform1f(this.program.celShading, this.scene.celShading);
        window.gl.uniform1f(this.program.celSteps, this.scene.celSteps);
        window.gl.uniform1f(this.program.celContrast, this.scene.celContrast);
    }

    setTime()
    {
        window.gl.uniform1f(this.program.progTime, this.scene.input.time);
    }

    setTexture(texture, textureUnit, uniformLocation)
    {
        window.gl.activeTexture(window.gl.TEXTURE0 + textureUnit);
        window.gl.bindTexture(window.gl.TEXTURE_2D, texture.texture);
        window.gl.uniform1i(uniformLocation, textureUnit);
    }

    bindTexture(image) 
    {
        window.gl.bindTexture(window.gl.TEXTURE_2D, this.texture);
        window.gl.texImage2D(window.gl.TEXTURE_2D, 0, window.gl.RGBA, window.gl.RGBA, window.gl.UNSIGNED_BYTE, image);

        window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_MIN_FILTER, window.gl.LINEAR_MIPMAP_LINEAR);
        window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_MAG_FILTER, window.gl.LINEAR);

        window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_WRAP_S, window.gl.REPEAT);
        window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_WRAP_T, window.gl.REPEAT);

        window.gl.generateMipmap(window.gl.TEXTURE_2D);
    }

    assignTexture(texture, type)
    {
        this.textures[type] = texture;
    }

    setLightUniforms() 
    {
        const lNum = this.scene.lights.length;
        window.gl.uniform1i(this.program.numLights, lNum);
        for (let i = 0; i < lNum; i++) {
            const currLight = this.scene.lights[i];
            window.gl.uniform4f(this.program.Lights[i].La, currLight.La[0], currLight.La[1], currLight.La[2], 1.0);
            window.gl.uniform4f(this.program.Lights[i].Ld, currLight.Ld[0], currLight.Ld[1], currLight.Ld[2], 1.0);
            window.gl.uniform4f(this.program.Lights[i].Ls, currLight.Ls[0], currLight.Ls[1], currLight.Ls[2], 1.0);
            window.gl.uniform4f(this.program.Lights[i].Lpos, currLight.position[0], currLight.position[1], currLight.position[2], 1.0);
            window.gl.uniform1f(this.program.Lights[i].Lintensity, currLight.intensity);
            window.gl.uniform1f(this.program.Lights[i].Lradius, currLight.radius);
        }
    
        window.gl.uniform4f(this.program.Material.Ma, this.Ma[0], this.Ma[1], this.Ma[2], 1.0);
        window.gl.uniform4f(this.program.Material.Md, this.Md[0], this.Md[1], this.Md[2], 1.0);
        window.gl.uniform4f(this.program.Material.Ms, this.Ms[0], this.Ms[1], this.Ms[2], 1.0);
        window.gl.uniform1f(this.program.Material.shininess, this.shininess);
    }
}
