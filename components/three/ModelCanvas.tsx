"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function ModelCanvas({ url, name }: { url: string; name: string }) {
  return (
    <div className="aspect-square w-full">
      <Canvas
        shadows
        dpr={[1, 1.7]}
        camera={{ position: [0, 1, 5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        aria-label={`Interactive 3D model of ${name}`}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 6, 4]} intensity={2.2} castShadow />
        <directionalLight position={[-4, 2, -3]} intensity={0.7} color="#ffd6b0" />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <Model url={url} />
            </Center>
          </Bounds>
        </Suspense>
        <ContactShadows position={[0, -1.2, 0]} opacity={0.45} scale={7} blur={2.4} far={3} />
        <OrbitControls makeDefault enablePan={false} minDistance={2.3} maxDistance={7} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}
