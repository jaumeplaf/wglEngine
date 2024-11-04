//Initialize HTML inputs

const inShadingMode = document.getElementById('shadingMode');
const inWireframeIgnoreFog = document.getElementById('wireframeIgnoreFog');
const inWireframeOpacity = document.getElementById('wireframeOpacity');
const inFogColor = document.getElementById('fogColor');
const inFogAmount = document.getElementById('fogAmount');
const inFogPower = document.getElementById('fogPower');

function initializeEventListeners(inScene, inputParam)
{
  //Shading mode select
  inShadingMode.addEventListener('change', (event) => {
    inputParam.shadingMode = parseInt(event.target.value);
    requestAnimationFrame(() => inScene.drawScene());
    console.log(inputParam.shadingMode);
  });
  
  inWireframeOpacity.addEventListener('change', (event) =>{
    inputParam.wireframeOpacity = event.target.value;
    requestAnimationFrame(() => inScene.drawScene());
  });
  
  inFogColor.addEventListener('change', (event) =>{
    inputParam.fogColor = hexToRgba(event.target.value, 1.0) ;
    requestAnimationFrame(() => inScene.drawScene());
    //console.log(fogAmount);
  });

  inFogAmount.addEventListener('change', (event) =>{
    inputParam.fogAmount = event.target.value;
    requestAnimationFrame(() => inScene.drawScene());
    //console.log(fogAmount);
  });
  
  inFogPower.addEventListener('change', (event) =>{
    inputParam.fogPower = event.target.value;
    requestAnimationFrame(() => inScene.drawScene());
    //console.log(fogPower);
  });

  //Wireframe ignore fog toggle
  inWireframeIgnoreFog.addEventListener('change', (event) => {
    if(inputParam.shadingMode == 0 || inputParam.shadingMode == 2){
      inputParam.wireframeIgnoreFog = event.target.checked ? 1.0 : 0.0;
    }
    requestAnimationFrame(() => inScene.drawScene());
  });
}

function updateUniforms(inputParam, inProgram)
{
  gl.uniform1f(inProgram.progShadingMode, inputParam.shadingMode);
  gl.uniform1f(inProgram.progWireframeOpacity, inputParam.wireframeOpacity);
  
  gl.uniform4f(inProgram.progFogColor, inputParam.fogColor[0], inputParam.fogColor[1],inputParam.fogColor[2],inputParam.fogColor[3]);
  gl.uniform1f(inProgram.progFogAmount, inputParam.fogAmount);
  gl.uniform1f(inProgram.progFogPower, inputParam.fogPower);  
  gl.uniform1f(inProgram.progWireframeIgnoreFog, inputParam.wireframeIgnoreFog);

  gl.uniform1f(inProgram.progNearPlane, inputParam.nearPlane);
  gl.uniform1f(inProgram.progFarPlane, inputParam.farPlane);  

}

class InputParameters
{ 
  constructor(inCamera)
  {
    this.shadingMode = parseInt(inShadingMode.value);
    this.wireframeOpacity = inWireframeOpacity.value;

    this.fogColor = hexToRgba(inFogColor.value, 1.0);
    this.fogAmount = inFogAmount.value;
    this.fogPower = inFogPower.value;
    this.wireframeIgnoreFog = inWireframeIgnoreFog.checked ? 1.0 : 0.0;

    this.nearPlane = inCamera.nearPlane;
    this.farPlane = inCamera.farPlane;

  }
}