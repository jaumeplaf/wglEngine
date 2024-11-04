var canvas = null;
var gl = null;

function getWebGLContext() 
{
    canvas = document.getElementById("wglCanvas");
  
    try {
      return canvas.getContext('webgl2');
    }
    catch(e) {
    }
  
    return null;
  
}

function initWebGL() 
{
    gl = getWebGLContext();
    
    if (!gl) {
      alert("WebGL 2.0 is not aviable");
      return;
    }
    initRendering();
}

//Initiate WebGL2.0 API
initWebGL();