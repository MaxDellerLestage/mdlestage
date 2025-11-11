

// Custom random number generators.

float rand(float x, int signedFlag, float seed) {
    float r = fract(sin(x + float(seed)) * 564738.2234561123);
    return mix(r, r * 2.0 - 1.0, float(signedFlag));
}

vec3 randColor(float var, vec3 min, vec3 max, float seed) {
    return mix(min, max, vec3(rand(var, 0, seed), rand(var + 1.0, 0, seed), rand(var + 2.0, 0, seed)));
}