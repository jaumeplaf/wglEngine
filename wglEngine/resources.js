class MeshObject 
{
  constructor(inModel, inMaterial)
  {
    this.model = inModel;
    this.material = inMaterial;

    this.initializeBuffers();
  }
  
  initializeBuffers()
  {
    this.initAttributeBuffer('indices', 'ELEMENT_ARRAY_BUFFER', Uint16Array);
    this.initAttributeBuffer('vertices', 'ARRAY_BUFFER', Float32Array);
    //TODO: check how to implement UVs correctly, respecting seams (duplicate vertices)
    this.initAttributeBuffer('normals', 'ARRAY_BUFFER', Float32Array);
    this.initAttributeBuffer('colors', 'ARRAY_BUFFER', Float32Array); 
    this.initAttributeBuffer('texcoords1', 'ARRAY_BUFFER', Float32Array); 
  }

  initAttributeBuffer(attributeName, bufferType, arrayType) {
    const data = this.model[attributeName];
    this[attributeName] = data;
    const bufferIdName = `idBuffer${attributeName.charAt(0).toUpperCase() + attributeName.slice(1)}`;
    this[bufferIdName] = window.gl.createBuffer();
    window.gl.bindBuffer(window.gl[bufferType], this[bufferIdName]);
    window.gl.bufferData(window.gl[bufferType], new arrayType(data), window.gl.STATIC_DRAW);
  }
}

class TextureObject {
  constructor(imagePath) {
      this.texture = window.gl.createTexture();
      this.loaded = false;
      this.imagePath = imagePath;
      this.loadTexture();
  }

  loadTexture() {
      const image = new Image();
      image.crossOrigin = 'anonymous'; // Avoid CORS issues
      image.src = this.imagePath;

      image.onload = () => {
          //console.log(`Successfully loaded texture: ${this.imagePath}`);
          this.bindTexture(image);
          this.loaded = true;
      };

      image.onerror = (error) => {
          console.error(`Failed to load texture: ${this.imagePath}`, error);
      };
  }

  bindTexture(image) {
      window.gl.bindTexture(window.gl.TEXTURE_2D, this.texture);
      window.gl.texImage2D(window.gl.TEXTURE_2D, 0, window.gl.RGBA, window.gl.RGBA, window.gl.UNSIGNED_BYTE, image);

      window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_MIN_FILTER, window.gl.LINEAR_MIPMAP_LINEAR);
      window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_MAG_FILTER, window.gl.LINEAR);

      window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_WRAP_S, window.gl.REPEAT);
      window.gl.texParameteri(window.gl.TEXTURE_2D, window.gl.TEXTURE_WRAP_T, window.gl.REPEAT);

      window.gl.generateMipmap(window.gl.TEXTURE_2D);
  }

  use() {
      window.gl.bindTexture(window.gl.TEXTURE_2D, this.texture);
  }
}