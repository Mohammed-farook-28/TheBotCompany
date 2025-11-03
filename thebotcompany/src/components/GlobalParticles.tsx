import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticlesScene() {
  const particlesRef = useRef<THREE.Points>(null);
  const cameraGroupRef = useRef<THREE.Group>(null);
  const cursorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cursorTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Create particles positions - spread across viewport
  const positions = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute particles evenly across screen space
      pos[i3] = (Math.random() - 0.5) * 100; // X: wide spread
      pos[i3 + 1] = (Math.random() - 0.5) * 100; // Y: tall spread  
      pos[i3 + 2] = (Math.random() - 0.5) * 50; // Z: depth
    }

    return pos;
  }, []);

  // Animation frame with smooth camera-based parallax (like reference)
  useFrame((state, delta) => {
    // Smooth cursor interpolation - MORE responsive for smoother movement
    const lerpFactor = Math.min(10 * delta, 1); // Cap at 1 for smoothness
    cursorRef.current.x += (cursorTargetRef.current.x - cursorRef.current.x) * lerpFactor;
    cursorRef.current.y += (cursorTargetRef.current.y - cursorRef.current.y) * lerpFactor;

    // Camera parallax - move the group based on cursor (like reference)
    // Increased parallax amount for more noticeable movement
    if (cameraGroupRef.current) {
      const parallaxX = cursorRef.current.x * 1.5; // Increased from 0.5
      const parallaxY = -cursorRef.current.y * 1.5; // Increased from 0.5
      
      // Smooth interpolation for camera movement
      const cameraLerp = 8 * delta; // Faster response
      cameraGroupRef.current.position.x += (parallaxX - cameraGroupRef.current.position.x) * cameraLerp;
      cameraGroupRef.current.position.y += (parallaxY - cameraGroupRef.current.position.y) * cameraLerp;
    }

    // Subtle rotation for particles
    if (particlesRef.current) {
      particlesRef.current.rotation.x += delta * 0.01;
      particlesRef.current.rotation.y += delta * 0.015;
      particlesRef.current.rotation.z += delta * 0.005;
    }
  });

  // Smooth parallax mouse effect (like reference)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      cursorTargetRef.current.x = x;
      cursorTargetRef.current.y = y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particles material - highly visible across all sections
  const particlesMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: '#00baff',
        sizeAttenuation: true,
        size: 0.12,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  return (
    <group ref={cameraGroupRef}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <primitive object={particlesMaterial} attach="material" />
      </points>
    </group>
  );
}

export default function GlobalParticles() {
  return (
    <div 
      className="fixed inset-0"
      style={{ 
        zIndex: 11, // Above content (z-10) but non-interactive
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none', // CRITICAL - no interactions
        mixBlendMode: 'screen' // Helps visibility over black backgrounds
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 0, typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 35], 
          fov: typeof window !== 'undefined' && window.innerWidth < 768 ? 75 : 70 
        }}
        gl={{ 
          antialias: typeof window !== 'undefined' && window.innerWidth >= 768, 
          alpha: true,
          powerPreference: typeof window !== 'undefined' && window.innerWidth < 768 ? 'low-power' : 'high-performance',
          preserveDrawingBuffer: false
        }}
        dpr={[1, typeof window !== 'undefined' && window.innerWidth < 768 ? 1.5 : 2]} // Lower DPR on mobile for performance
        style={{ 
          background: 'transparent', 
          width: '100%', 
          height: '100%',
          display: 'block',
          pointerEvents: 'none'
        }}
      >
        <ParticlesScene />
      </Canvas>
    </div>
  );
}
