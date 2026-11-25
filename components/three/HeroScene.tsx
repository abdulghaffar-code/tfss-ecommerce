"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";

const CARD_SIZE = 3.12;
const IMAGE_SIZE = 2.88;

function ShowcaseCard({
  src,
  reducedMotion,
}: {
  src: string | null;
  reducedMotion: boolean;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const group = useRef<THREE.Group>(null);
  const reveal = useRef(1);

  const frame = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#0E1114",
        metalness: 0.65,
        roughness: 0.35,
        clearcoat: 0.6,
        clearcoatRoughness: 0.4,
        envMapIntensity: 0.9,
      }),
    []
  );
  const image = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        roughness: 0.38,
        metalness: 0.02,
        clearcoat: 0.4,
        clearcoatRoughness: 0.4,
      }),
    []
  );

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(src, (loaded) => {
      if (cancelled) {
        loaded.dispose();
        return;
      }
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.anisotropy = 8;
      setTexture(loaded);
      reveal.current = reducedMotion ? 1 : 0;
      image.map = loaded;
      image.needsUpdate = true;
    });
    return () => {
      cancelled = true;
    };
  }, [src, reducedMotion, image]);

  useEffect(
    () => () => {
      texture?.dispose();
    },
    [texture]
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    if (!reducedMotion) {
      reveal.current = THREE.MathUtils.damp(reveal.current, 1, 6.5, delta);
    }
    const t = reducedMotion ? 1 : reveal.current;
    group.current.rotation.y = -0.16 + (1 - t) * -0.5;
    group.current.scale.setScalar(0.94 + 0.06 * t);
  });

  return (
    <group ref={group}>
      <RoundedBox
        args={[CARD_SIZE, CARD_SIZE, 0.1]}
        radius={0.1}
        smoothness={6}
        material={frame}
        castShadow
      />
      <mesh position={[0, 0, 0.06]} material={image}>
        <planeGeometry args={[IMAGE_SIZE, IMAGE_SIZE]} />
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

function SceneContent({
  imageSrc,
  reducedMotion,
  lowPower,
}: {
  imageSrc: string | null;
  reducedMotion: boolean;
  lowPower: boolean;
}) {
  const rig = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!rig.current || reducedMotion) return;
    const scroll =
      typeof window === "undefined"
        ? 0
        : Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    const targetY = state.pointer.x * 0.2 + scroll * 0.3;
    const targetX = -state.pointer.y * 0.06 + scroll * 0.06;
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
      <ambientLight intensity={0.6} />
      <directionalLight position={[4.5, 7, 5]} intensity={1.6} />
      <directionalLight position={[-5, 3, -4]} intensity={0.8} color="#a9c6e4" />
      <pointLight position={[-4, 1.5, -2]} intensity={8} color="#FF5A1F" distance={9} />
      <pointLight position={[3, 2.5, 3]} intensity={6} color="#FFE8CE" distance={8} />

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
      </Environment>

      <group ref={rig}>
        <Float
          speed={reducedMotion ? 0 : 0.9}
          rotationIntensity={0.05}
          floatIntensity={0.14}
        >
          <ShowcaseCard src={imageSrc} reducedMotion={reducedMotion} />
        </Float>
        {!lowPower ? <Particles count={70} /> : <Particles count={26} />}
      </group>
    </>
  );
}

export default function HeroScene({
  imageSrc = null,
  reducedMotion = false,
  lowPower = false,
}: {
  imageSrc?: string | null;
  reducedMotion?: boolean;
  lowPower?: boolean;
}) {
  return (
    <Canvas
      shadows={!lowPower}
      dpr={lowPower ? [1, 1.3] : [1, 1.8]}
      camera={{ position: [0, 0.1, 6.6], fov: 34 }}
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
      aria-label="Interactive 3D product showcase"
    >
      <Suspense fallback={null}>
        <SceneContent
          imageSrc={imageSrc}
          reducedMotion={reducedMotion}
          lowPower={lowPower}
        />
      </Suspense>
    </Canvas>
  );
}
