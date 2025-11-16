"use client";
import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Html, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

interface PlanetData {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
}

interface GalaxyPlanets3DProps {
  planetsData: PlanetData[];
}

// 3D Planet Component
function Planet3D({
  planet,
  position,
  onClick,
  selectedPlanet,
}: {
  planet: PlanetData;
  position: [number, number, number];
  onClick: () => void;
  selectedPlanet: PlanetData | null;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const Icon = planet.icon;
  const isSelected = selectedPlanet?.id === planet.id;

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Slow planet self-rotation - use delta for frame-independent animation
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Planet sphere */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={isSelected ? "#00baff" : hovered ? "#00d4ff" : "#00baff"}
          emissive={isSelected ? "#00baff" : "#0066aa"}
          emissiveIntensity={isSelected ? 0.8 : 0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial
          color="#00baff"
          transparent
          opacity={isSelected ? 0.3 : hovered ? 0.2 : 0.1}
          emissive="#00baff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Planet label - always face camera (billboard) */}
      <Billboard 
        position={[0, -0.7, 0]}
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <Text
          fontSize={0.18}
          color="#00baff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {planet.title}
        </Text>
      </Billboard>

      {/* Popup/Tooltip above planet - centered and always readable */}
      {isSelected && (
        <Html
          position={[0, 1.2, 0]}
          center
          distanceFactor={10}
          zIndexRange={[100, 0]}
          style={{ 
            pointerEvents: "auto",
            transform: "translate(-50%, 0)",
            width: "300px",
            maxWidth: "calc(100vw - 40px)", // Ensure it doesn't overflow viewport
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            left: "50%",
            right: "auto"
          }}
          wrapperClass="planet-popup-wrapper"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-black/95 border-2 border-[#00baff]/50 rounded-lg p-5 w-[300px] max-w-[calc(100vw-40px)] shadow-2xl shadow-[#00baff]/30 backdrop-blur-sm"
            style={{ 
              pointerEvents: "auto", 
              overflow: "visible",
              transform: "none", // Ensure no rotation
              position: "relative",
              left: "50%",
              marginLeft: "-150px", // Half width to center
              maxWidth: "calc(100vw - 40px)" // Prevent overflow
            }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00baff] via-[#00baff]/80 to-[#0066aa] flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-base mb-1">{planet.title}</h4>
                <p className="text-[#00baff] text-sm mb-1">{planet.date}</p>
                <p className="text-white/60 text-xs">{planet.category}</p>
              </div>
            </div>
            <p className="text-white/90 text-sm leading-relaxed whitespace-normal break-words">{planet.content}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#00baff] text-black text-base font-bold hover:bg-[#00d4ff] transition-colors flex items-center justify-center z-50 shadow-lg"
              style={{ pointerEvents: "auto" }}
            >
              ×
            </button>
          </motion.div>
        </Html>
      )}
    </group>
  );
}

// Central Star Component
function CentralStar() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
    }
  });

  return (
    <group>
      {/* Main star sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color="#00baff"
          emissive="#00baff"
          emissiveIntensity={1}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Glow layers */}
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color="#00baff"
          transparent
          opacity={0.3}
          emissive="#00baff"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial
          color="#00baff"
          transparent
          opacity={0.1}
          emissive="#00baff"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

// Orbit Component - handles one orbit with its planets
function OrbitGroup({
  planets,
  orbitRadius,
  orbitIndex,
  orbitTilt,
  orbitZRotation,
  selectedPlanet,
  onPlanetClick,
  orbitAngles,
  isOrbiting,
  autoRotate,
  onOrbitAngleUpdate,
}: {
  planets: PlanetData[];
  orbitRadius: number;
  orbitIndex: number;
  orbitTilt: number;
  orbitZRotation: number;
  selectedPlanet: PlanetData | null;
  onPlanetClick: (planet: PlanetData) => void;
  orbitAngles: number[];
  isOrbiting: boolean;
  autoRotate: boolean;
  onOrbitAngleUpdate?: (index: number, angle: number) => void;
}) {
  const orbitGroupRef = useRef<THREE.Group>(null);
  const tiltAngle = orbitTilt; // Use the passed tilt angle for this specific orbit
  const zRotation = orbitZRotation; // Additional Z-axis rotation for varied orbital planes
  // Different rotation speeds and directions for each orbit - more varied for immersion
  const baseSpeeds = [2.5, -3.2, 2.8]; // base speeds
  const speedVariations = [0.3, -0.4, 0.35]; // slight variations
  const baseSpeed = baseSpeeds[orbitIndex];
  const speedVariation = speedVariations[orbitIndex];
  
  // Use useRef to store time for smooth speed variation
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (orbitGroupRef.current && autoRotate && !isOrbiting) {
      // Continuously vary speed smoothly for more organic, immersive rotation
      timeRef.current += delta;
      // Use sine wave for smooth speed variation over time (slow variation)
      const speedVariationFactor = Math.sin(timeRef.current * 0.3) * speedVariation;
      const currentSpeed = baseSpeed + speedVariationFactor;
      
      // Smooth rotation with dynamic speed
      const rotationIncrement = (currentSpeed * delta * Math.PI) / 180;
      const currentAngle = (orbitAngles[orbitIndex] * Math.PI) / 180;
      const newAngle = currentAngle + rotationIncrement;
      
      orbitGroupRef.current.rotation.y = newAngle;
      
      // Update orbit angle state
      if (onOrbitAngleUpdate) {
        onOrbitAngleUpdate(orbitIndex, orbitAngles[orbitIndex] + (currentSpeed * delta));
      }
    } else if (orbitGroupRef.current) {
      // Manual rotation (when orbiting or planet selected)
      orbitGroupRef.current.rotation.y = (orbitAngles[orbitIndex] * Math.PI) / 180;
    }
    
    // Apply tilt and Z rotation for varied orbital planes
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.x = tiltAngle;
      orbitGroupRef.current.rotation.z = zRotation;
    }
  });

  // Calculate planet positions for this orbit (2 planets per orbit, 180 degrees apart)
  const getPlanetPosition = (planetIndex: number): [number, number, number] => {
    const angle = (planetIndex * Math.PI); // 0 or PI (180 degrees)
    const baseX = Math.cos(angle) * orbitRadius;
    const baseY = Math.sin(angle) * orbitRadius;
    const baseZ = 0;
    
    // Apply X-axis tilt
    const x = baseX;
    const y = baseY * Math.cos(tiltAngle) - baseZ * Math.sin(tiltAngle);
    const z = baseY * Math.sin(tiltAngle) + baseZ * Math.cos(tiltAngle);
    
    return [x, y, z];
  };

  return (
    <group ref={orbitGroupRef} rotation={[tiltAngle, (orbitAngles[orbitIndex] * Math.PI) / 180, zRotation]}>
      {/* Orbital ring for this orbit - tilted to match orbit plane */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[orbitRadius, 0.01, 16, 100]} />
        <meshStandardMaterial color="#00baff" transparent opacity={0.3} />
      </mesh>
      
      {/* Planets in this orbit */}
      {planets.map((planet, index) => {
        const position = getPlanetPosition(index);
        return (
          <group key={planet.id}>
            {/* Orbital trail for this planet */}
            <mesh rotation={[0, index * Math.PI, 0]}>
              <torusGeometry args={[orbitRadius, 0.008, 16, 32]} />
              <meshStandardMaterial 
                color="#00baff" 
                transparent 
                opacity={selectedPlanet?.id === planet.id ? 0.4 : 0.15} 
              />
            </mesh>
            
            <Planet3D
              planet={planet}
              position={position}
              onClick={() => onPlanetClick(planet)}
              selectedPlanet={selectedPlanet}
            />
          </group>
        );
      })}
    </group>
  );
}

