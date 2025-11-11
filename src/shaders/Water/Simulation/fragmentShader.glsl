#define MAX_WAVES 10


precision highp float;

uniform int uPass;

uniform sampler2D uPos;
uniform sampler2D uPrevPos;
uniform sampler2D uNewNormal;
uniform sampler2D uIndexTex;
uniform float uVertexCount;

uniform float uTextureWidth;
uniform float uTextureHeight;

uniform float uSize;
uniform vec3 uColor_1;
uniform vec3 uColor_2;
uniform float uColormult;

uniform float uAmpMult;

uniform float uOpacity;

uniform float uLoopTime;

uniform sampler2D uNoiseParams;

uniform sampler2D uMaskParams;

uniform sampler2D uWaveParams;
uniform float uNumWaves;

uniform float uTime;

uniform float uYaw;
uniform float uTilt;
uniform float uPitch;
uniform float uYawSpeed;
uniform float uTiltSpeed;
uniform float uPitchSpeed;

uniform vec3 uCenter;

in vec2 vUv;
in vec3 vNormal;
varying float vIndex;
varying float vGIndex;

layout(location=1) out vec4 fboNormal;
layout(location=2) out vec4 fboColor;

/*
    This fragment shader performs all vertex position, indexing, and normal calculations for the Water component.
*/

vec2 getUV(float index, float width, float height) {
    float x = mod(index, width);
    float y = floor(index / width);
    return (vec2(x+0.5, y+0.5) / vec2(width, height));
}


void main() {
    
    float ind = texture(uIndexTex, vUv).r;
    float group_ind = texture(uIndexTex, vUv).g;
    vec3 pos = texture(uPos, getUV(ind, uTextureWidth, uTextureHeight)).xyz;
    vec3 norm = normalize(pos);
    
    vec4 worldPosition = vec4(pos, 1.0);

    vec4 noise_params_01 = texture(uNoiseParams, getUV(0.0, 2.0, 1.0));
    vec4 noise_params_02 = texture(uNoiseParams, getUV(1.0, 2.0, 1.0));

    vec4 mask_params_01 = texture(uMaskParams, getUV(0.0, 2.0, 1.0));
    vec4 mask_params_02 = texture(uMaskParams, getUV(1.0, 2.0, 1.0));

    vec3 loop_pos = getLoopingFBM(uTime, uLoopTime, worldPosition.xyz);

    float detail = fbm(
        worldPosition.xyz*noise_params_01.r, 
        noise_params_01.g, 
        noise_params_01.b, 
        noise_params_01.a,
        int(noise_params_02.r),
        noise_params_02.g,
        noise_params_02.b
        );

    float maskNoise = fbm(
        loop_pos*worldPosition.xyz*mask_params_01.r, 
        mask_params_01.g, 
        mask_params_01.b, 
        mask_params_01.a,
        int(mask_params_02.r),
        mask_params_02.g,
        mask_params_02.b
        );

    float final_noise = detail*maskNoise;

    vec3 direction = normalize(worldPosition.xyz);

    vec3 displacement = final_noise*direction*uAmpMult;

    worldPosition.xyz += displacement;

    vec3 normalOut = getPerturbedNormal(pos, norm, worldPosition.xyz);

    float wave_displacement = 0.0;

    for (int i=0; i<MAX_WAVES; i++) {
        if (i>=int(uNumWaves)) break;

        vec2 lookup_01 = getUV(float(i), uNumWaves*4.0, 1.0);
        vec2 lookup_02 = getUV(float(i)+1.0, uNumWaves*4.0, 1.0);
        vec2 lookup_03 = getUV(float(i)+2.0, uNumWaves*4.0, 1.0);
        vec2 lookup_04 = getUV(float(i)+3.0, uNumWaves*4.0, 1.0);

        vec4 params_01 = texture(uWaveParams, lookup_01);
        vec4 params_02 = texture(uWaveParams, lookup_02);
        vec4 params_03 = texture(uWaveParams, lookup_03);
        vec4 params_04 = texture(uWaveParams, lookup_04);

        applyWaveAndRotation(
            worldPosition,
            normalOut,
            uTime,
            uCenter,
            params_01.r, params_01.g, params_01.b,
            params_01.a, params_02.r, params_02.g,
            params_02.b, params_02.a, params_03.r,
            params_03.g, params_03.b, params_03.a,
            params_04.r, params_04.g, params_04.b,
            wave_displacement
        );

    }

    float ao = getAO(final_noise*uAmpMult+wave_displacement);

    vec3 color = mix(uColor_1, uColor_2, ao)/uColormult;

    pc_fragColor = vec4(worldPosition.xyz, 1.0);

    fboNormal = vec4(normalOut, 1.0);

    fboColor = vec4(color, 1.0);
    
}