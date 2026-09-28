import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import KnowledgeNode from './KnowledgeNode.jsx';
import Connection from './Connection.jsx';
import LoadingScreen from './LoadingScreen.jsx';

// Component inside Canvas to smoothly glide the OrbitControls target and camera toward focused node
function CameraController({ targetPosition, controlsRef, cameraResetTrigger }) {
  const { camera } = useThree();
  const targetVec = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(false);
  const transitionProgress = useRef(1);

  const targetX = targetPosition?.[0] ?? 0;
  const targetY = targetPosition?.[1] ?? 0;
  const targetZ = targetPosition?.[2] ?? 0;

  // When target coordinates change, smoothly guide camera and controls target
  useEffect(() => {
    if (
      targetVec.current.x !== targetX ||
      targetVec.current.y !== targetY ||
      targetVec.current.z !== targetZ
    ) {
      targetVec.current.set(targetX, targetY, targetZ);
      isTransitioning.current = true;
      transitionProgress.current = 0;
    }
  }, [targetX, targetY, targetZ]);

  // Handle camera reset trigger
  useEffect(() => {
    if (cameraResetTrigger && controlsRef.current) {
      targetVec.current.set(0, 0, 0);
      controlsRef.current.target.set(0, 0, 0);
      camera.position.set(0, 6, 18);
      controlsRef.current.update();
      isTransitioning.current = false;
    }
  }, [cameraResetTrigger, camera, controlsRef]);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    // Only smoothly lerp camera and target during transition to prevent fighting user pan/rotate
    if (isTransitioning.current) {
      controlsRef.current.target.lerp(targetVec.current, Math.min(delta * 4.2, 0.18));
      transitionProgress.current += delta * 1.5;

      const desiredPos = new THREE.Vector3(
        targetVec.current.x,
        targetVec.current.y + 2.2,
        targetVec.current.z + 9.5
      );
      camera.position.lerp(desiredPos, Math.min(delta * 3.2, 0.15));

      if (transitionProgress.current >= 1) {
        isTransitioning.current = false;
        controlsRef.current.target.copy(targetVec.current);
      }
      controlsRef.current.update();
    }
  });

  return null;
}

// Bulletproof atmospheric space fog
function SpaceFog() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2('#050811', 0.012);
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  return null;
}

// Scene ready notifier
function SceneReadyNotifier({ onReady }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

export default function KnowledgeScene({
  nodes,
  edges,
  selectedNodeId,
  focusedNodeId,
  exploredNodeIds,
  selectedCategory,
  onSelectNode,
  onBackgroundClick,
  cameraResetTrigger,
}) {
  const controlsRef = useRef();
  const [isSceneReady, setIsSceneReady] = useState(false);

  // Responsive device star particle budget
  const starCount = useMemo(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 1200;
    }
    return 2400;
  }, []);

  // Find position of currently focused or selected node for camera tracking
  const defaultPosition = useMemo(() => [0, 0, 0], []);
  const activeNode = nodes.find((n) => n.id === (focusedNodeId || selectedNodeId));
  const targetPosition = activeNode ? activeNode.position : defaultPosition;

  // Set up set of related node IDs for the selected node to highlight connected branches
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const relatedNodeIds = selectedNode ? selectedNode.relatedIds || [] : [];

  return (
    <div className="w-full h-full relative select-none">
      {/* Lightweight Startup Loader until WebGL context initializes */}
      {!isSceneReady && (
        <LoadingScreen message="Initializing 3D spatial knowledge galaxy..." />
      )}

      <Canvas
        camera={{ position: [0, 6, 18], fov: 45, near: 0.1, far: 1000 }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
        onPointerMissed={() => {
          // Native R3F handler that fires only when clicking on empty background without dragging
          if (onBackgroundClick) onBackgroundClick();
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <SpaceFog />
        <SceneReadyNotifier onReady={() => setIsSceneReady(true)} />

        {/* Deep space starlight particles */}
        <Stars
          radius={70}
          depth={60}
          count={starCount}
          factor={3.8}
          saturation={0}
          fade
          speed={0.7}
        />

        {/* Studio directional and ambient lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[12, 16, 10]} intensity={1.3} />
        <directionalLight position={[-12, -10, -6]} intensity={0.4} color="#6366f1" />
        <pointLight position={[0, 0, 0]} intensity={0.9} distance={24} color="#06b6d4" />

        {/* Orbit Controls with smooth damping */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          minDistance={3.5}
          maxDistance={48}
          maxPolarAngle={Math.PI / 1.05}
          minPolarAngle={Math.PI / 16}
        />

        {/* Dynamic Camera Target & Flight Controller */}
        <CameraController
          targetPosition={targetPosition}
          controlsRef={controlsRef}
          cameraResetTrigger={cameraResetTrigger}
        />

        {/* Knowledge Connections (Lines) */}
        <group name="connections-layer">
          {edges.map((edge) => {
            const fromFiltered =
              selectedCategory &&
              selectedCategory !== 'all' &&
              edge.fromNode?.category !== selectedCategory;
            const toFiltered =
              selectedCategory &&
              selectedCategory !== 'all' &&
              edge.toNode?.category !== selectedCategory;
            const isFilteredOut = fromFiltered || toFiltered;

            return (
              <Connection
                key={edge.id}
                edge={edge}
                selectedNodeId={selectedNodeId}
                focusedNodeId={focusedNodeId}
                isHighlighted={
                  (edge.fromId === selectedNodeId && relatedNodeIds.includes(edge.toId)) ||
                  (edge.toId === selectedNodeId && relatedNodeIds.includes(edge.fromId))
                }
                isFilteredOut={isFilteredOut}
              />
            );
          })}
        </group>

        {/* Knowledge Constellation Nodes */}
        <group name="nodes-layer">
          {nodes.map((node) => {
            const isFilteredOut =
              selectedCategory &&
              selectedCategory !== 'all' &&
              node.category !== selectedCategory;

            return (
              <KnowledgeNode
                key={node.id}
                node={node}
                isSelected={node.id === selectedNodeId}
                isFocused={node.id === focusedNodeId}
                isExplored={exploredNodeIds.includes(node.id)}
                isRelatedToSelected={relatedNodeIds.includes(node.id)}
                isFilteredOut={isFilteredOut}
                onSelectNode={onSelectNode}
              />
            );
          })}
        </group>
      </Canvas>
    </div>
  );
}
