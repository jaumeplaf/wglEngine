//Initialize key inputs
//Movement
const keyForward = 'w';
const keyLeft = 'a';
const keyBackward = 's';
const keyRight = 'd';
const keyUp = ' ';
const keyDown = 'q';
const keySprint = 'shift';
//Draw modes
const keyDrawMode0 = '1';
const keyDrawMode1 = '2';
const keyDrawMode2 = '3';
const keyDrawMode3 = '4';
const keyDrawMode4 = '5';
const keyDrawMode5 = '6';
const keyDrawMode6 = '7';

//Initialize HTML inputs
//Fog
const inFogColor = document.getElementById('fogColor');
const inFogAmount = document.getElementById('fogAmount');
const inFogPower = document.getElementById('fogPower');

//Camera
const inFov = document.getElementById('fov');

//Shading
const inCelShad = document.getElementById('celShad');
const inCelSteps = document.getElementById('celSteps');
const inCelContrast = document.getElementById('celContrast');

//Lights
const inLights = document.getElementById('lights');
const inLightIntensity = document.getElementById('lightIntensity');
const inLightRadius = document.getElementById('lightRadius');
const inLightPosX = document.getElementById('lightPositionX');
const inLightPosY = document.getElementById('lightPositionY');
const inLightPosZ = document.getElementById('lightPositionZ');
const inLa = document.getElementById('La');
const inLd = document.getElementById('Ld');
const inLs = document.getElementById('Ls');

class InputParameters
{ 
  constructor(inCamera)
  {
    this.mouseLock = false;
    
    this.fogColor = hexToRgba(inFogColor.value, 1.0);
    this.fogAmount = inFogAmount.value;
    this.fogPower = inFogPower.value;
    
    this.fov = degToRad(inFov.value);
    this.nearPlane = inCamera.nearPlane;
    this.farPlane = inCamera.farPlane;

    this.time = 0;

    this.activeLight = null;
  }
  
  setUniforms(inProgram)
  {
    window.gl.uniform4f(inProgram.progFogColor, this.fogColor[0], this.fogColor[1],this.fogColor[2],this.fogColor[3]);
    window.gl.uniform1f(inProgram.progFogAmount, this.fogAmount);
    window.gl.uniform1f(inProgram.progFogPower, this.fogPower);  
    
    window.gl.uniform1f(inProgram.progNearPlane, this.nearPlane);
    window.gl.uniform1f(inProgram.progFarPlane, this.farPlane); 
  }
  
