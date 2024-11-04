class GameObject 
{
  constructor()
  {
    this.modelMatrixIndex = mat4.create();
    this.baseColor = [1,0,0];
    this.lineColor = [0,0,0];
    this.vertices = [];
    this.indices = [];
    this.shader = null;
  }

  initializeObject(model, inShader)
  {
    this.vertices = model.vertices;
    this.indices = model.indices;
    this.shader = inShader;
    this.initBuffers()
  }

  initBuffers() {

    this.idBufferVertices = gl.createBuffer ();
    gl.bindBuffer (gl.ARRAY_BUFFER, this.idBufferVertices);
    gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    
    this.idBufferIndices = gl.createBuffer ();
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, this.idBufferIndices);
    gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    
  }    

  setMatrix(tx, ty, tz, uniformS)
  {
    //Initilaize ModelView, translation, scale matrix 
    let M = mat4.create();
    let T = mat4.create();
    let S = mat4.create ();
    //Initialize scale and position
    mat4.fromScaling(S, [uniformS, uniformS, uniformS]);
    mat4.fromTranslation(T, [tx, ty, tz]);
    mat4.multiply(M, T, S);

    this.modelMatrixIndex = M;

    //gl.uniformMatrix4fv(this.shader.modelMatrixIndex, false, this.modelMatrixIndex);

  }
  
  animate(s, axis)
  {
    let R = mat4.create();
      //Set rotation matrix (out, rad, axis)
      mat4.fromRotation(R, s, axis);
      mat4.multiply(this.modelMatrixIndex, this.modelMatrixIndex, R);
  }

  setBaseColor(newBaseColor)
  {
    this.baseColor = newBaseColor;
  }

  setLineColor(newLineColor)
  {
    this.lineColor = newLineColor;
  }

  draw(){
    drawModel(this);
  }

}

class ObjectCollection
{
    constructor(camera)
    {
        this.sharedShaderGroup = [];
        this.shader = null;
    }

    initialize(inShader)
    {
        this.shader = inShader;
    }

    add(model)
    {
        this.sharedShaderGroup.push(model);
    }

    draw()
    {
      for(let object of this.sharedShaderGroup)
      {
          this.shader.setModelMatrix(object.modelMatrixIndex);
          object.draw();
      }
    }
}
  
