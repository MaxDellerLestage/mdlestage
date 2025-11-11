in vec3 vColor;
uniform float uFade;
uniform float uAlpha;

void main() {

    vec3 color = vColor;

    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;

    strength = pow(strength, uFade);

    color = mix(vec3(0.0), color, strength);
    
    gl_FragColor = vec4(color, strength);
}