// @ts-ignore
import glsl from "glslify";

export const frag = glsl`
    precision highp float;
    
    varying vec2 vUv;
    varying vec3 vColor;
    varying float vOpacity;
    
    const float fogNear = 0.0;
    const float fogFar = 30.0;
    const vec3 fogColor = vec3(.0,.0,.0);
    
    #pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);
    
    void main() {
      float depth = gl_FragCoord.z / gl_FragCoord.w;
      float fogFactor = smoothstep( fogNear, fogFar, depth );
      vec2 p = vUv * 2.0 - 1.0;
      vec3 color = convertHsvToRgb(
        vColor +
        vec3(
          0.0,
          (1.0 - smoothstep(0.2, 0.6, length(p))) * -0.5,
          (1.0 - smoothstep(0.2, 0.6, length(p))) * 0.4
        )
      );
      float opacity = (1.0 - smoothstep(0.15, 0.8, length(p))) * vOpacity;
    
      if (opacity <= 0.01) discard;
    
      gl_FragColor = vec4(color, opacity);
      gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
    }
`;

export const vert = glsl`
    attribute vec3 position;
    attribute vec2 uv;
    attribute vec2 uvVelocity;
    
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec3 cameraPosition;
    uniform float time;
    uniform vec2 resolution;
    uniform float pixelRatio;
    uniform sampler2D acceleration;
    uniform sampler2D velocity;
    
    varying vec2 vUv;
    varying vec3 vColor;
    varying float vOpacity;
    
    #pragma glslify: calcTranslateMat4 = require(glsl-matrix/calcTranslateMat4);
    #pragma glslify: calcScaleMat4 = require(glsl-matrix/calcScaleMat4);
    
    struct Quaternion {
      float x;
      float y;
      float z;
      float w;
    };
    
    // https://qiita.com/aa_debdeb/items/c34a3088b2d8d3731813
    Quaternion axisAngle(vec3 axis, float radian) {
      vec3 naxis = normalize(axis);
      float h = 0.5 * radian;
      float s = sin(h);
      return Quaternion(naxis.x * s, naxis.y * s, naxis.z * s, cos(h));
    }
    
    Quaternion conjugate(Quaternion q) {
      return Quaternion(-q.x, -q.y, -q.z, q.w);
    }
    
    Quaternion mul(Quaternion q, float f) {
      return Quaternion(f * q.x, f * q.y, f * q.z, f * q.w);
    }
    
    Quaternion mul(Quaternion q1, Quaternion q2) {
      return Quaternion(
        q2.w * q1.x - q2.z * q1.y + q2.y * q1.z + q2.x * q1.w,
        q2.z * q1.x + q2.w * q1.y - q2.x * q1.z + q2.y * q1.w,
        -q2.y * q1.x + q2.x * q1.y + q2.w * q1.z + q2.z * q1.w,
        -q2.x * q1.x - q2.y * q1.y - q2.z * q1.z + q2.w * q1.w
      );
    }
    
    vec3 rotate(vec3 v, Quaternion q) {
      // norm of q must be 1.
      Quaternion vq = Quaternion(v.x, v.y, v.z, 0.0);
      Quaternion cq = conjugate(q);
      Quaternion mq = mul(mul(cq, vq), q);
      return vec3(mq.x, mq.y, mq.z);
    }
    
    void main() {
      vec3 a = texture2D(acceleration, uvVelocity).xyz;
      vec3 v = texture2D(velocity, uvVelocity).xyz;
      float alpha = texture2D(velocity, uvVelocity).w;
    
      // for rotation.
      vec3 top = vec3(0.0, 0.0, 1.0);
      vec3 dir = normalize(cameraPosition - v);
      vec3 axis = cross(top, dir);
      float angle = acos(dot(top, dir));
      Quaternion q = axisAngle(axis, angle);
      vec3 rotatedPosition = rotate(position, q);
      vec4 mvPosition = modelViewMatrix * calcTranslateMat4(v) * vec4(rotatedPosition, 1.0);
    
      vec3 top2 = vec3(0.0, 1.0, 0.0);
      vec3 dir2 = normalize(a);
      float angle2 = acos(dot(top2, dir2));
    
      vUv = uv;
      vColor = vec3(
        degrees(angle2) / 90.0,
        0.55,
        0.3
      );
      vOpacity = alpha;
    
      gl_Position = projectionMatrix * mvPosition;
    }
`;
