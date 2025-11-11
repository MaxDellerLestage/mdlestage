#define PI 3.14159265359

uniform float uCount;
uniform float uRadius;
uniform vec3 uPos;
uniform vec3 uInit_color;
uniform float uSpread;
uniform float uSeed;
uniform float uSize;
uniform float uScale;
uniform float uAmp;
uniform float uSaturation;
uniform float uGradient;
uniform float uGradientSize;
uniform float uFade;
uniform float uColorMult;
uniform vec3 uGradientOffset;
uniform float uDensity;
uniform float uAlpha;

attribute vec3 instancePosition;
attribute vec3 instanceColor;

out vec3 vColor;

void main() {w

    float id = float(gl_VertexID);
    vec3 mid_pos = uPos;
    float distanceColor = abs(pow(distance(instancePosition, mid_pos + uGradientOffset), uGradient));
    float distanceSize = abs(pow(distance(instancePosition, mid_pos + uGradientOffset), uGradientSize));
    vec3 new_color = vec3 (instanceColor.x, instanceColor.y, instanceColor.z);

    vec3 final_color = mix(uInit_color, new_color, distanceColor*uColorMult);

    vec4 modelPosition = modelMatrix * vec4(instancePosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;


    vColor = final_color/uSaturation;
    
    
    gl_Position = projectedPosition;
    gl_PointSize = uSize;
    gl_PointSize = mix(uSize/distanceSize, uSize, uDensity);
    
}