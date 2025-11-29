import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export type BadgeType = 'medal' | 'shield' | 'star';

interface Badge3DProps {
    type: BadgeType;
    color?: string;
    label?: string;
    isLocked?: boolean;
}

export const Badge3D: React.FC<Badge3DProps> = ({ type, color = '#fbbf24', label, isLocked = false }) => {
    const meshRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((_state) => {
        if (meshRef.current) {
            // Gentle rotation
            meshRef.current.rotation.y += 0.01;

            // Hover effect: Scale up and rotate faster
            if (hovered) {
                meshRef.current.rotation.y += 0.02;
                meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
            } else {
                meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            }
        }
    });

    const materialProps = {
        color: isLocked ? '#9ca3af' : color,
        metalness: 0.8,
        roughness: 0.2,
        distort: 0.3,
        speed: 2,
    };

    const renderShape = () => {
        switch (type) {
            case 'medal':
                return (
                    <group>
                        {/* Medal Body */}
                        <mesh position={[0, 0, 0]}>
                            <cylinderGeometry args={[1, 1, 0.2, 32]} />
                            <MeshDistortMaterial {...materialProps} />
                        </mesh>
                        {/* Ribbon (Visual only) */}
                        <mesh position={[0, 1.2, 0]}>
                            <boxGeometry args={[0.8, 1, 0.1]} />
                            <meshStandardMaterial color={isLocked ? "#4b5563" : "#ef4444"} />
                        </mesh>
                    </group>
                );
            case 'shield':
                return (
                    <mesh position={[0, 0, 0]}>
                        <icosahedronGeometry args={[1.2, 0]} />
                        <MeshDistortMaterial {...materialProps} />
                    </mesh>
                );
            case 'star':
                return (
                    <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 10]}>
                        <cylinderGeometry args={[1, 1, 0.3, 5]} />
                        <MeshDistortMaterial {...materialProps} />
                    </mesh>
                );
            default:
                return null;
        }
    };

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                {renderShape()}
                {label && !isLocked && (
                    <Text
                        position={[0, -1.5, 0]}
                        fontSize={0.3}
                        color="black"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.02}
                        outlineColor="white"
                    >
                        {label}
                    </Text>
                )}
            </group>
        </Float>
    );
};
