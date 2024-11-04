#version 300 es

uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;

in vec3 VertexPosition;
out vec4 vPos;

void main()  {

    gl_Position = projectionMatrix * modelMatrix * vec4(VertexPosition, 1.0);
    vPos = vec4(VertexPosition, 0.0);

}