import React, { useMemo, useRef } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Connection({
  edge,
  selectedNodeId,
  focusedNodeId,
  isHighlighted,
  isFilteredOut,
}) {
  const pulseSphereRef = useRef();

  const isDirectlyConnected =
    edge.fromId === selectedNodeId ||
    edge.toId === selectedNodeId ||
    edge.fromId === focusedNodeId ||
    edge.toId === focusedNodeId;

  // Memoize vectors for high-efficiency interpolation
  const fromVec = useMemo(() => new THREE.Vector3(...edge.from), [edge.from]);
  const toVec = useMemo(() => new THREE.Vector3(...edge.to), [edge.to]);

  // Color & styling based on visual hierarchy
  const { color, opacity, lineWidth, showEnergyPulse } = useMemo(() => {
    if (isFilteredOut) {
      return {
        color: '#1e293b',
        opacity: 0.05,
        lineWidth: 0.6,
        showEnergyPulse: false,
      };
    }

    if (isDirectlyConnected || isHighlighted) {
      const activeColor = edge.fromNode?.color || edge.toNode?.color || '#38bdf8';
      return {
        color: activeColor,
        opacity: 0.9,
        lineWidth: 2.0,
        showEnergyPulse: true,
      };
    }

    // Default quiet background connection
    return {
      color: '#334155',
      opacity: 0.2,
      lineWidth: 0.8,
      showEnergyPulse: false,
    };
  }, [isDirectlyConnected, isHighlighted, isFilteredOut, edge]);

  // Smooth energy packet traveling along active connections
  useFrame((state) => {
    if (!showEnergyPulse || !pulseSphereRef.current) return;
    // Ping-pong or continuous loop along the connection vector
    const speed = 0.85;
    const progress = (state.clock.elapsedTime * speed) % 1;
    pulseSphereRef.current.position.lerpVectors(fromVec, toVec, progress);
  });

  return (
    <group>
      {/* Precision Core Line */}
      <Line
        points={[edge.from, edge.to]}
        color={color}
        lineWidth={lineWidth}
        transparent
        opacity={opacity}
      />

      {/* Subtle Glow Under-Line for Active Connections */}
      {showEnergyPulse && (
        <Line
          points={[edge.from, edge.to]}
          color={color}
          lineWidth={lineWidth * 2.2}
          transparent
          opacity={0.3}
        />
      )}

      {/* Tiny Animated Energy Packet along Active Path */}
      {showEnergyPulse && (
        <mesh ref={pulseSphereRef}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.95}
          />
        </mesh>
      )}
    </group>
  );
}
