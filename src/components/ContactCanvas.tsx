'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 55;
const THRESH2 = 3.6 * 3.6;
const MAX_SEGS = COUNT * COUNT;

type SimulationState = {
  positions: Float32Array;
  velocities: Float32Array;
  lineBuffer: Float32Array;
};

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createSimulation(): SimulationState {
  const random = seededRandom(8341);
  const positions = new Float32Array(COUNT * 3);
  const velocities = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i += 1) {
    positions[i * 3] = (random() - 0.5) * 24;
    positions[i * 3 + 1] = (random() - 0.5) * 14;
    positions[i * 3 + 2] = (random() - 0.5) * 2;
    velocities[i * 3] = (random() - 0.5) * 0.006;
    velocities[i * 3 + 1] = (random() - 0.5) * 0.006;
  }

  return { positions, velocities, lineBuffer: new Float32Array(MAX_SEGS * 6) };
}

function Constellation() {
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const simulation = useMemo(() => createSimulation(), []);
  const velocitiesRef = useRef(simulation.velocities);
  const lineBufferRef = useRef(simulation.lineBuffer);

  useFrame(() => {
    const points = pointsRef.current;
    const lines = linesRef.current;
    if (!points || !lines) return;

    const velocities = velocitiesRef.current;
    const lineBuffer = lineBufferRef.current;
    const pos = points.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < COUNT; i += 1) {
      pos[i * 3] += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      if (Math.abs(pos[i * 3]) > 12) velocities[i * 3] *= -1;
      if (Math.abs(pos[i * 3 + 1]) > 7) velocities[i * 3 + 1] *= -1;
    }
    points.geometry.attributes.position.needsUpdate = true;

    let lineCount = 0;
    for (let i = 0; i < COUNT; i += 1) {
      for (let j = i + 1; j < COUNT; j += 1) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        if (dx * dx + dy * dy < THRESH2) {
          const offset = lineCount * 6;
          lineBuffer[offset] = pos[i * 3];
          lineBuffer[offset + 1] = pos[i * 3 + 1];
          lineBuffer[offset + 2] = pos[i * 3 + 2];
          lineBuffer[offset + 3] = pos[j * 3];
          lineBuffer[offset + 4] = pos[j * 3 + 1];
          lineBuffer[offset + 5] = pos[j * 3 + 2];
          lineCount += 1;
        }
      }
    }

    const linePosition = lines.geometry.attributes.position;
    (linePosition.array as Float32Array).set(lineBuffer);
    linePosition.needsUpdate = true;
    lines.geometry.setDrawRange(0, lineCount * 2);
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[simulation.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="white" size={0.055} transparent opacity={0.16} sizeAttenuation depthWrite={false} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[simulation.lineBuffer, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="white" transparent opacity={0.045} />
      </lineSegments>
    </>
  );
}

export function ContactCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      dpr={[1, 1]}
      frameloop="always"
    >
      <Constellation />
    </Canvas>
  );
}
