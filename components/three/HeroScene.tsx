"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";

// Shell profile (radius, height) ordered bottom to top.
const SHELL_PROFILE: [number, number][] = [
  [1.0, 0.62],
  [1.02, 0.66],
  [1.0, 0.76],
  [0.96, 0.94],
  [0.89, 1.16],
  [0.78, 1.38],
  [0.63, 1.58],
  [0.44, 1.74],
  [0.22, 1.845],
  [0, 1.88],
];

function Helmet() {
  const shell = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#F3F4EF",
        roughness: 0.14,
        metalness: 0.02,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.15,
      }),
    []
  );
  const trim = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#24282C",
        metalness: 0.35,
        roughness: 0.45,
      }),
    []
  );
  const inner = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#14171A",
        metalness: 0.05,
        roughness: 0.85,
        side: THREE.DoubleSide,
      }),
    []
  );

  const shellGeometry = useMemo(
    () =>
      new THREE.LatheGeometry(
        SHELL_PROFILE.map(([radius, height]) => new THREE.Vector2(radius, height)),
        128
      ),
    []
  );

  // Broad brim with an extended front peak.
  const brimGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const hole = new THREE.Path();
    const segments = 180;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const peak = Math.pow(Math.max(0, -Math.sin(angle)), 2);
      const radius = 1.13 + 0.3 * peak;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }

    for (let i = segments; i >= 0; i--) {
      const angle = (i / segments) * Math.PI * 2;
      const peak = Math.pow(Math.max(0, -Math.sin(angle)), 2);
      const radius = 0.92 + 0.12 * peak;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === segments) hole.moveTo(x, y);
      else hole.lineTo(x, y);
    }

    shape.holes.push(hole);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.038,
      bevelEnabled: true,
      bevelThickness: 0.014,
      bevelSize: 0.014,
      bevelSegments: 4,
      curveSegments: 96,
    });
  }, []);

  return (
    <group position={[0, -1.2, 0]} rotation={[0, -0.3, 0]}>
      <mesh
        geometry={shellGeometry}
        material={shell}
        castShadow
        receiveShadow
      />

      <mesh
        geometry={brimGeometry}
        material={shell}
        position={[0, 0.6, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      />

      {/* Dark underside so the shell never looks hollow from below. */}
      <mesh position={[0, 0.585, 0]} rotation={[-Math.PI / 2, 0, 0]} material={inner}>
        <circleGeometry args={[1.13, 64]} />
      </mesh>

      {/* Side accessory slots */}
      {[-1, 1].map((side) => {
        const x = side * 0.8;
        const z = 0.55;
        return (
          <group
            key={side}
            position={[x, 0.78, z]}
            rotation={[0, Math.atan2(x, z), 0]}
          >
            <RoundedBox
              args={[0.26, 0.1, 0.16]}
              radius={0.02}
              material={shell}
              castShadow
            />
            <mesh position={[0, 0.005, 0]} material={trim}>
              <boxGeometry args={[0.14, 0.14, 0.06]} />
            </mesh>
          </group>
        );
      })}

      {/* Rear ratchet adjustment */}
      <group position={[0, 0.74, -0.98]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh material={shell} castShadow>
          <cylinderGeometry args={[0.16, 0.2, 0.12, 32]} />
        </mesh>
        <mesh position={[0, 0.07, 0]} material={trim}>
          <cylinderGeometry args={[0.11, 0.11, 0.05, 24]} />
        </mesh>
      </group>

    </group>
  );
}

function Particles({ count = 80 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.6 + Math.random() * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = 0.4 + Math.abs(radius * Math.cos(phi)) * 0.9;
      array[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return array;
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.025;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#FFB020"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function SceneContent({ reducedMotion, lowPower }: { reducedMotion: boolean; lowPower: boolean }) {
  const rig = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!rig.current || reducedMotion) return;
    const scroll =
      typeof window === "undefined"
        ? 0
        : Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    const targetY = state.pointer.x * 0.22 + scroll * 0.35;
    const targetX = -state.pointer.y * 0.07 + scroll * 0.08;
    rig.current.rotation.y = THREE.MathUtils.damp(
      rig.current.rotation.y,
      targetY,
      2.4,
      delta
    );
    rig.current.rotation.x = THREE.MathUtils.damp(
      rig.current.rotation.x,
      targetX,
      2.4,
      delta
    );
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4.5, 7, 5]}
        intensity={2.2}
        castShadow={!lowPower}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-5, 3, -4]} intensity={0.9} color="#a9c6e4" />
      <pointLight position={[-4, 1.5, -2]} intensity={9} color="#FF5A1F" distance={9} />
      <pointLight position={[3, 2.5, 3]} intensity={8} color="#FFE8CE" distance={8} />

      {/* Local studio environment — crisp reflections without a CDN fetch. */}
      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={4}
          position={[0, 5, -8]}
          scale={[14, 8, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={3}
          position={[-6, 3, 2]}
          rotation-y={Math.PI / 2}
          scale={[8, 8, 1]}
          color="#cfe0ff"
        />
        <Lightformer
          form="rect"
          intensity={2.5}
          position={[6, 2, 1]}
          rotation-y={-Math.PI / 2}
          scale={[8, 8, 1]}
          color="#ffd7b0"
        />
        <Lightformer
          form="circle"
          intensity={5}
          position={[0, 7, 2]}
          scale={[5, 5, 1]}
          color="#fff6e8"
        />
      </Environment>

      <group ref={rig}>
        <Float speed={reducedMotion ? 0 : 1.05} rotationIntensity={0.08} floatIntensity={0.22}>
          <Helmet />
        </Float>
        {!lowPower ? <Particles count={70} /> : <Particles count={26} />}
      </group>

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.35}
        scale={7}
        blur={3}
        far={3}
        color="#000000"
        frames={lowPower ? 1 : Infinity}
      />
    </>
  );
}

export default function HeroScene({
  reducedMotion = false,
  lowPower = false,
}: {
  reducedMotion?: boolean;
  lowPower?: boolean;
}) {
  return (
    <Canvas
      shadows={!lowPower}
      dpr={lowPower ? [1, 1.3] : [1, 1.8]}
      camera={{ position: [0, 0.35, 4.9], fov: 34 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      frameloop={reducedMotion ? "demand" : "always"}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      aria-label="Interactive 3D safety helmet"
    >
      <Suspense fallback={null}>
        <SceneContent reducedMotion={reducedMotion} lowPower={lowPower} />
      </Suspense>
    </Canvas>
  );
}
