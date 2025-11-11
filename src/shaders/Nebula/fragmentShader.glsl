
precision highp float;

in vec3 vColor;

uniform float uFade;
uniform float uAlpha;

void main() {
    
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 -strength;
    strength = pow(strength, uFade);

    vec3 color = mix(vec3(0.0), vColor, strength);

    gl_FragColor = vec4(color, strength*uAlpha);
}