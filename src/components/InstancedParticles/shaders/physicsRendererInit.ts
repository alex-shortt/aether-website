// @ts-ignore
import glsl from "glslify";

export const frag = glsl`
    precision highp float;
    
    uniform sampler2D initData;
    
    varying vec2 vUv;
    
    void main() {
      gl_FragColor = texture2D(initData, vUv);
    }
`;
