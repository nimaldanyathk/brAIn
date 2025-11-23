import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Cylinder, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface Experiment3DProps {
    voltage: number;
    resistance: number;
    current: number;
}

const Electron = ({ path, speed, offset }: { path: THREE.Vector3[], speed: number, offset: number }) => {
    const ref = useRef<THREE.Mesh>(null);
    const progress = useRef(offset);

    useFrame((_, delta) => {
        if (ref.current) {
            progress.current = (progress.current + speed * delta) % 1;
            const point = new THREE.Vector3();
            const curve = new THREE.CatmullRomCurve3(path, true); // Closed loop
            curve.getPoint(progress.current, point);
            ref.current.position.copy(point);
        }
    });

    return (
        <Sphere ref={ref} args={[0.15, 16, 16]}>
            <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.5} />
        </Sphere>
    );
};

const Resistor = ({ position, resistance }: { position: [number, number, number], resistance: number }) => {
    // Color bands based on resistance (Simplified visual)
    const bandColor = resistance > 300 ? '#ef4444' : resistance > 100 ? '#eab308' : '#3b82f6';

    return (
        <group position={position} rotation={[0, 0, Math.PI / 2]}>
            {/* Main Body */}
            <Cylinder args={[0.4, 0.4, 2, 32]}>
                <meshStandardMaterial color="#f5f5f4" />
            </Cylinder>
            {/* Bands */}
            <Cylinder args={[0.41, 0.41, 0.2, 32]} position={[0, 0.5, 0]}>
                <meshStandardMaterial color={bandColor} />
            </Cylinder>
            <Cylinder args={[0.41, 0.41, 0.2, 32]} position={[0, -0.2, 0]}>
                <meshStandardMaterial color="black" />
            </Cylinder>
            <Cylinder args={[0.41, 0.41, 0.2, 32]} position={[0, -0.6, 0]}>
                <meshStandardMaterial color="gold" />
            </Cylinder>
            {/* Label */}
            <Text position={[0, 1.5, 0]} fontSize={0.5} color="black" anchorX="center" anchorY="middle" rotation={[0, 0, -Math.PI / 2]}>
                {resistance}Ω
            </Text>
        </group>
    );
};

const Battery = ({ position, voltage }: { position: [number, number, number], voltage: number }) => {
    return (
        <group position={position}>
            {/* Body */}
            <Cylinder args={[0.5, 0.5, 2, 32]}>
                <meshStandardMaterial color="#1d1d1f" />
            </Cylinder>
            {/* Cap */}
            <Cylinder args={[0.2, 0.2, 0.4, 32]} position={[0, 1.1, 0]}>
                <meshStandardMaterial color="#9ca3af" />
            </Cylinder>
            {/* Label */}
            <Text position={[0.6, 0, 0]} fontSize={0.5} color="black" anchorX="left" anchorY="middle">
                {voltage}V
            </Text>
            <Text position={[0, 0.2, 0.51]} fontSize={0.6} color="white" anchorX="center" anchorY="middle">
                ⚡
            </Text>
        </group>
    );
};

const SceneContent = ({ voltage, resistance, current }: Experiment3DProps) => {
    // Define wire path (Rectangular loop)
    const wirePath = useMemo(() => [
        new THREE.Vector3(-3, 2, 0),  // Top Left
        new THREE.Vector3(3, 2, 0),   // Top Right
        new THREE.Vector3(3, -2, 0),  // Bottom Right
        new THREE.Vector3(-3, -2, 0), // Bottom Left
    ], []);

    // Calculate electron speed based on current
    // Base speed + factor * current
    const speed = 0.1 + (current * 2);

    return (
        <>
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <directionalLight position={[-5, 5, 5]} intensity={0.5} />

            {/* Components */}
            <Battery position={[-3, 0, 0]} voltage={voltage} />
            <Resistor position={[3, 0, 0]} resistance={resistance} />

            {/* Wires (Visual Lines) */}
            <Line
                points={[
                    [-3, 1.2, 0], [-3, 2, 0], [3, 2, 0], [3, 1.2, 0], // Top wire
                ]}
                color="#3b82f6"
                lineWidth={4}
            />
            <Line
                points={[
                    [-3, -1.2, 0], [-3, -2, 0], [3, -2, 0], [3, -1.2, 0], // Bottom wire
                ]}
                color="#3b82f6"
                lineWidth={4}
            />

            {/* Electrons */}
            {Array.from({ length: 20 }).map((_, i) => (
                <Electron
                    key={i}
                    path={wirePath}
                    speed={speed}
                    offset={i / 20}
                />
            ))}

            <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
        </>
    );
};

export const Experiment3D: React.FC<Experiment3DProps> = (props) => {
    return (
        <div className="w-full h-full min-h-[400px] bg-gray-50 rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <SceneContent {...props} />
            </Canvas>
        </div>
    );
};
