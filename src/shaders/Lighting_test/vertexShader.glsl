varying vec3 worldNormal;
varying vec3 eyeVector;

varying vec3 worldPosition;

void main() {

  vec3 pos = position;
  
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vec4 mvPosition = viewMatrix * worldPos;
  
  gl_Position = projectionMatrix * mvPosition;

  vec3 transformedNormal = normalMatrix * normal;
  worldNormal = normalize(transformedNormal);
  worldPosition = worldPos.xyz;
  eyeVector = normalize(worldPos.xyz - cameraPosition);
}
