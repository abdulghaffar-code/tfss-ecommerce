"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function Helmet() {
  const shell = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#FFB020",
      metalness: 0.4,
      roughness: 0.28,
    }),
    []
  );
  const dark = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#15191C",
      metalness: 0.75,
      roughness: 0.32,
    }),
    []
  );
  const accent = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#FF5A1F",
      emissive: "#8a2506",
      emissiveIntensity: 0.35,
      metalness: 0.4,
      roughness: 0.3,
    }),
    []
  );

  return (
    <group position={[0, -0.05, 0]} rotation={[0, -0.55, 0]}>
      {/* dome */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0.62, 0]}
        scale={[1.06, 0.82, 1.14]}
        material={shell}
      >
        <sphereGeometry args={[1, 64, 36, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* brim */}
      <mesh castShadow position={[0, 0.6, 0.04]} scale={[1.2, 1, 1.28]} material={shell}>
        <cylinderGeometry args={[1.0, 1.02, 0.075, 64]} />
      </mesh>
      <mesh position={[0, 0.558, 0.04]} scale={[1.2, 1, 1.28]} material={dark}>
        <cylinderGeometry args={[1.0, 1.0, 0.025, 64]} />
      </mesh>

      {/* crown ridges */}
      <RoundedBox args={[0.15, 0.07, 1.5]} radius={0.03} position={[0, 1.41, 0]} material={shell} castShadow />
      <RoundedBox args={[0.13, 0.06, 1.24]} radius={0.03} position={[0.32, 1.33, 0]} rotation={[0, 0, -0.12]} material={shell} castShadow />
      <RoundedBox args={[0.13, 0.06, 1.24]} radius={0.03} position={[-0.32, 1.33, 0]} rotation={[0, 0, 0.12]} material={shell} castShadow />

      {/* side vents */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.86, 0.74, -0.18]}>
          <mesh rotation={[0, 0, side * 0.35]} material={dark}>
            <boxGeometry args={[0.16, 0.04, 0.42]} />
          </mesh>
          <mesh
            position={[0, 0.11, 0]}
            rotation={[0, 0, side * 0.35]}
            material={accent}
          >
            <boxGeometry args={[0.1, 0.03, 0.34]} />
          </mesh>
        </group>
      ))}

      {/* front visor shadow line */}
      <mesh position={[0, 0.66, 1.045]} rotation={[0.06, 0, 0]} material={dark}>
        <boxGeometry args={[0.92, 0.055, 0.04]} />
      </mesh>

      {/* rear ratchet */}
      <mesh position={[0, 0.63, -1.05]} rotation={[Math.PI / 2, 0, 0]} material={dark}>
        <cylinderGeometry args={[0.18, 0.18, 0.13, 24]} />
      </mesh>
      <mesh position={[0, 0.63, -1.12]} rotation={[Math.PI / 2, 0, 0]} material={accent}>
        <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
      </mesh>

      {/* chin strap */}
      <mesh position={[0, 0.12, 0.22]} rotation={[Math.PI / 2.15, 0, 0]} material={dark}>
        <torusGeometry args={[0.64, 0.022, 8, 48, Math.PI]} />
      </mesh>

      {/* light bar */}
      <mesh position={[0, 0.95, 1.03]} material={accent}>
        <boxGeometry args={[0.36, 0.045, 0.04]} />
      </mesh>
    </group>
  );
}

function OrbitRings() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.z += delta * 0.08;
    group.current.rotation.x =
      0.42 + Math.sin(state.clock.elapsedTime * 0.22) * 0.06;
  });

  return (
    <group ref={group} position={[0, 0.45, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.35, 0.006, 8, 160]} />
        <meshBasicMaterial color="#FF7A45" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2.3, 0.4, 0.2]}>
        <torusGeometry args={[2.8, 0.004, 8, 160]} />
        <meshBasicMaterial color="#9AA3AB" transparent opacity={0.22} />
      </mesh>
      <mesh rotation={[Math.PI / 1.8, -0.3, 0]}>
        <torusGeometry args={[3.15, 0.003, 8, 140]} />
        <meshBasicMaterial color="#FFB020" transparent opacity={0.12} />
      </mesh>
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
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[4.5, 7, 5]}
        intensity={2.4}
        castShadow={!lowPower}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-5, 3, -4]} intensity={1.1} color="#8fb7d6" />
      <pointLight position={[-4, 1.5, -2]} intensity={22} color="#FF5A1F" distance={9} />
      <pointLight position={[3, 2.5, 3]} intensity={10} color="#FFD9A8" distance={8} />

      <group ref={rig}>
        <Float speed={reducedMotion ? 0 : 1.05} rotationIntensity={0.08} floatIntensity={0.22}>
          <Helmet />
        </Float>
        {!lowPower ? <OrbitRings /> : null}
        {!lowPower ? <Particles count={70} /> : <Particles count={26} />}
      </group>

      {/* pedestal */}
      <mesh position={[0, -1.1, 0]} receiveShadow>
        <cylinderGeometry args={[1.95, 2.05, 0.1, 64]} />
        <meshStandardMaterial color="#15181B" metalness={0.8} roughness={0.35} />
      </mesh>
      <mesh position={[0, -1.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 1.72, 96]} />
        <meshBasicMaterial color="#FF5A1F" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>

      <ContactShadows
        position={[0, -1.04, 0]}
        opacity={0.55}
        scale={8}
        blur={2.4}
        far={4}
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
      camera={{ position: [0, 1.15, 6.1], fov: 38 }}
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
