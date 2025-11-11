

precision highp float;

in vec2 vUv;
uniform float uCount;
uniform float uRadius;
uniform vec3 uCenter;
uniform float uTime;
uniform int uPass;
uniform sampler2D uPos;
uniform sampler2D uColor;
uniform sampler2D uSize;
uniform sampler2D uInitPos;
uniform vec3 uInitColor;
uniform vec3 uGradientOffset;
uniform float uGradient;
uniform float uGradientSize;
uniform float uDensity;
uniform float uMinSize;
uniform float uSaturation;
uniform float uColorMult;

uniform float uScale;
uniform float uValue;
uniform float uAmp;
uniform float uFreq;
uniform int uOctaves;
uniform float uGain;
uniform float uOffset;
uniform float uDisplacement;
uniform float uIncrement;

uniform float uLineLength;
uniform float uLineSpeed;

layout(location=1) out vec4 fboColor;
layout(location=2) out vec4 fboSize;

vec3 moveTowardZero(vec3 pos, float increment) {
    float len = length(pos);
    if (len <= increment) {
        return vec3(0.0);
    }
    return pos - normalize(pos)*increment;
}


void main() {
    vec3 pos = texture2D(uPos, vUv).rgb;
    vec3 color = texture(uColor, vUv).rgb;
    float point_size = texture(uSize, vUv).r;
    vec3 init_pos = texture2D(uInitPos, vUv).rgb;
    float part_id = texture(uPos, vUv).a;
    
    
        float count = uCount;

        float line_length = 30.0;
        
        float x1 = uCenter.x;
        float y1 = uCenter.y;
        float z1 = uCenter.z;

        float x = uCenter.x;
        float y = uCenter.y;
        float z = uCenter.z;

        x = uLineLength*sin(uTime*uLineSpeed)*part_id/count;

        vec3 npos = vec3(x,y,z);
        vec3 ninit_pos = vec3(x1,y1,z1);

        
        pc_fragColor = vec4(npos, 1.0);

    
        vec3 final_color = vec3 (1.0,1.0,1.0);
        fboColor = vec4(final_color, 1.0);
    
    
        float new_size = 4.0;
        
        fboSize = vec4(new_size, 1.0, 1.0, 1.0);
    
    
}