// Galaxy Scene Component
function GalaxyScene({
  planetsData,
  selectedPlanet,
  onPlanetClick,
  orbitAngles,
  isOrbiting,
  autoRotate,
  onOrbitAngleUpdate,
}: {
  planetsData: PlanetData[];
  selectedPlanet: PlanetData | null;
  onPlanetClick: (planet: PlanetData) => void;
  orbitAngles: number[];
  isOrbiting: boolean;
  autoRotate: boolean;
  onOrbitAngleUpdate?: (index: number, angle: number) => void;
}) {
  // Split planets into 3 orbits (2 planets per orbit)
  const orbit1Planets = planetsData.slice(0, 2); // First 2 planets
  const orbit2Planets = planetsData.slice(2, 4); // Next 2 planets
  const orbit3Planets = planetsData.slice(4, 6); // Last 2 planets

  // Different orbit radii for visual separation (reduced to fit in view)
  const orbitRadii = [1.8, 2.5, 3.2];
  
  // Different orbital plane tilts for each orbit (like real solar system)
  // Each orbit tilts at different angles to create varied 3D orbits
  const orbitTilts = [
    Math.PI / 6,      // Orbit 1: 30 degrees (X-axis tilt)
    -Math.PI / 8,     // Orbit 2: -22.5 degrees (opposite direction)
    Math.PI / 5       // Orbit 3: 36 degrees
  ];
  
  // Additional rotation offsets for Z-axis (to create varied orbital planes)
  const orbitZRotations = [
    0,              // Orbit 1: no Z rotation
    Math.PI / 12,   // Orbit 2: 15 degrees Z rotation
    -Math.PI / 15  // Orbit 3: -12 degrees Z rotation
  ];

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00baff" />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {/* Central Star */}
      <CentralStar />

      {/* Orbit 1 - Inner orbit */}
      <OrbitGroup
        planets={orbit1Planets}
        orbitRadius={orbitRadii[0]}
        orbitIndex={0}
        orbitTilt={orbitTilts[0]}
        orbitZRotation={orbitZRotations[0]}
        selectedPlanet={selectedPlanet}
        onPlanetClick={onPlanetClick}
        orbitAngles={orbitAngles}
        isOrbiting={isOrbiting}
        autoRotate={autoRotate}
        onOrbitAngleUpdate={onOrbitAngleUpdate}
      />

      {/* Orbit 2 - Middle orbit */}
      <OrbitGroup
        planets={orbit2Planets}
        orbitRadius={orbitRadii[1]}
        orbitIndex={1}
        orbitTilt={orbitTilts[1]}
        orbitZRotation={orbitZRotations[1]}
        selectedPlanet={selectedPlanet}
        onPlanetClick={onPlanetClick}
        orbitAngles={orbitAngles}
        isOrbiting={isOrbiting}
        autoRotate={autoRotate}
        onOrbitAngleUpdate={onOrbitAngleUpdate}
      />

      {/* Orbit 3 - Outer orbit */}
      <OrbitGroup
        planets={orbit3Planets}
        orbitRadius={orbitRadii[2]}
        orbitIndex={2}
        orbitTilt={orbitTilts[2]}
        orbitZRotation={orbitZRotations[2]}
        selectedPlanet={selectedPlanet}
        onPlanetClick={onPlanetClick}
        orbitAngles={orbitAngles}
        isOrbiting={isOrbiting}
        autoRotate={autoRotate}
        onOrbitAngleUpdate={onOrbitAngleUpdate}
      />
    </>
  );
}

