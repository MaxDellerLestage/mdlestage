

precision highp float;

in vec2 vUv;
uniform float uCount;
uniform float uRadius;
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
        /* float dist = sqrt(pow(rand(pos.z, 0, 2.0), 1.5)) * uRadius;
        float theta_2 = rand(pos.x, 1, 1.0)*180.0;
        float phi = rand(pos.y, 1, 3.0)*180.0; */
        float strength = 1.0;

        float rad = 1.0;
        float theta = part_id*((PI*16.0)/count);
        float a = 20.0*(sin(uTime*0.01));
        float n = 100.0;
        float r = rad+a*sin(n*theta);
        float speed = 0.001;

        float x = r * cos(theta)*(mod(part_id*(uTime*speed),count));
        float y = r*sin(theta)*(mod(part_id*(uTime*speed),count));
        float z = cos(n*theta)*(mod(part_id*(uTime*speed),count));

        float x1 = rad*cos(theta)*(part_id/count);
        float y1 = rad*sin(theta)*(part_id/count);
        float z1 = 0.0;
        z1 += pow(((part_id/count)*3.0*rad), strength);

        z += z1;
        y += (sin(z*0.02)*12.0)*(part_id/count)*2.0;
        x += (sin(z*0.04)*12.0)*(part_id/count)*2.0;



        /* x += (dist * sin(theta_2) * cos(phi));
        y += (dist * sin(theta_2) * sin(phi));
        z += (dist * cos(theta_2) * 2.0); */

        vec3 npos = vec3(x,y,z);
        vec3 ninit_pos = vec3(x1,y1,z1);

        float noise = fbm(npos*uScale, uValue, uAmp, uFreq, uOctaves, uGain, uOffset);
        vec3 dir_vector = normalize(npos-ninit_pos);
        vec3 new_pos = mix(npos, npos+(dir_vector*noise), uDisplacement);
        vec3 newt_pos = moveTowardZero(new_pos, uIncrement);
        pc_fragColor = vec4(newt_pos, 1.0);

    
        float distance_mult = distance(pos, init_pos);
        float distanceColor = abs(pow(distance_mult, uGradient));
        vec3 final_color = mix(uInitColor, color, distanceColor*uColorMult)/uSaturation;
        //vec3 final_color = vec3(1.0,1.0,1.0);
        fboColor = vec4(final_color, 1.0);
    
    
        float distance_multz = distance(pos, vec3(0.0) + uGradientOffset);
        float distanceSize = abs(pow(distance_multz, uGradientSize));
        float new_size = mix(point_size, uMinSize, distanceSize*uDensity);
        
        fboSize = vec4(new_size, 1.0, 1.0, 1.0);
    
    
}