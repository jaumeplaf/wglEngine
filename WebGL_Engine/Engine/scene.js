class Scene
{
    constructor(inCamera)
    {
        this.collections = [];
        this.camera = inCamera;
        this.input = new InputParameters(this.camera);
        initializeEventListeners(this, this.input);
    }
    addCollection(inCollection)
    {
        this.collections.push(inCollection);
    }
    
     drawScene()
    {
        //We need to use "requestAnimationFrame(() => scene.drawScene())" instead of "requestAnimationFrame(scene.drawScene)"
        //to have access to "this", and it's properties
        gl.clearColor(this.input.fogColor[0], this.input.fogColor[1], this.input.fogColor[2], this.input.fogColor[3]);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        for(let collection of this.collections){
            collection.shader.use();
            updateUniforms(this.input, collection.shader.program);
            collection.shader.setProjection(this.camera.getProjection());
            collection.draw();
        }
    }
}