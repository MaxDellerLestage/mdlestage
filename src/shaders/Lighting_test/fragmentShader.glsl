
uniform vec2 winResolution;
uniform sampler2D uTexture;

uniform float uIorR;
uniform float uIorG;
uniform float uIorB;
uniform float uChromAb;
uniform float uRefraction;
uniform float uSaturation;

uniform float uSpecmult;
uniform float uDiffmult;
uniform float uSpecpow;
uniform float uFresnel;
uniform float uIntensity;
uniform float uOpacity;

varying vec3 worldNormal;
varying vec3 worldPosition;

vec3 sat(vec3 rgb, float intensity) {
    vec3 L = vec3(0.2125, 0.7254, 0.0721);
    vec3 grayscale = vec3(dot(rgb, L));
    return mix(grayscale, rgb, intensity);
}

const int LOOP = 16;

void main() {

    float iorRatioRed = 1.0/uIorR;
    float iorRatioGreen = 1.0/uIorG;
    float iorRatioBlue = 1.0/uIorB;

    vec3 color = vec3(0.0);
    
    vec2 uv = gl_FragCoord.xy / winResolution.xy;
    vec3 normal = worldNormal;

    for (int i=0; i<LOOP; i++) {
        float slide = float(i)/float(LOOP) * 0.001;
    
        vec3 refractVecR = refract(eyeVector, normal, iorRatioRed);
        vec3 refractVecG = refract(eyeVector, normal, iorRatioGreen);
        vec3 refractVecB = refract(eyeVector, normal, iorRatioBlue);

        float R = texture2D(uTexture, uv+refractVecR.xy * (uRefraction + slide * 0.1) * uChromAb).r;
        float G = texture2D(uTexture, uv+refractVecG.xy * (uRefraction + slide * 0.2) * uChromAb).g;
        float B = texture2D(uTexture, uv+refractVecB.xy * (uRefraction + slide * 0.3) * uChromAb).b;

        color.r += R;
        color.g += G;
        color.b += B;

        color = sat(color, uSaturation);
    }

    color /= float(LOOP);

    //applyLights(color, uSpecmult, uDiffmult, uSpecpow, uFresnel, normal, worldPosition, uIntensity);
    color += vec3(0.1, 0.2, 0.3);
    gl_FragColor = vec4(color, uOpacity);
    /* #include <tonemapping_fragment>
    #include <colorspace_fragment> */
}
