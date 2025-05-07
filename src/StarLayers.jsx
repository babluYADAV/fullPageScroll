import { PointMaterial, Points } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const STAR_LAYERS = [
  { count: 100, size: 0.09, opacity: 0.65 },
  { count: 25, size: 0.2, opacity: 1 },
];

function StarLayer({ position, count, size, opacity, heightFraction }) {
  const ref = useRef(null);
  const { viewport } = useThree();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const canvasHeight = viewport.height * heightFraction;

    for (let i = 0; i < count; i++) {
      const x = -viewport.width / 2 + Math.random() * viewport.width;
      const yMid =
        position === "top"
          ? viewport.height / 2 - canvasHeight / 2
          : -viewport.height / 2 + canvasHeight / 2;
      const y = yMid + (Math.random() - 0.5) * canvasHeight;
      const z = Math.random() * 2 - 1;
      arr.set([x, y, z], i * 3);
    }
    return arr;
  }, [viewport, position, count, heightFraction]);

  useFrame(() => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const index = i * 3;
      arr[index] += 0.025;
      if (arr[index] > viewport.width / 2) {
        arr[index] = -viewport.width / 2;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} frustumCulled={false}>
      <PointMaterial
        transparent
        color={`rgba(255,255,255,${opacity})`}
        size={size}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

export default function StarsLayer({ position }) {
  const isMobile = window.innerWidth <= 768;
  const canvasHeightVh = isMobile ? 40 : 45;

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      style={{
        position: "fixed",
        [position]: 0,
        width: "100vw",
        height: `${canvasHeightVh}vh`,
        pointerEvents: "none",
      }}
    >
      <ambientLight />
      {STAR_LAYERS.map((layer, idx) => (
        <StarLayer
          key={idx}
          position={position}
          {...layer}
          heightFraction={canvasHeightVh / 100}
        />
      ))}
    </Canvas>
  );
}
