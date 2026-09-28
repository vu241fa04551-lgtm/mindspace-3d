import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export default function KnowledgeNode({
  node,
  isSelected,
  isFocused,
  isExplored,
  isRelatedToSelected,
  isFilteredOut,
  onSelectNode,
}) {
  const groupRef = useRef();
  const meshRef = useRef();
  const ringRef = useRef();
  const rootRingRef = useRef();
  const pulseRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Clean up pointer cursor if component unmounts while hovered
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default';
    };
  }, []);

  // Check if this is the central root concept of the galaxy
  const isRootNode = Boolean(node.id.endsWith('-root') || node.size >= 1.5);

  // Deterministic float phase offset based on node id
  const floatOffset = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < node.id.length; i++) {
      hash = (hash + node.id.charCodeAt(i)) % 100;
    }
    return hash * 0.1;
  }, [node.id]);

  // Smooth hover, focus, floating, and filtering animation
  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return;

    // Gentle organic floating oscillation
    const floatSpeed = isRootNode ? 0.7 : 1.1;
    const floatAmount = isRootNode ? 0.04 : 0.07;
    const floatY = Math.sin(state.clock.elapsedTime * floatSpeed + floatOffset) * floatAmount;
    groupRef.current.position.y = node.position[1] + floatY;

    // Target scale calculation with hierarchy
    let targetScale = 1;
    if (isFilteredOut) {
      targetScale = hovered ? 0.75 : 0.45;
    } else if (isSelected || isFocused) {
      targetScale = isRootNode ? 1.25 : 1.36;
    } else if (hovered) {
      targetScale = isRootNode ? 1.15 : 1.25;
    } else if (isRelatedToSelected) {
      targetScale = 1.14;
    }

    // Smooth lerp scale
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 9
    );

    // Slowly rotate orbital ring for active/selected node
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.7;
      ringRef.current.rotation.x += delta * 0.35;
    }

    // Slowly rotate root aura ring
    if (rootRingRef.current) {
      rootRingRef.current.rotation.z -= delta * 0.3;
      rootRingRef.current.rotation.y += delta * 0.2;
    }

    // Subtle breathing pulse for selected or focused node
    if (pulseRef.current && (isSelected || isFocused)) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3.6) * 0.1;
      pulseRef.current.scale.set(s, s, s);
    }
  });

  const nodeColor = node.color || '#06b6d4';
  const baseRadius = (node.size || 1) * (isRootNode ? 0.42 : 0.45);

  return (
    <group ref={groupRef} position={[node.position[0], node.position[1], node.position[2]]}>
      {/* 3D Core Sphere Mesh */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode(node.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[baseRadius, 32, 32]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={
            isFilteredOut
              ? (hovered ? 0.35 : 0.05)
              : isSelected || isFocused
              ? 0.95
              : isRootNode
              ? 0.65
              : hovered
              ? 0.75
              : isRelatedToSelected
              ? 0.45
              : 0.25
          }
          roughness={0.2}
          metalness={0.8}
          transparent={isFilteredOut}
          opacity={isFilteredOut ? (hovered ? 0.8 : 0.18) : 1}
        />
      </mesh>

      {/* Root Node Soft Outer Orbital Ring */}
      {isRootNode && !isFilteredOut && (
        <mesh ref={rootRingRef}>
          <ringGeometry args={[baseRadius * 1.6, baseRadius * 1.75, 40]} />
          <meshBasicMaterial
            color={nodeColor}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Outer Orbital Ring for Focused, Selected, or Hovered Node */}
      {!isFilteredOut && (isSelected || isFocused || hovered || isRelatedToSelected) && (
        <mesh ref={ringRef}>
          <ringGeometry args={[baseRadius * 1.48, baseRadius * 1.64, 32]} />
          <meshBasicMaterial
            color={nodeColor}
            transparent
            opacity={isSelected || isFocused ? 0.85 : hovered ? 0.55 : 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Pulsing selection aura */}
      {!isFilteredOut && (isSelected || isFocused) && (
        <mesh ref={pulseRef}>
          <sphereGeometry args={[baseRadius * 1.32, 24, 24]} />
          <meshBasicMaterial
            color={nodeColor}
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Explored status emerald halo ring */}
      {!isFilteredOut && isExplored && !isSelected && !isFocused && (
        <mesh>
          <sphereGeometry args={[baseRadius * 1.15, 16, 16]} />
          <meshBasicMaterial
            color="#10b981"
            wireframe
            transparent
            opacity={0.22}
          />
        </mesh>
      )}

      {/* Crisp 2D Label rendered via Drei Html Billboard */}
      {(!isFilteredOut || hovered || isSelected) && (
        <Html
          position={[0, baseRadius + 0.55, 0]}
          center
          distanceFactor={16}
          pointerEvents="none"
          zIndexRange={[100, 0]}
        >
          <div
            className={`transition-all duration-200 pointer-events-none select-none px-2.5 py-1 rounded-md text-xs whitespace-nowrap flex items-center gap-1.5 shadow-xl ${
              isFilteredOut
                ? 'bg-slate-950/90 text-slate-400 border border-slate-700 opacity-65 scale-90'
                : isSelected || isFocused
                ? 'bg-slate-900/95 text-white font-bold border-2 border-cyan-400 shadow-cyan-500/30 scale-110 ring-2 ring-cyan-500/30'
                : isRootNode
                ? 'bg-slate-900/95 text-white font-bold border border-cyan-500/60 shadow-lg'
                : hovered
                ? 'bg-slate-900/95 text-white font-semibold border border-slate-500 scale-105'
                : isRelatedToSelected
                ? 'bg-slate-950/85 text-cyan-200 border border-cyan-500/50 shadow-cyan-950'
                : 'bg-slate-950/70 text-slate-300 border border-slate-800/80'
            }`}
          >
            {/* Status dot */}
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{
                backgroundColor: isExplored ? '#10b981' : nodeColor,
                boxShadow: `0 0 6px ${isExplored ? '#10b981' : nodeColor}`,
              }}
            />
            <span className="tracking-tight">{node.name}</span>
            {isExplored && (
              <span className="text-[10px] text-emerald-400 font-mono ml-0.5 font-bold">
                ✓
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