  initializeEventListeners(inScene)
  {
    //Keyboard
    window.addEventListener('keydown', (event) => {

      let key = event.key.toLowerCase();
      
      if(key === keyForward) inScene.player.moveForward = true;
      if(key === keyLeft) inScene.player.moveLeft = true;
      if(key === keyBackward) inScene.player.moveBack = true;
      if(key === keyRight) inScene.player.moveRight = true;
      if(key === keyUp) inScene.player.moveUp = true;
      if(key === keyDown) inScene.player.moveDown = true;
      if(key === keySprint) inScene.player.sprint = true;
      if(key === keyDrawMode0) inScene.drawMode = 0;
      if(key === keyDrawMode1) inScene.drawMode = 1;
      if(key === keyDrawMode2) inScene.drawMode = 2;
      if(key === keyDrawMode3) inScene.drawMode = 3;
      if(key === keyDrawMode4) inScene.drawMode = 4;
      if(key === keyDrawMode5) inScene.drawMode = 5;
      if(key === keyDrawMode6) inScene.drawMode = 6;
    });
    
    window.addEventListener('keyup', (event) => {
      
      let key = event.key.toLowerCase();

      if(key === keyForward) inScene.player.moveForward = false;
      if(key === keyLeft) inScene.player.moveLeft = false;
      if(key === keyBackward) inScene.player.moveBack = false;
      if(key === keyRight) inScene.player.moveRight = false;
      if(key === keyUp) inScene.player.moveUp = false;
      if(key === keyDown) inScene.player.moveDown = false;
      if(key === keySprint) inScene.player.sprint = false;
    });
    
    //Mouse
    canvas.addEventListener('click', () => {
      canvas.requestPointerLock();
      this.mouseLock = true;
    });
    
    canvas.addEventListener('wheel', (event) => {
      if(this.mouseLock){
        if(event.deltaY < 0){ //SpeedUp
          inScene.player.updateSpeed(true);
        }
        else if(event.deltaY > 0){ //SpeedDown
          inScene.player.updateSpeed(false);
        }
      }
    });
    
    document.addEventListener('pointerlockchange', () => {
      this.mouseLock = (document.pointerLockElement === canvas);
    });
    
    document.addEventListener('mousemove', (event) => {
      if (document.pointerLockElement === canvas) { //Mouse look
          let sensitivity =  0.002;
          let deltaX = event.movementX;
          let deltaY = event.movementY;

          inScene.player.camera.rotateView(deltaX * sensitivity, deltaY * sensitivity);
        }
      });
      
      //UI
      inFogColor.addEventListener('input', (event) =>{
        this.fogColor = hexToRgba(event.target.value, 1.0) ;
      });
      
      inFogAmount.addEventListener('input', (event) =>{
        this.fogAmount = event.target.value;
      });
      
      inFogPower.addEventListener('input', (event) =>{
        this.fogPower = event.target.value;
      });
      
    //Camera controls
    inFov.addEventListener('input', (event) => {
    this.fov = event.target.value;
    inScene.player.updateFov(this.fov);
    });

    //Shading
    inCelShad.addEventListener('input', (event) => {
      inScene.celShading = event.target.checked;
    });

    inCelSteps.addEventListener('input', (event) => {
      inScene.updateCelSteps(event.target.value);
    });

    inCelContrast.addEventListener('input', (event) => {
      inScene.updateCelContrast(event.target.value);
    });

    
    //Lights
    inLights.addEventListener('change', () => { //Whenever the dropdown changes, update the color pickers
      const selected = parseInt(inLights.value);
      this.activeLight = inScene.lights[selected];
      updateLightDisplay(
        this.activeLight, 
        this.activeLight.intensity,
        this.activeLight.radius,
        this.activeLight.position[0],
        this.activeLight.position[1],
        this.activeLight.position[2]
      );
    });
    
    inLightIntensity.addEventListener('input', (event) => {
      this.activeLight.setIntensity(event.target.value);
    });

    inLightRadius.addEventListener('input', (event) => {
      this.activeLight.setRadius(event.target.value);
    });

    inLightPosX.addEventListener('input', (event) => {
      this.activeLight.updatePosition([event.target.value, this.activeLight.position[1], this.activeLight.position[2]]);
      updateLightPositions(this.activeLight.position[0], this.activeLight.position[1], this.activeLight.position[2]);
    });
    
    inLightPosY.addEventListener('input', (event) => {
      this.activeLight.updatePosition([this.activeLight.position[0], event.target.value, this.activeLight.position[2]]);
      updateLightPositions(this.activeLight.position[0], this.activeLight.position[1], this.activeLight.position[2]);
    });

    inLightPosZ.addEventListener('input', (event) => {
      this.activeLight.updatePosition([this.activeLight.position[0], this.activeLight.position[1], event.target.value]);
      updateLightPositions(this.activeLight.position[0], this.activeLight.position[1], this.activeLight.position[2]);
    });

    inLa.addEventListener('input', (event) => { //Update selected light when any color changes
      const selected = parseInt(inLights.value);
      this.activeLight = inScene.lights[selected];
      this.activeLight.setLa(hexToRgb(event.target.value), true);
      this.activeLight.proxyUpdateColor();
    });

    inLd.addEventListener('input', (event) => {
      const selected = parseInt(inLights.value);
      this.activeLight = inScene.lights[selected];
      this.activeLight.setLd(hexToRgb(event.target.value));
    });

    inLs.addEventListener('input', (event) => {
      const selected = parseInt(inLights.value);
      this.activeLight = inScene.lights[selected];
      this.activeLight.setLs(hexToRgb(event.target.value));
    }); 
  }
}