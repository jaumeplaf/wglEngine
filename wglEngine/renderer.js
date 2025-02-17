//TODO: Add lighting (phong...), ambient/diffuse/specular, multiple lights

window.canvas = null;
window.gl = null;

function getWebGLContext()
{
    window.canvas = document.getElementById("wglCanvas");

    try {
        return window.canvas.getContext('webgl2');
    } 

    catch (e) {
    }

    return null;
}

function initWebGL()
{
    window.gl = getWebGLContext();

    if (!window.gl) {
        alert("WebGL 2.0 is not available");
        return;
    }
    
    initRendering();
}

function initRendering() 
{
    window.gl.lineWidth(1.5);
    
    window.gl.enable(window.gl.DEPTH_TEST);
    
    //Fix Z-fighting
    window.gl.enable(window.gl.POLYGON_OFFSET_FILL);
    window.gl.polygonOffset(0.0, 0.0);
    
    //Enable backface culling
    window.gl.enable(gl.CULL_FACE);
}

function bindModelBuffers(model, inShader) {
    window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    
    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferVertices);
    window.gl.vertexAttribPointer(inShader.vertexPositionAttribute, 3, window.gl.FLOAT, false, 0, 0);
    
    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferNormals);
    window.gl.vertexAttribPointer(inShader.vertexNormalAttribute, 3, window.gl.FLOAT, false, 0, 0);
    
    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferColors);
    window.gl.vertexAttribPointer(inShader.vertexColorAttribute, 4, window.gl.FLOAT, false, 0, 0);
    
    window.gl.bindBuffer(window.gl.ARRAY_BUFFER, model.idBufferTexcoords1);
    window.gl.vertexAttribPointer(inShader.texCoords1Attribute, 2, window.gl.FLOAT, false, 0, 0);
}

function drawModel(model, drawMode = 0) //Mode 0:Triangles, 1:Wireframe, 2:Points, 3:Triangles+Wireframe, 4:Triangles+Points, 5:Triangles+Wireframe+Points
{
    const inMaterial = model.meshObject.material;
    const inShader = inMaterial.program;
    const inScene = model.scene;
    model.meshObject.material.scene.camera.saveCameraPosition(inShader); //Save camera position

    window.gl.uniform1f(inShader.isPoint, 0.0);
    inMaterial.setCelShading();
    inMaterial.setTime();

    bindModelBuffers(model, inShader); //Bind buffers


    switch(drawMode)
    {
        case 0: 
            drawTriangles(model); 
            break;
        case 1: 
            drawWireframe(model, inShader); 
            break;
        case 2: 
            drawPoints(model, inShader); 
            break;
        case 3: 
            drawTriangles(model); 
            drawWireframe(model, inShader); 
            break;
        case 4: 
            drawTriangles(model); 
            drawPoints(model, inShader); 
            break;
        case 5: 
            drawTriangles(model); 
            drawWireframe(model, inShader); 
            drawPoints(model, inShader);
            break;
        case 6:
            drawTrianglesNormal(model, inShader);
    }

}

function drawTriangles(model)
{
    window.gl.drawElements(window.gl.TRIANGLES, model.indices.length, window.gl.UNSIGNED_SHORT, 0); //Draw triangles
}

function drawTrianglesNormal(model, inShader)
{
    window.gl.uniform1f(inShader.isPoint, 2.0); 
    window.gl.drawElements(window.gl.TRIANGLES, model.indices.length, window.gl.UNSIGNED_SHORT, 0); //Draw triangles
    window.gl.uniform1f(inShader.isPoint, 0.0);
}

function drawPoints(model, inShader)
{
    window.gl.uniform1f(inShader.isPoint, 1.0); //Enable point rendering

    window.gl.drawElements(window.gl.POINTS, model.indices.length, window.gl.UNSIGNED_SHORT, 0);
    
    window.gl.uniform1f(inShader.isPoint, 0.0); //Disable point rendering
}

function drawWireframe(model, inShader)
{
    window.gl.uniform1f(inShader.isPoint, 1.0); //Enable line rendering
    window.gl.polygonOffset(1.0, 1.0);

    for (var i = 0; i < model.indices.length; i += 3){
          window.gl.drawElements (window.gl.LINE_LOOP, 3, window.gl.UNSIGNED_SHORT, i*2);
    }
    
    window.gl.uniform1f(inShader.isPoint, 0.0); //Disable line rendering
    window.gl.polygonOffset(0.0, 0.0);
}

// Initiate WebGL 2.0 API
initWebGL();