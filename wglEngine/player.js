class Player 
{
    constructor(inCamera)
    {
        this.camera = inCamera;

        this.speedMult = 0.025;
        this.speedDelta = 3; // 1-10 speed steps
        this.sprint = false;
        this.sprintMult = 5;

        this.walkSpeed = this.speedMult * this.speedDelta;
        this.floatSpeed = this.speedMult * this.speedDelta;
        this.aimSpeed = 1;

        this.currSpeed = this.walkSpeed;
        this.currFloat = this.floatSpeed;
                
        this.moveForward = false;
        this.moveLeft = false;
        this.moveBack = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
    }

    //TODO: fix this function. event triggering for mouse up and down simultaniously?
    //make it fixed steps
    updateSpeed(add)
    {   
        if(add && this.speedDelta < 10){
            this.speedDelta++;
        }
        else if(this.speedDelta > 1){
            this.speedDelta-- && this.speedDelta < 0.1;
        }
        
        this.walkSpeed = this.speedMult * this.speedDelta;
        this.floatSpeed = this.speedMult * this.speedDelta * 0.5;
    }

    setWalkSpeed(newSpeed)
    {
        this.walkSpeed = newSpeed;
    }

    setFloatSpeed(newSpeed)
    {
        this.floatSpeed = newSpeed;
    }

    setAimSpeed(newSpeed)
    {
        this.aimSpeed = newSpeed;
    }

    updateFov(newFov)
    {
        this.camera.fov = degToRad(newFov);
        this.camera.setProjectionMatrix();
        updateFovDisplay(newFov);
    }

    isMoving()
    {
        if(this.moveForward || this.moveLeft || this.moveBack || this.moveRight)
        {
            return true;
        }
    }

    isFloating()
    {
        if(this.moveUp || this.moveDown)
        {
            return true
        }
    }

    moveCamera()
    {
        if(this.isMoving() || this.isFloating()){
            this.camera.updateCameraPosition(this);
        }
    }

}