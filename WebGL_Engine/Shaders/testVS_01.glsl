#version 300 es


in vec3 VertexPosition;

void main()  
{
    gl_Position = vec4(VertexPosition, 1.0);
    
}