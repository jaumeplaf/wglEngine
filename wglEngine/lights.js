class Light
{
    constructor(intensity, radius, position, LAmbient, LDiffuse, LSpecular)
    {
        this.scene = ACTIVE_SCENE;
        this.proxyMaterial = new Material(this.scene, "VS_01", "FS_01", false, false, false);
        this.emissive = 10;
        this.modelScale = 20;

        this.initializeLightAttributes(LAmbient, LDiffuse, LSpecular, intensity, radius, position);

        this.addToScene();
        this.ID = this.scene.lights.length - 1;
    }

    setProxyMatAttributes()
    {
        this.proxyMaterial.setMaterialAttributes(
            [Math.max(this.La[0], this.Ld[0]) * this.emissive, Math.max(this.La[1], this.Ld[1]) * this.emissive, Math.max(this.La[2], this.Ld[2]) * this.emissive], //Ambient
            [Math.max(this.La[0], this.Ld[0]) * this.emissive, Math.max(this.La[1], this.Ld[1]) * this.emissive, Math.max(this.La[2], this.Ld[2]) * this.emissive], //Diffuse
            [0.0, 0.0, 0.0], //Specular
            300.0 //Shininess
        );
    }

    addToScene()
    {
        this.scene.addLight(this);
        if(this.scene.lights.length === 1){ //Initialize display values
            this.scene.input.activeLight = this;
            updateLightUI(this.scene.lights[parseInt(inLights.value)]);
            updateLightIntensityDisplay(this.intensity);
            updateLightRadiusDisplay(this.radius);
            updateLightPositions(this.position[0], this.position[1], this.position[2]);
        } 
    }

    initializeLightAttributes(inLa, inLd, inLs, inIntensity, inRadius, inPosition)
    {
        this.setLa(inLa, false);
        this.setLd(inLd);
        this.setLs(inLs);
        this.setIntensity(inIntensity);
        this.setRadius(inRadius);
        this.setPostion(inPosition);
    }

    setLa(inLa, proxyUpdate = false)
    {
        this.La = inLa;
        if(proxyUpdate) this.proxy.setColor(this.La);
    }

    setLd(inLd)
    {
        this.Ld = inLd;
    }

    setLs(inLs)
    {
        this.Ls = inLs;
    }

    setIntensity(inIntensity)
    {
        this.intensity = inIntensity;
        updateLightIntensityDisplay(inIntensity);
    }
    
    setRadius(inRadius)
    {
        this.radius = inRadius;
        updateLightRadiusDisplay(inRadius);
    }

    setPostion(inPosition)
    {
        this.position = [inPosition[0], inPosition[1], inPosition[2]];
    }

    updatePosition(inPosition)
    {
        // Set absolute position instead of relative translation
        this.proxy.setMatrix(inPosition[0], inPosition[1], inPosition[2], this.modelScale);
        this.setPostion(inPosition);
    }
    
    addProxy(model)
    {
       this.proxy = new MeshActor(model, this.proxyMaterial);
       this.proxy.setMatrix(this.position[0], this.position[1], this.position[2], this.modelScale);
       this.proxy.setColor(this.La);    
       this.setProxyMatAttributes();
    }

    proxyUpdateColor()
    {
        //this.proxy.setColor(this.La);
        this.setProxyMatAttributes();
    }
    
    proxyFaceDirection(object, direction)
    {
        let planeNormal = [0, 1, 0];
        let normDir = vec3.create();
        vec3.normalize(normDir, direction);

        let dotVal = vec3.dot(planeNormal, normDir);
        let angle = Math.acos(dotVal) * 180 / Math.PI;

        let axis = vec3.create();
        vec3.cross(axis, planeNormal, normDir);
        vec3.normalize(axis, axis);

        object.setRotation(angle, axis);
    }
}

class PointLight extends Light
{
    constructor(inIntensity, radius, position, LAmbient, LDiffuse, LSpecular)
    {
        super(inIntensity, radius, position, LAmbient, LDiffuse, LSpecular); 
        this.proxyMesh = new MeshObject(Lightbulb01, this.proxyMaterial);
        this.addProxy(this.proxyMesh);
    }
}

class SpotLight extends Light
{
    constructor(inIntensity, radius, position, LAmbient, LDiffuse, LSpecular, inDirection = [0, -1, 0], inAngle = 30.0)
    {
        super(inIntensity, radius, position, LAmbient, LDiffuse, LSpecular);
        this.direction = inDirection;
        this.angle = inAngle;
        this.proxyMesh = new MeshObject(Spotlight01, this.proxyMaterial);
        this.addProxy(this.proxyMesh);
        this.proxyFaceDirection(this.proxy, this.direction);
    }
}

class AreaLight extends Light
{
    constructor(inIntensity, radius, position, LAmbient, LDiffuse, LSpecular, inDirection = [0, -1, 0], inWidth = 4.0, inHeight = 2.0)
    {
        super(inIntensity, radius, position, LAmbient, LDiffuse, LSpecular);
        this.direction = inDirection;
        this.width = inWidth;
        this.height = inHeight;
        this.proxyMesh = new MeshObject(Arealight01, this.proxyMaterial);
        this.addProxy(this.proxyMesh);
        this.proxy.setScale(this.width, this.height, 1);
        this.proxyFaceDirection(this.proxy, this.direction);
    }
}
