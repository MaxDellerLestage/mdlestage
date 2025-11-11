#define MAX_LIGHTS 4

uniform vec3 uLightPositions[MAX_LIGHTS];
uniform vec3 uLightColors[MAX_LIGHTS];
uniform float uLightIntensities[MAX_LIGHTS];
uniform vec3 uViewPosition;
uniform float uSpecIntensities[MAX_LIGHTS];
uniform int uLightCount;
uniform float uDistanceMult;

in vec3 eyeVector;

// This function takes the light information passed with useLightStore and useSharedLights to the object refs.
// Correct lighting is then calculated in the function based on various positional and normal data.
// This is not a pure function, as it will alter color variable which is passed as the first argument.

void applyLights(inout vec3 color, float spec_mult, float diff_mult, float spec_pow, float fresnel_pow, vec3 vNormal, vec3 vPosition, float intensity) {

    vec3 result = vec3(0.0);

    for (int i = 0; i < MAX_LIGHTS; i++) {
        if (i>=uLightCount) break;
        vec3 viewDir = normalize(vPosition-uViewPosition);
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(uLightPositions[i]-vPosition);
        vec3 lightRef = reflect(-lightDir, normal);
        vec3 halfVec = normalize(eyeVector + lightDir);

        float NdotL = dot(normal, lightDir);
        float NdotH = max(dot(normal, lightRef), 0.0);
        float kDiff = max(0.0, NdotL);
        float NdotH2 = NdotH * NdotH;

        float kSpec = pow(NdotH2, spec_pow);

        float lightDistance = length(uLightPositions[i] - vPosition);

        if (lightDistance == 0.0) {
            lightDistance = 0.0001;
        }

        float fresnelFactor = abs(dot(eyeVector, normal));
        float inversefresnelFactor = 1.0 - fresnelFactor;

        float fres = pow(inversefresnelFactor, fresnel_pow);
        result += (((kDiff * diff_mult) + (kSpec * spec_mult * uSpecIntensities[i])) * uLightIntensities[i])/(lightDistance*uDistanceMult); 
        result += fres * vec3(0.8, 0.8, 0.8);
    }

    color *= mix(color, result, intensity);
}