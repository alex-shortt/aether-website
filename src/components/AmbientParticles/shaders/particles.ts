// @ts-ignore
import glsl from "glslify";
import { useMemo } from "react";
import { ShaderMaterial, ShaderMaterialParameters } from "three";

const uniforms = () => ({ uniforms: { time: { value: 0 } } });

export const vert = glsl`
  precision highp float;
  
  uniform float time;
  
  varying vec3 vPos;
  varying float vSeed;
  varying vec2 vUv;
  attribute float seed;
  
  #define radiusNoiseFrequency 46.
  #define radiusVariationAmplitude 0.02
  #define radius 0.015
  
  #pragma glslify: snoise = require(glsl-noise-simplex/3d.glsl) 
  float fsnoise(float val1, float val2, float val3){
    return snoise(vec3(val1,val2,val3));
  }

  vec3 distortFunct(vec3 transformed, float factor) {
    float radiusVariation = -fsnoise(
      transformed.x * radiusNoiseFrequency + time,
      transformed.y * radiusNoiseFrequency + time,
      transformed.z * radiusNoiseFrequency + time 
    ) * radiusVariationAmplitude * factor;
    return normalize(transformed) * (radiusVariation + radius);
  }

  vec3 orthogonal(vec3 v) {
    return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
    : vec3(0.0, -v.z, v.y));
  }

  vec3 distortNormal(vec3 position, vec3 distortedPosition, vec3 normal){
    vec3 tangent1 = orthogonal(normal);
    vec3 tangent2 = normalize(cross(normal, tangent1));
    vec3 nearby1 = position + tangent1 * 0.1;
    vec3 nearby2 = position + tangent2 * 0.1;
    vec3 distorted1 = distortFunct(nearby1, 1.0);
    vec3 distorted2 = distortFunct(nearby2, 1.0);
    return normalize(cross(distorted1 - distortedPosition, distorted2 - distortedPosition));
  }
   
  void main() {
      float updateTime = time / 10.0;
      vec3 transformed = position.xyz;
      transformed = distortFunct(transformed, 1.0);
      vec3 distortedNormal = distortNormal(position, transformed, normal);
      vec3 vNormal = normal + distortedNormal;
      
      vec3 scroll = seed * 1000. * position.xyz;
      float offset = fsnoise(scroll.x + time * 0.4, scroll.y * time * 0.4, scroll.z + time * 0.4);
      
      vec3 pos = transformed * offset;
      float time_pos = time * .3 + seed * 0.5 + seed * 100.;
      pos.x += 0.025 * fsnoise(time_pos, time_pos, time_pos);
      pos.y += 0.3 * sin(time_pos);
      pos.z += 0.025 * fsnoise(time_pos, time_pos, time_pos);
      
      gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.);
      
      vPos = position.xyz;
      vSeed = seed;
      vUv = uv;
  }
`;

export const frag = glsl`
  precision highp float;
  varying vec3 vPos;
  varying float vSeed;
  varying vec2 vUv;
  
  #define fogNear 0.
  #define fogFar 20.
  #define fogColor vec3(0., 0., 0.)

  void main() {
    gl_FragColor.rgb = vec3(vUv.x, vUv.y, 1.);
    
    // account for fog
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = smoothstep( fogNear, fogFar, depth );
    gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
  }
`;

export const useParticleMaterial = (
  shaderParams?: Partial<ShaderMaterialParameters>
) =>
  useMemo(
    () =>
      new ShaderMaterial({
        ...uniforms(),
        vertexShader: vert,
        fragmentShader: frag,
        ...shaderParams,
      }),
    [frag, vert, uniforms]
  );