// Main Component
export default function GalaxyPlanets3D({ planetsData }: GalaxyPlanets3DProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [orbitAngles, setOrbitAngles] = useState([0, 0, 0]); // One angle per orbit
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const orbitAnimationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper: Get orbit index and position in orbit for a planet
  const getPlanetOrbitInfo = (planetIndex: number) => {
    const orbitIndex = Math.floor(planetIndex / 2); // 0, 1, or 2
    const positionInOrbit = planetIndex % 2; // 0 or 1
    return { orbitIndex, positionInOrbit };
  };

  // Update single orbit angle
  const updateOrbitAngle = (orbitIndex: number, angle: number) => {
    setOrbitAngles(prev => {
      const newAngles = [...prev];
      newAngles[orbitIndex] = angle;
      return newAngles;
    });
  };

  // Start 3D orbit animation - brings next planet to front and stays, then shows popup
  const startOrbitAnimation = () => {
    if (isOrbiting) return;

    setIsOrbiting(true);
    setAutoRotate(false); // Stop auto-rotation
    
    // First, close current popup if open
    setSelectedPlanet(null);
    
    // Wait a bit for popup to close, then start orbit animation
    setTimeout(() => {
      const nextPhase = (currentPhase + 1) % planetsData.length;
      const nextPlanetInfo = getPlanetOrbitInfo(nextPhase);
      
      // Calculate rotation needed to bring next planet to front (0 degrees)
      // For 2 planets per orbit, they're 180 degrees apart
      // We need to rotate the orbit so the clicked planet is at angle 0
      const startAngle = orbitAngles[nextPlanetInfo.orbitIndex];
      // To bring planet at positionInOrbit to 0 degrees:
      // currentPlanetAngle = startAngle + (positionInOrbit * 180)
      // We want: targetAngle + (positionInOrbit * 180) = 0
      // So: targetAngle = -(positionInOrbit * 180)
      const targetAngle = -(nextPlanetInfo.positionInOrbit * 180);
      
      let startTime = Date.now();
      const duration = 1500;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentAngle = startAngle + (targetAngle - startAngle) * eased;
        
        updateOrbitAngle(nextPlanetInfo.orbitIndex, currentAngle);

        if (progress < 1) {
          orbitAnimationRef.current = requestAnimationFrame(animate);
        } else {
          setCurrentPhase(nextPhase);
          setIsOrbiting(false);
          updateOrbitAngle(nextPlanetInfo.orbitIndex, targetAngle);
          
          // After orbit completes, show popup for the new phase
          setTimeout(() => {
            setSelectedPlanet(planetsData[nextPhase]);
          }, 300);
        }
      };

      animate();
    }, 200);
  };

  // Handle planet click - animate to bring planet to front
  const handlePlanetClick = (planet: PlanetData) => {
    if (selectedPlanet?.id === planet.id) {
      // Clicking same planet closes it - resume auto-rotation
      setSelectedPlanet(null);
      setAutoRotate(true);
    } else {
      // Clicking different planet closes existing and opens new
      setSelectedPlanet(planet);
      setAutoRotate(false);
      
      const planetIndex = planetsData.findIndex(p => p.id === planet.id);
      if (planetIndex !== -1 && !isOrbiting) {
        const planetInfo = getPlanetOrbitInfo(planetIndex);
        const startAngle = orbitAngles[planetInfo.orbitIndex];
        
        // Rotate orbit so planet is at front (0 degrees)
        // To bring planet at positionInOrbit to 0 degrees:
        // targetAngle + (positionInOrbit * 180) = 0
        // So: targetAngle = -(positionInOrbit * 180)
        const targetAngle = -(planetInfo.positionInOrbit * 180);
        let startTime = Date.now();
        const duration = 1500;

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const currentAngle = startAngle + (targetAngle - startAngle) * eased;
          
          updateOrbitAngle(planetInfo.orbitIndex, currentAngle);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCurrentPhase(planetIndex);
            updateOrbitAngle(planetInfo.orbitIndex, targetAngle);
          }
        };

        animate();
      }
    }
  };

  // Click outside to reset - start auto-rotating again
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Reset everything and start auto-rotating
        setSelectedPlanet(null);
        setCurrentPhase(0);
        setOrbitAngles([0, 0, 0]);
        setIsOrbiting(false);
        setAutoRotate(true); // Start auto-rotation again
        if (orbitAnimationRef.current) {
          cancelAnimationFrame(orbitAnimationRef.current);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (orbitAnimationRef.current) {
        cancelAnimationFrame(orbitAnimationRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Global styles for popup positioning */}
      <style>{`
        .planet-popup-wrapper {
          position: absolute !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          max-width: calc(100vw - 40px) !important;
          pointer-events: auto !important;
        }
      `}</style>
      <div ref={containerRef} className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
      {/* 3D Canvas */}
      <Canvas
        camera={{ 
          position: typeof window !== 'undefined' && window.innerWidth < 640 ? [0, 1.5, 14] : [0, 2, 12], 
          fov: typeof window !== 'undefined' && window.innerWidth < 640 ? 45 : 40 
        }}
        dpr={[1, typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 1.5]}
        gl={{ 
          antialias: typeof window !== 'undefined' && window.innerWidth >= 768,
          alpha: true,
          powerPreference: typeof window !== 'undefined' && window.innerWidth < 768 ? 'low-power' : 'high-performance',
          preserveDrawingBuffer: false
        }}
        performance={{ min: 0.5 }}
        style={{ background: "transparent" }}
      >
        <GalaxyScene
          planetsData={planetsData}
          selectedPlanet={selectedPlanet}
          onPlanetClick={handlePlanetClick}
          orbitAngles={orbitAngles}
          isOrbiting={isOrbiting}
          autoRotate={autoRotate}
          onOrbitAngleUpdate={updateOrbitAngle}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30 px-4">
        <button
          onClick={startOrbitAnimation}
          disabled={isOrbiting}
          className="px-4 sm:px-6 py-3 sm:py-3 bg-[#00baff] text-black font-bold text-sm sm:text-base rounded-full shadow-lg shadow-[#00baff]/50 hover:shadow-[#00baff]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap touch-manipulation active:scale-95 min-h-[44px]"
        >
          {isOrbiting
            ? "Orbiting..."
            : `Next Phase: ${planetsData[(currentPhase + 1) % planetsData.length].title} →`}
        </button>
      </div>

      {/* Phase Indicator */}
      <div className="absolute top-4 sm:top-6 md:top-8 left-1/2 transform -translate-x-1/2 z-30 text-center px-4">
        <span className="text-white/60 text-xs sm:text-sm block">
          Phase {currentPhase + 1} / {planetsData.length}
        </span>
        <span className="text-[#00baff] font-semibold text-sm sm:text-base block mt-1">
          {planetsData[currentPhase].title}
        </span>
      </div>
    </div>
    </>
  );
}

