precision highp float;

uniform sampler2D uPositionTex;
uniform sampler2D uNormalTex;
uniform sampler2D uColorTex;
uniform float uTextureSize;
uniform vec3 uPos;

uniform float uValidCount;

uniform float uTextureWidth;
uniform float uTextureHeight;

in float aIndex;
in float gIndex;
out vec3 vColor;
out vec3 vPosition;
out vec3 vNormal;
out vec3 eyeVector;


vec2 getUV(float index) {
    float x = mod(index, uTextureWidth);
    float y = floor(index / uTextureWidth);
    return (vec2(x+0.5, y+0.5) / vec2(uTextureWidth, uTextureHeight));
}

void main() {

    /* if (float(aIndex) >= uValidCount) {
        gl_Position = vec4(0.0);
        vColor = vec3(0.0);
        return;
    } */

    float clampedIndex = min(float(aIndex), uValidCount-1.0);

    vec2 tuv = getUV(float(clampedIndex));
    
    vec3 pos = texture(uPositionTex, tuv).xyz;
    vNormal = texture(uNormalTex, tuv).xyz;
    vColor = texture(uColorTex, tuv).rgb;
    vPosition = pos;
    eyeVector = normalize(pos - cameraPosition);

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

}