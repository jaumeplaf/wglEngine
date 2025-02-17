//Utility library script, handles miscelanious reusable functions

function rgbToHex(r, g, b) {
    //clamp & convert each float 0..1 to 0..255 if needed
    return '#' + [r,g,b].map(c=> {
      let hex = Math.round(c * 255).toString(16).padStart(2,'0');
      return hex;
    }).join('');
}

function hexToRgb(hexColor){
    //converts #000000 to [r,g,b]
    hexColor = hexColor.replace('#','');
    
    let r = parseInt(hexColor.substring(0, 2), 16) / 255;
    let g = parseInt(hexColor.substring(2, 4), 16) / 255;
    let b = parseInt(hexColor.substring(4, 6), 16) / 255;
    
    return [r, g, b];
}

function hexToRgba(hexColor, alpha){
    //converts #000000 + float alpha to [r,g,b,a]
    hexColor = hexColor.replace('#','');
    
    let r = parseInt(hexColor.substring(0, 2), 16) / 255;
    let g = parseInt(hexColor.substring(2, 4), 16) / 255;
    let b = parseInt(hexColor.substring(4, 6), 16) / 255;
    
    return [r, g, b, alpha];
}


function clamp(value, min, max) 
{
    return Math.min(Math.max(value, min), max);
}

function saturate(value)
{
    return Math.min(Math.max(value, 0), 1);
}

function remapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function remapRangeNormalized(value, low1, high1) {
    return (value - low1) / (high1 - low1);
}

function getCanvasRatio(inCanvas)
{
    return  1 / (inCanvas.height / inCanvas.width);
}

function degToRad(degrees)
{
  return degrees * (Math.PI/180);
}

function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

function generateGrid(divisions, size) {
    let model = {
        vertices: [],
        indices: []
    };
    
    let halfSize = size / 2;
    let step = size / divisions;

    // Generate vertices
    for (let i = 0; i <= divisions; i++) {
        for (let j = 0; j <= divisions; j++) {
            let x = -halfSize + j * step;
            let z = halfSize - i * step;
            model.vertices.push(x, 0, z);  // y=0 for a flat grid
        }
    }

    // Generate indices
    for (let i = 0; i < divisions; i++) {
        for (let j = 0; j < divisions; j++) {
            let topLeft = i * (divisions + 1) + j;
            let topRight = topLeft + 1;
            let bottomLeft = topLeft + (divisions + 1);
            let bottomRight = bottomLeft + 1;

            // Two triangles per grid cell
            model.indices.push(topLeft, bottomLeft, topRight);    // First triangle
            model.indices.push(topRight, bottomLeft, bottomRight); // Second triangle
        }
    }

    return model;
}

function generateInstancesRadial(GameObject, objectCollection, instanceNum, center, minScale, maxScale, radius, maxHeight, orient, rotationOffset = 0, safeZone = 0) {
    let instances = [];
    
    for (let i = 0; i < instanceNum; i++) {
        // Generate random position within a radial constraint
        let angle = Math.random() * Math.PI * 2;
        let distance = radius * Math.sqrt(Math.random());
        
        // Skip if within safe zone
        if (distance < safeZone) {
            i--; // Try again for this instance
            continue;
        }
        
        let x = center[0] + Math.cos(angle) * distance;
        let z = center[2] + Math.sin(angle) * distance;
        let y = center[1] + (Math.random() * 2 * maxHeight - maxHeight);
        
        let randomScale = Math.random() * (maxScale - minScale) + minScale;
        let newMeshActor = new MeshActor(GameObject, objectCollection);
        newMeshActor.setMatrix(x, y, z, randomScale);
        
        if(!orient) {
            let randomYRotation = Math.random() * 360;
            newMeshActor.setRotation(randomYRotation, [0, 1, 0]);
        } else {
            // Calculate the angle using atan2
            let dx = x - center[0];
            let dz = z - center[2];
            let rotationAngle = radToDeg(Math.atan2(dx, dz));
            
            // Add 180 degrees to make instances point towards center instead of away
            // Plus any additional rotation offset
            rotationAngle += 180 + rotationOffset;
            
            newMeshActor.setRotation(rotationAngle, [0, 1, 0]);
        }
    }
    
    return instances;
}

function debugInstance(name, instance) {
    console.log(name.toUpperCase());
    console.log("Debug attributes: ");
    console.log("Indices: ", instance.indices);
    console.log("Vertices: ", instance.vertices);
    console.log("Colors: ", instance.colors);
    console.log("Normals: ", instance.normals);
    console.log("Texture Coordinates 1: ", instance.texcoords1);
    console.log("Debug idBuffers: ");
    console.log("Index Buffer: ", instance.idBufferIndices);
    console.log("Vertex Buffer: ", instance.idBufferVertices);
    console.log("Normal Buffer: ", instance.idBufferNormals);
    console.log("Color Buffer: ", instance.idBufferColors);
    console.log("Texture Coordinate Buffer 1: ", instance.idBufferTexcoords1);

    console.log("Debug model matrix: ", instance.modelMatrixIndex); 
}