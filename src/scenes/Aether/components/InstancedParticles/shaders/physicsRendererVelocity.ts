// @ts-ignore
import glsl from "glslify";

export const frag = glsl`
    precision highp float;
    
    uniform float time;
    uniform sampler2D acceleration;
    uniform sampler2D velocity;
    uniform sampler2D velocityFirst;
    uniform sampler2D delay;
    
    varying vec2 vUv;
    
    void main() {
      vec3 a = texture2D(acceleration, vUv).xyz;
      vec3 v = texture2D(velocity, vUv).xyz;
      vec3 vf = texture2D(velocityFirst, vUv).xyz;
      float dl = texture2D(delay, vUv).x;
    
      float init = clamp(step(500.0, v.x), 0.0, 1.0);
      v = (a * step(dl, time) + v) * (1.0 - init) + vf * init;
    
      float alpha = 1.0 - smoothstep(450.0, 500.0, abs(v.x));
    
      gl_FragColor = vec4(v, alpha);
    }
`;

export const vert = glsl`
    attribute vec3 position;
    attribute vec2 uv;
    
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    
    varying vec2 vUv;
    
    void main(void) {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
