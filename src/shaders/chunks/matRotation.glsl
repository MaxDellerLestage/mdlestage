
/*
    A collection of helper functions for transformations and displacement within the shaders.
*/

mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, 0.0, -s,
    0.0, 1.0, 0.0,
    s, 0.0, c
  );
}

mat3 rotation3dX(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    1.0, 0.0, 0.0,
    0.0, c, -s,
    0.0, s, c
  );
}

mat3 rotation3dZ(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, -s, 0.0,
    s, c, 0.0,
    0.0, 0.0, 1.0
  );
}

mat3 composeRotation(float tilt, float pitch, float yaw) {
  return rotation3dY(yaw) * rotation3dX(pitch) * rotation3dZ(tilt);
}

void applyRotation(
  inout vec4 pos,
  inout vec3 normal,
  float yaw, float pitch, float tilt,
  float yaw_speed, float pitch_speed, float tilt_speed,
  float time,
  vec3 center
) {

  vec3 localPos = pos.xyz - center;

  float new_tilt = pow(time, tilt_speed) * tilt;
  float new_pitch = pow(time, pitch_speed) * pitch;
  float new_yaw = pow(time, yaw_speed) * yaw;

  mat3 rotMat = composeRotation(new_tilt, new_pitch, new_yaw);

  pos.xyz = rotMat * localPos + center;

  normal = rotMat * normal;
}

void applyWaveAndRotation(
  inout vec4 pos,
  inout vec3 normal,
  float time,
  vec3 center,
  float amp, float freq, float speed,
  float startY, float endY, float falloff,
  float tilt, float pitch, float yaw,
  float tilt_speed, float pitch_speed, float yaw_speed,
  float bias_start, float bias_end, float power,
  inout float wave_displacement
) {
  vec3 init_pos = pos.xyz;
  float y_pos = pos.y;
  float mask = smoothstep(startY, startY + falloff, y_pos) * (1.0 - smoothstep(endY - falloff, endY, y_pos));

  float s = pow(smoothstep(bias_start, bias_end, y_pos), power);
  float bias = clamp(s, 0.0, 1.0);

  float x_disp = sin(y_pos * (PI * freq) + (time * speed + y_pos)) * amp * mask * bias;
  float z_disp = cos(y_pos * (PI * freq) + (time * speed + y_pos)) * amp * mask * bias;

  pos.x += x_disp;
  pos.z += z_disp;

  vec3 localPos = pos.xyz;
  wave_displacement += length(pos.xyz - localPos);
  mat3 rotMat = composeRotation(pow(time, tilt_speed)*tilt, pow(time, pitch_speed)*pitch, pow(time, yaw_speed)*yaw);
  pos.xyz = rotMat * localPos;

  normal = rotMat * normal;  
}

float doubleSigmoid(float x, float edge0, float edge1, float steepness) {
  float denom = max(edge1 - edge0, 1e-6);
  float t = clamp((x-edge0)/denom, 0.0, 1.0);
  float s1 = 1.0/(1.0 + exp(clamp(-steepness * (t - 0.5), -60.0, 60.0)));
  float s0 = 1.0/(1.0 + exp(clamp(-steepness * (-0.5), -60.0, 60.0)));
  float s2 = 1.0/(1.0 + exp(clamp(-steepness * (0.5), -60.0, 60.0)));
  return (s1-s0)/(s2-s0);
}

void applyCrater(
  inout vec4 pos,
  inout float displacement,
  float height, float depth,
  float craterRadius, float rimWidth, float outerFalloff,
  float innerPower, float outerPower,
  float craterPower, float rimPower,
  vec3 center,
  vec3 moonPos
) {
  vec3 posXYZ = pos.xyz;

  float r = distance(center, posXYZ);
  vec3 direction = vec3(0.0);
  if (length(center) > 1e-6) {
    direction = normalize(center);
  }

  float craterFactor = pow(clamp(1.0 - doubleSigmoid(r, 0.0, craterRadius, craterPower), 0.0, 1.0), innerPower);
  float crater = craterFactor * depth;
  float outerRim = craterRadius + rimWidth;
  float outerRadius = craterRadius + rimWidth + outerFalloff;

  float outerFactor = pow(clamp(1.0 - doubleSigmoid(r, craterRadius, outerRadius, rimPower), 0.0, 1.0), outerPower);
  float rim = abs(outerFactor * height);

  float craterDisp = (-crater + rim);

  pos.xyz += ( craterDisp * direction);

  displacement += craterDisp;
}