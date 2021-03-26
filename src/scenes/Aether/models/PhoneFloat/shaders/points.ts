// @ts-ignore
import glsl from "glslify";

export const vert = glsl`
    attribute float alpha;
    varying float vAlpha;
    uniform float time;
    varying vec4 vColor;
    
   #pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
   
    void main() {
      vColor = vec4(color, 1.0);
      vAlpha = alpha;
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_PointSize = 2.0;
      gl_Position = projectionMatrix * mvPosition;
      gl_Position.x += 0.1 * snoise2(vec2(position.x * 10., time * 0.08));
      gl_Position.y += 0.15 * snoise2(vec2(position.y * 10., time * 0.06));
      gl_Position.z += 0.12 * snoise2(vec2(position.z * 10., time * 0.05));
    }
`;

export const frag = glsl`
    #define FOG_NEAR 0.
    #define FOG_FAR 30.
    #define FOG_COLOR vec3(0.0,0.0,0.0)

    varying float vAlpha;
    varying vec4 vColor;

    void main() {
      float depth = gl_FragCoord.z / gl_FragCoord.w;
      float fogFactor = smoothstep( FOG_NEAR, FOG_FAR, depth );
      gl_FragColor = vec4( vColor.rgb, vAlpha );
      // gl_FragColor.rgb = mix( vColor.rgb, gl_FragColor.rgb, 0.5);
      gl_FragColor.rgb = mix( gl_FragColor.rgb, FOG_COLOR, fogFactor );
    }
`;
