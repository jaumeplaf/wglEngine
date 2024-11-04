#version 300 es
    
precision mediump float;

in vec4 vPos;
out vec4 fragmentColor;

uniform float shadingMode;

uniform vec4 baseColor;
uniform vec4 lineColor;
uniform vec4 fogColor;

uniform float wireframeIgnoreFog;
uniform float wireOpacity;

//Fog parameters
uniform float nPlane;
uniform float fPlane;
uniform float fogAmount;
uniform float fogPower;



float saturate(float value)
{
    return clamp(value, 0.0, 1.0);
}

float linearDepth(float depth)
{
    float z = depth * 2.0 - 1.0;
    return (2.0 * nPlane * fPlane) / (fPlane + nPlane - z * (fPlane - nPlane));
}

void main() 
{
    float depth = linearDepth(gl_FragCoord.z) / fPlane;
    float correctedDepth = saturate(pow(depth * fogAmount, fogPower));
    vec4 vDepth = vec4(vec3(correctedDepth), 1.0);
    vec4 fogFinalColorAdd = baseColor + vDepth * fogColor;

    //TODO: This gives us the world normal visualization (AFFECTED BY FOGAMOUNT AND FOGPOWER)
    //vec4 fogFinalColor = mix(vPos, fogColor, correctedDepth);

    //Good final color
    vec4 fogFinalColor = mix(baseColor, fogColor, correctedDepth);

    vec4 fogLineColor = mix(lineColor, fogColor, correctedDepth);

    if(shadingMode == 3.0){
        if(wireOpacity == 2.0){ //Not wireframe
        fogFinalColor = mix(vPos, fogColor, correctedDepth);
        }
        
        else{
        if(wireframeIgnoreFog == 1.0){ 
            fragmentColor = mix(fogColor, lineColor, wireOpacity);
        }
        else{
            fragmentColor = mix(fogFinalColor, fogLineColor, wireOpacity);
        }
        }
    }
    if(wireOpacity == 2.0){ //Not wireframe
        
        fragmentColor = fogFinalColor;
    }

    else{
        if(wireframeIgnoreFog == 1.0){ 
            fragmentColor = mix(fogColor, lineColor, wireOpacity);
        }
        else{
        fragmentColor = mix(fogFinalColor, fogLineColor, wireOpacity);
        }
    }
}