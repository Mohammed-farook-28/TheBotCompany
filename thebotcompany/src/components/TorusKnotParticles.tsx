import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TorusKnotSceneProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

function TorusKnotScene({ containerRef }: TorusKnotSceneProps) {
  const torusKnotRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const cameraGroupRef = useRef<THREE.Group>(null);
  const cursorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cursorTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const shouldRotateRef = useRef(true); // Track if continuous rotation should happen

  // Create particles positions (using PointsMaterial like reference)
  const positions = useMemo(() => {
    const count = 500;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Position particles around the torus knot
      pos[i3] = (Math.random() - 0.5) * 10;
      pos[i3 + 1] = (Math.random() - 0.5) * 10;
      pos[i3 + 2] = (Math.random() - 0.5) * 10;
    }

    return pos;
  }, []);

  // Animation frame with smooth parallax (like reference)
  useFrame((_, delta) => {
    // Smooth cursor interpolation using deltaTime (like reference: 5 * deltatime)
    const lerpFactor = 5 * delta;
    cursorRef.current.x += (cursorTargetRef.current.x - cursorRef.current.x) * lerpFactor;
    cursorRef.current.y += (cursorTargetRef.current.y - cursorRef.current.y) * lerpFactor;

    // Scene parallax - move the entire group (similar to cameraGroup in reference)
    if (cameraGroupRef.current) {
      const parallaxX = cursorRef.current.x * 0.5;
      const parallaxY = -cursorRef.current.y * 0.5;
      cameraGroupRef.current.position.x += (parallaxX - cameraGroupRef.current.position.x) * 5 * delta;
      cameraGroupRef.current.position.y += (parallaxY - cameraGroupRef.current.position.y) * 5 * delta;
    }

    // Continuous rotation (only after GSAP animation or when enabled)
    if (torusKnotRef.current && shouldRotateRef.current) {
      torusKnotRef.current.rotation.x += delta * 0.1;
      torusKnotRef.current.rotation.y += delta * 0.12;
    }

    // Animate particles
    if (particlesRef.current) {
      particlesRef.current.rotation.x += delta * 0.05;
      particlesRef.current.rotation.y += delta * 0.08;
    }
  });

  // GSAP scroll-triggered rotation animation only
  useEffect(() => {
    if (!torusKnotRef.current || !containerRef.current) return;

    // Torus knot rotation animation when entering section (like reference)
    let rotationAnimation: gsap.core.Tween | null = null;

    const rotateTorusKnot = () => {
      if (torusKnotRef.current) {
        // Temporarily disable continuous rotation during GSAP animation
        shouldRotateRef.current = false;
        
        rotationAnimation = gsap.to(torusKnotRef.current.rotation, {
          duration: 1.5,
          ease: 'power2.inOut',
          x: '+=6',
          y: '+=3',
          z: '+=1.5',
          onComplete: () => {
            // Resume continuous rotation after GSAP animation completes
            shouldRotateRef.current = true;
          },
        });
      }
    };

    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => {
        // Rotate torus knot when entering section
        rotateTorusKnot();
      },
      onEnterBack: () => {
        // Rotate torus knot when entering back from bottom
        rotateTorusKnot();
      },
    });

    return () => {
      if (rotationAnimation) {
        rotationAnimation.kill();
      }
      scrollTrigger.kill();
    };
  }, [containerRef]);

  // Smooth parallax mouse effect (like reference)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      cursorTargetRef.current.x = x;
      cursorTargetRef.current.y = y;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Load gradient map texture for toon shading
  const gradientMap = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/textures/gradients/3.jpg');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }, []);

  // MeshToonMaterial with gradient map
  const toonMaterial = useMemo(
    () =>
      new THREE.MeshToonMaterial({
        color: '#00baff',
        emissive: '#0066aa',
        emissiveIntensity: 0.4,
        gradientMap: gradientMap || undefined,
        wireframe: false,
        transparent: true,
        opacity: 0.95,
      }),
    [gradientMap]
  );

  // Particles material
  const particlesMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: '#00baff',
        sizeAttenuation: true,
        size: 0.03,
        transparent: true,
        opacity: 0.7,
      }),
    []
  );

  return (
    <group ref={cameraGroupRef}>
      <group ref={groupRef}>
      {/* Main Torus Knot - scaled down to fit within container */}
      <TorusKnot
        ref={torusKnotRef}
        args={[0.8, 0.25, 128, 16]}
        position={[0, 0, 0]}
        scale={[0.9, 0.9, 0.9]}
      >
        <primitive object={toonMaterial} attach="material" />
      </TorusKnot>

        {/* Particles using PointsMaterial */}
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
    </group>
  );
}

export default function TorusKnotParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] relative overflow-hidden"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'normal'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: typeof window !== 'undefined' && window.innerWidth < 640 ? 50 : 40 }}
        dpr={[1, typeof window !== 'undefined' && window.innerWidth < 768 ? 1.5 : 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          premultipliedAlpha: false
        }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[1, 1, 0]} intensity={3} color="#ffffff" />
        <directionalLight position={[-1, -1, 0]} intensity={0.5} />
        <TorusKnotScene containerRef={containerRef} />
      </Canvas>
    </div>
  );
}
