
precision highp float;

uniform sampler2D uPositionTex;
uniform sampler2D uColorTex;
uniform sampler2D uSizeTex;

out vec3 vColor;

void main() {
    ivec2 coord = ivec2(position.xy);

    vec3 pos = texture2D(uPositionTex, position.xy).xyz;
    float point_size = texture2D(uSizeTex, position.xy).x;
    vColor = texture2D(uColorTex, position.xy).rgb;

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    gl_PointSize = point_size;
}