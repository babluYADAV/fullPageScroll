// components/StarsEffect.jsx
import { PointMaterial, Points } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const NUM_STARS = 3500;
const INITIAL_SPREAD = 600; // Ensures full-screen coverage
const FINAL_RADIUS = 100; // Large sphere
const TRANSITION_DURATION = 4000;

const StarsEffect = ({ triggerAnimation }) => {
  const pointsRef = useRef(null);
  const [positions, setPositions] = useState(null);

  useEffect(() => {
    if (!triggerAnimation) return;

    const startTime = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / TRANSITION_DURATION, 1);
      const t = 0.5 - 0.5 * Math.cos(progress * Math.PI); // easeInOutSine

      const newPositions = new Float32Array(NUM_STARS * 3);
      for (let i = 0; i < NUM_STARS; i += 1) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = INITIAL_SPREAD * (1 - t) + FINAL_RADIUS;
        newPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        newPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        newPositions[i * 3 + 2] = radius * Math.cos(phi);
      }

      setPositions(newPositions);

      if (t < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [triggerAnimation]);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0015;
      pointsRef.current.rotation.x += 0.0003;
    }
  });

  if (!positions) return null;

  return (
    <Points ref={pointsRef} positions={positions} frustumCulled>
      <PointMaterial
        size={0.75}
        sizeAttenuation
        depthWrite={false}
        color="white"
      />
    </Points>
  );
};

export default StarsEffect;
