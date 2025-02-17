class Camera 
{
    constructor(inNearPlane, inFarPlane, initPos = [0,0,0], initTarg = [0,0,-1]) 
    {
        this.position = initPos;
        this.target = initTarg;
        this.up = [0,1,0];

        this.yaw = Math.PI;
        this.pitch = 0;

        this.floor = -9;
        this.ceiling = 289;
        this.maxRadius = 95;
        this.constraints = false;

        this.nearPlane = inNearPlane;
        this.farPlane = inFarPlane;
        this.fov = degToRad(inFov.value);

        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        
        this.initializeCamera();
    }

    saveCameraPosition(program)
    {
        window.gl.uniform3f(gl.getUniformLocation(program, "cameraPosition"), this.position[0], this.position[1], this.position[2]);
    }

    initializeCamera()
    {
        this.setProjectionMatrix();
        this.setViewMatrix();

        updateFovDisplay(inFov.value);
    }

    setProjectionMatrix() 
    {
        mat4.perspective(this.projectionMatrix, this.fov, getCanvasRatio(window.canvas), this.nearPlane, this.farPlane);
    }

    getProjectionMatrix() 
    {
        return this.projectionMatrix;
    }

    setViewMatrix()
    {
        this.viewMatrix = mat4.lookAt(this.viewMatrix, this.position, this.target, this.up);
    }

    getViewMatrix()
    {
        return this.viewMatrix;
    }

    getSprint(inPlayer)
    {
        if(inPlayer.sprint) {
            inPlayer.currSpeed = inPlayer.sprintMult * inPlayer.walkSpeed;
            inPlayer.currFloat = inPlayer.sprintMult * inPlayer.floatSpeed;
        }
        else{
            inPlayer.currSpeed = inPlayer.walkSpeed;
            inPlayer.currFloat = inPlayer.floatSpeed;
        }
    }
    
    rotateView(deltaYaw, deltaPitch)
    {
      this.yaw -= deltaYaw;
      this.pitch -= deltaPitch;
    
      const maxPitch = Math.PI / 2 - 0.01;
      this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));
    
      let newForward = vec3.fromValues(
          Math.cos(this.pitch) * Math.sin(this.yaw),
          Math.sin(this.pitch),
          Math.cos(this.pitch) * Math.cos(this.yaw)
      );
    
      vec3.add(this.target, this.position, newForward);
    
      this.setViewMatrix();
    }

    getDirectionVectors()
    {
        let forw = vec3.subtract([], this.target, this.position);
        this.forwardVec = vec3.normalize([], forw);

        let righ = vec3.cross([], this.forwardVec, this.up)
        this.rightVec = vec3.normalize([], righ);

        this.upVec =  vec3.normalize([], this.up);
    }

    updateCameraPosition(inPlayer)
    {
        this.getDirectionVectors();
        this.getSprint(inPlayer);
    
        // Update position based on input
        if (inPlayer.moveForward && !inPlayer.moveBack) {
            this.position[0] += this.forwardVec[0] * inPlayer.currSpeed;
            this.position[2] += this.forwardVec[2] * inPlayer.currSpeed;
            this.target[0] += this.forwardVec[0] * inPlayer.currSpeed;
            this.target[2] += this.forwardVec[2] * inPlayer.currSpeed;
        }
        if (inPlayer.moveBack) {
            this.position[0] -= this.forwardVec[0] * inPlayer.currSpeed;
            this.position[2] -= this.forwardVec[2] * inPlayer.currSpeed;
            this.target[0] -= this.forwardVec[0] * inPlayer.currSpeed;
            this.target[2] -= this.forwardVec[2] * inPlayer.currSpeed;
        }
        if (inPlayer.moveLeft) {
            this.position[0] -= this.rightVec[0] * inPlayer.currSpeed;
            this.position[2] -= this.rightVec[2] * inPlayer.currSpeed;
            this.target[0] -= this.rightVec[0] * inPlayer.currSpeed;
            this.target[2] -= this.rightVec[2] * inPlayer.currSpeed;
        }
        if (inPlayer.moveRight && !inPlayer.moveLeft) {
            this.position[0] += this.rightVec[0] * inPlayer.currSpeed;
            this.position[2] += this.rightVec[2] * inPlayer.currSpeed;
            this.target[0] += this.rightVec[0] * inPlayer.currSpeed;
            this.target[2] += this.rightVec[2] * inPlayer.currSpeed;
        }
        if (inPlayer.moveUp && !inPlayer.moveDown && this.position[1] <= this.ceiling) {
            this.position[1] += this.upVec[1] * inPlayer.currFloat;
            this.target[1] += this.upVec[1] * inPlayer.currFloat;
        }
        if (inPlayer.moveDown && this.position[1] >= this.floor) {
            this.position[1] -= this.upVec[1] * inPlayer.currFloat;
            this.target[1] -= this.upVec[1] * inPlayer.currFloat;
        }
    
        // Constrain to radius in xz plane
        if(this.constraints)
        {
            const distXZ = Math.sqrt(this.position[0] ** 2 + this.position[2] ** 2);
            if (distXZ > this.maxRadius) {
                const scale = this.maxRadius / distXZ;

                this.position[0] *= scale;
                this.position[2] *= scale;
                
                this.target[0] *= scale;
                this.target[2] *= scale;
            }
        }
    
        this.setViewMatrix();
    }
}