
uniform float uAOIntensity;
uniform float uAORange;


// This function fakes ambient occlusion based on displacement distance
float getAO(float displacement) {
    float ao = smoothstep(0.0, 1.0, displacement);
    ao = pow(ao, uAORange);
    return mix(ao, 1.0, uAOIntensity);
}
