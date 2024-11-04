class Camera {
    constructor(inNearPlane, inFarPlane, inFov) 
    {
        this.nearPlane = inNearPlane;
        this.farPlane = inFarPlane;
        this.fov = inFov;
        this.projectionMatrix = mat4.create();
        
        this.initProjectionMatrix();
    }

    initProjectionMatrix() 
    {
        mat4.perspective(this.projectionMatrix, Math.PI / this.fov, 1.0, this.nearPlane, this.farPlane);
    }

    getProjection() 
    {
        return this.projectionMatrix;
    }
}

//projections->viewing->model->viewport
//