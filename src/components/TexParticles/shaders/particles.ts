// @ts-ignore
import glsl from "glslify";

export const vert = glsl`
 varying vec2 vUv;
 
 void main() {
    vUv = uv;   
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
 }
`;

export const frag = glsl`
  precision highp float;
  
  uniform sampler2D particleTex;
  
  varying vec2 vUv;
  
  void main() {
    gl_FragColor = vec4(vUv.x);
    
    // account for fog
    // float depth = gl_FragCoord.z / gl_FragCoord.w;
    // float fogFactor = smoothstep( fogNear, fogFar, depth );
    // gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
  }
`;
