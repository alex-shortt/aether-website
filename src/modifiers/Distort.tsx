import * as THREE from "three";
import { DoubleSide, Group, Material, MathUtils, Mesh, Object3D } from "three";
// @ts-ignore
import glsl from "glslify";
import { ReactNode, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useLimiter } from "spacesvr";

const uniforms = `
    uniform float time;
    uniform float intensity;
    uniform float fade;
    
    varying vec3 vPos;
    varying vec2 vUv;
`;

const vert = glsl`
    #include <begin_vertex>
    float theta = sin( time + position.y / 255.0 * 3.14 * 2.0 / 4.0 ) / 3.0;
    gl_Position.x += sin(time  * 0.9);
    vPos = gl_Position.xyz;
    vUv = uv;
`;

const fragHeader = glsl`
  // fbm from https://www.shadertoy.com/view/lss3zr
  mat3 m = mat3( 0.00,  0.80,  0.60,
                -0.80,  0.36, -0.48,
                -0.60, -0.48,  0.64 );
  float hash( float n ) { 
      return fract(sin(n)*43758.5453); 
  }
  
  float noise( in vec3 x ) {
      vec3 p = floor(x);
      vec3 f = fract(x);
      f = f*f*(3.0-2.0*f);
      float n = p.x + p.y*57.0 + 113.0*p.z;
      float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                          mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                      mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                          mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
      return res;
  }
  
  float fbm( vec3 p ) {
      float f;
      f  = 0.5000*noise( p ); p = m*p*2.02;
      f += 0.2500*noise( p ); p = m*p*2.03;
      f += 0.12500*noise( p ); p = m*p*2.01;
      f += 0.06250*noise( p );
      return f;
  }
`;

const frag = glsl`
  float x_mod = 0.5 * vUv.x + 0.25;
  float fade_mod = clamp( abs(fade * 3. - 1. - x_mod) / 0.5 - 0.5, 0., 1.);
  float a = pow( fbm(vec3(vUv.x * 40., vUv.y * 10., time + 0.9)), 1.9 + 0.4 * sin(time * 0.25));
  
  a *= 2.6;
  a = clamp(a, 0., 1.);
  
  if ( a <= intensity * fade_mod ) discard;
  
  vec3 diff = mix( vec3(1.2, 0.05, 0.), vec3(1., 0.9, .1), 0.1 + a * 0.9);
  diff *= 1.3;
  
  vec4 diffuseColor = vec4( diff, a );
`;

type Props = {
  children: ReactNode;
  fade: number;
};

const Distort = (props: Props) => {
  const { children, fade } = props;

  const group = useRef<Group>();
  const limiter = useLimiter(50);

  const distortMat = useMemo<Material>(() => {
    const material = new THREE.MeshStandardMaterial();

    material.onBeforeCompile = function (shader) {
      shader.uniforms.time = { value: 0 };
      shader.uniforms.intensity = { value: 1 };
      shader.uniforms.fade = { value: 0 };
      shader.vertexShader = uniforms + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        vert
      );

      shader.fragmentShader =
        uniforms +
        fragHeader +
        shader.fragmentShader.replace(
          "vec4 diffuseColor = vec4( diffuse, opacity );",
          frag
        );

      material.userData.shader = shader;
    };

    material.side = DoubleSide;

    return material;
  }, [frag, vert]);

  useLayoutEffect(() => {
    if (group.current) {
      group.current.traverse((child: Object3D) => {
        if ((child as Mesh).material) {
          (child as Mesh).material = distortMat;
        }
      });
    }
  }, [distortMat]);

  useFrame(({ clock }) => {
    if (!limiter.isReady(clock)) return;

    if (distortMat.userData.shader) {
      const uniforms = distortMat.userData.shader.uniforms;
      uniforms.time.value = clock.getElapsedTime() * 1.5;
      uniforms.fade.value = MathUtils.lerp(uniforms.fade.value, fade, 0.01);
    }
  });

  return <group ref={group}>{children}</group>;
};

export default Distort;
