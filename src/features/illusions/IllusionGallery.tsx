import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';


// --- Illusion 1: The Impossible Triangle (Penrose) ---
const ImpossibleTriangle = () => {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Default rotation: broken state
            // Hover rotation: perfect alignment

            // Smoothly interpolate
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, hovered ? 0.615 : 0, 4 * delta);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, hovered ? 0.785 : state.clock.getElapsedTime() * 0.5, 4 * delta);
        }
    });

    return (
        <group
            ref={groupRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Leg 1 */}
            <mesh position={[0, -1, 0]}>
                <boxGeometry args={[3, 0.5, 0.5]} />
                <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.5} />
            </mesh>
            {/* Leg 2 */}
            <mesh position={[1.25, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
                <boxGeometry args={[3, 0.5, 0.5]} />
                <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.5} />
            </mesh>
            {/* Leg 3 (The trick) */}
            <mesh position={[-1.25, 0.25, -1.25]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[3, 0.5, 0.5]} />
                <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.5} />
            </mesh>
        </group>
    );
};

// --- Illusion 2: Pop-Out Cube ---
const PopOutCube = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((_state, delta) => {
        if (meshRef.current) {
            // Pop out effect: Move Z towards camera and rotate
            const targetZ = hovered ? 2 : 0;
            const targetScale = hovered ? 1.2 : 1;

            meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 5 * delta);
            meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 5 * delta));

            // Idle rotation
            meshRef.current.rotation.x += 0.2 * delta;
            meshRef.current.rotation.y += 0.3 * delta;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <boxGeometry args={[1.5, 1.5, 1.5]} />
                <meshStandardMaterial color="#3b82f6" roughness={0.1} metalness={0.8} />
            </mesh>
        </Float>
    );
};

// --- Illusion 3: Kinetic Rings (Moiré-like) ---
const KineticRings = () => {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Expand rings on hover

            groupRef.current.children.forEach((child, i) => {
                const targetRot = hovered ? (state.clock.getElapsedTime() * (i + 1) * 0.5) : 0;
                child.rotation.z = THREE.MathUtils.lerp(child.rotation.z, targetRot, 2 * delta);

                // Pop out effect
                const targetZ = hovered ? i * 0.5 : 0;
                child.position.z = THREE.MathUtils.lerp(child.position.z, targetZ, 3 * delta);
            });

            // Rotate entire group
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, hovered ? 0.5 : 0, 2 * delta);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, hovered ? 0.5 : 0, 2 * delta);
        }
    });

    return (
        <group
            ref={groupRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {[...Array(5)].map((_, i) => (
                <mesh key={i}>
                    <torusGeometry args={[1 - i * 0.15, 0.05, 16, 100]} />
                    <meshStandardMaterial color={i % 2 === 0 ? "#10b981" : "#f59e0b"} />
                </mesh>
            ))}
        </group>
    );
};

export const IllusionGallery: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group relative h-[400px] rounded-3xl bg-gray-900 border-2 border-gray-800 overflow-hidden shadow-2xl transition-all hover:border-red-500/50">
                <div className="absolute top-6 left-6 z-10 pointer-events-none">
                    <h3 className="text-white font-black text-2xl mb-1">Impossible Triangle</h3>
                    <p className="text-gray-400 text-sm font-medium">Hover to align the perspective</p>
                </div>
                <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                    <Environment preset="city" />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <ImpossibleTriangle />
                    <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} />
                </Canvas>
            </div>

            {/* Card 2 */}
            <div className="group relative h-[400px] rounded-3xl bg-gray-900 border-2 border-gray-800 overflow-hidden shadow-2xl transition-all hover:border-blue-500/50">
                <div className="absolute top-6 left-6 z-10 pointer-events-none">
                    <h3 className="text-white font-black text-2xl mb-1">Pop-Out Cube</h3>
                    <p className="text-gray-400 text-sm font-medium">Hover to break the 4th wall</p>
                </div>
                <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                    <Environment preset="studio" />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <PopOutCube />
                    <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} />
                </Canvas>
            </div>

            {/* Card 3 */}
            <div className="group relative h-[400px] rounded-3xl bg-gray-900 border-2 border-gray-800 overflow-hidden shadow-2xl transition-all hover:border-green-500/50">
                <div className="absolute top-6 left-6 z-10 pointer-events-none">
                    <h3 className="text-white font-black text-2xl mb-1">Kinetic Rings</h3>
                    <p className="text-gray-400 text-sm font-medium">Hover to expand dimensions</p>
                </div>
                <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                    <Environment preset="city" />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <KineticRings />
                    <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} />
                </Canvas>
            </div>
        </div>
    );
};
