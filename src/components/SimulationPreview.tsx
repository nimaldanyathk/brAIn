import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sphere, TorusKnot, Box, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingIcons = () => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
            groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Atom Representation (Chemistry) */}
            <Float speed={2} rotationIntensity={1} floatIntensity={1} position={[-2, 1, 0]}>
                <group>
                    <Sphere args={[0.4, 32, 32]}>
                        <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.8} />
                    </Sphere>
                    <TorusKnot args={[0.6, 0.05, 64, 8]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
                    </TorusKnot>
                    <TorusKnot args={[0.6, 0.05, 64, 8]} rotation={[0, Math.PI / 2, 0]}>
                        <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
                    </TorusKnot>
                </group>
            </Float>

            {/* Abstract Math Shape (Math) */}
            <Float speed={1.5} rotationIntensity={2} floatIntensity={0.5} position={[2, 0, 0]}>
                <TorusKnot args={[0.8, 0.2, 100, 16]}>
                    <MeshDistortMaterial color="#eab308" speed={2} distort={0.3} roughness={0.2} />
                </TorusKnot>
            </Float>

            {/* Physics Cube (Physics) */}
            <Float speed={3} rotationIntensity={1.5} floatIntensity={1.5} position={[0, -1.5, 1]}>
                <Box args={[1, 1, 1]}>
                    <meshStandardMaterial color="#10b981" roughness={0.1} metalness={0.5} />
                </Box>
            </Float>
        </group>
    );
};

export const SimulationPreview: React.FC = () => {
    return (
        <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2),transparent_70%)]" />
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <FloatingIcons />
            </Canvas>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                <div>
                    <h3 className="text-white font-black text-xl">Interactive Labs</h3>
                    <p className="text-gray-400 text-sm">Real-time 3D Simulations</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <span className="text-xs font-mono text-white">LIVE PREVIEW</span>
                </div>
            </div>
        </div>
    );
};
