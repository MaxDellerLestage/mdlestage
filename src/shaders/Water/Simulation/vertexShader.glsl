
precision highp float;

out vec2 vUv;
out vec3 vNormal;
attribute float aIndex;
attribute float gIndex;

varying float vIndex;
varying float vGIndex;




void main() {

    vec3 transformedNormal = normalize(normalMatrix*normal);

    vUv = uv;
    vNormal = transformedNormal;
    vIndex = aIndex;
    vGIndex = gIndex;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

}