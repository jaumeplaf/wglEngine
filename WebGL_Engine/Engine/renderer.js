function initRendering() 
{
  gl.lineWidth(1.5);

  gl.enable(gl.DEPTH_TEST);

  //Fix Z-fighting
  gl.enable(gl.POLYGON_OFFSET_FILL);
  gl.polygonOffset(0.0, 0.0);
}

function drawModel(model) 
{
  let program = model.shader.program;
  let bColor = model.baseColor;
  let lColor = model.lineColor;
  let shadingMode = parseInt(inShadingMode.value);

  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  
  gl.uniform1f (program.progShadingMode, shadingMode);

  //Temp
  //gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);

  
  switch(shadingMode){
    case 0: //Wireframe
      gl.uniform4f (program.progBaseColor, bColor[0], bColor[1], bColor[2], 1.0 );
      gl.uniform4f (program.progLineColor, lColor[0], lColor[1], lColor[2], 1.0 );
      gl.uniform1f (program.progWireframeOpacity, inWireframeOpacity.value);
      gl.uniform1f (program.progWireframeIgnoreFog, inWireframeIgnoreFog.value);

      for (var i = 0; i < model.indices.length; i += 3){
        gl.drawElements (gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, i*2);
      }
    break;

    case 1: //Color
      gl.uniform1f (program.progWireframeOpacity, 2.0);
      gl.uniform1f (program.progWireframeIgnoreFog, 0.0);
      gl.uniform4f (program.progBaseColor, bColor[0], bColor[1], bColor[2], 1.0 );
      gl.uniform4f (program.progLineColor, lColor[0], lColor[1], lColor[2], 1.0 );

      gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
    break;

    case 2: //Color+Wireframe
      gl.polygonOffset(1.0, 1.0);
      gl.uniform4f (program.progBaseColor, bColor[0], bColor[1], bColor[2], 1.0 );
      gl.uniform4f (program.progLineColor, lColor[0], lColor[1], lColor[2], 1.0 );
      gl.uniform1f (program.progWireframeOpacity, 2.0);
      gl.uniform1f (program.progWireframeIgnoreFog, 0.0);

      gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
      
      gl.polygonOffset(0.0, 0.0);
      gl.uniform4f (program.progBaseColor, bColor[0], bColor[1], bColor[2], 1.0 );
      gl.uniform4f (program.progLineColor, lColor[0], lColor[1], lColor[2], 1.0 );
      gl.uniform1f (program.progWireframeOpacity, wireframeOpacity.value);
      gl.uniform1f (program.progWireframeIgnoreFog, inWireframeIgnoreFog.value);

      for (var i = 0; i < model.indices.length; i += 3){
        gl.drawElements (gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, i*2);
      }
    break;

    case 3: //Normal
      gl.uniform1f (program.progWireframeOpacity, 2.0);
      gl.uniform1f (program.progWireframeIgnoreFog, 0.0);
      gl.uniform4f (program.progBaseColor, 0.0, 0.0, 1.0, 1.0 );

      gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
    break;
    }
  }