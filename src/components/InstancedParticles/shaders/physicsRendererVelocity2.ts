// @ts-ignore
import glsl from "glslify";

export const frag = glsl`
    precision highp float;
    
    uniform sampler2D acceleration;
    uniform sampler2D velocity;
    uniform sampler2D velocityFirst;
    uniform sampler2D headVelocity;
    
    varying vec2 vUv;
    
    void main() {
      vec3 a = texture2D(acceleration, vUv).xyz;
      vec3 v = texture2D(velocity, vUv).xyz;
      vec3 vf = texture2D(velocityFirst, vUv).xyz;
      vec3 hv = texture2D(headVelocity, vUv).xyz;
    
      float init = clamp(step(500.0, hv.x), 0.0, 1.0);
      v = (a + v) * (1.0 - init) + vf * init;
    
      gl_FragColor = vec4(v, 1.0);
    }
`;

export const vert = glsl`
    precision highp float;

    uniform sampler2D acceleration;
    uniform sampler2D velocity;
    uniform sampler2D velocityFirst;
    uniform sampler2D headVelocity;
    
    varying vec2 vUv;
    
    void main(void) {
      vec3 a = texture2D(acceleration, vUv).xyz;
      vec3 v = texture2D(velocity, vUv).xyz;
      vec3 vf = texture2D(velocityFirst, vUv).xyz;
      vec3 hv = texture2D(headVelocity, vUv).xyz;
    
      float init = clamp(step(500.0, hv.x), 0.0, 1.0);
      v = (a + v) * (1.0 - init) + vf * init;
    
      gl_FragColor = vec4(v, 1.0);
    }
`;
