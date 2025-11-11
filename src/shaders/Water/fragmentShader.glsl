precision highp float;

in vec3 vColor;
in vec3 vPosition;
in vec3 vNormal;

uniform vec3 uPos;
uniform float uSpecmult;
uniform float uDiffmult;
uniform float uSpecpow;
uniform float uFresnel;
uniform float uIntensity;


uniform float uOpacity;




void main() {
    
    vec3 color = vColor;
    vec3 norm = vNormal;
    //color = vec3 (1.0, 0.0, 0.0);
    //applyLights(color, uSpecmult, uDiffmult, uSpecpow, uFresnel, norm, vPosition+uPos, uIntensity);

    gl_FragColor = vec4(color, uOpacity);
}