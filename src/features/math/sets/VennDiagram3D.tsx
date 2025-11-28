import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { ArrowLeft, Layers, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SetSphere = ({ position, color, label, active, opacity = 0.5 }: any) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.002;
            // Pulse effect if active
            if (active) {
                meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.02);
            } else {
                meshRef.current.scale.setScalar(1);
            }
        }
    });

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={opacity}
                    side={THREE.DoubleSide}
                    depthWrite={false} // Important for transparency
                />
            </mesh>
            <Text position={[0, 0, 1.6]} fontSize={0.5} color="black" anchorX="center" anchorY="middle">
                {label}
            </Text>
        </group>
    );
};

export const VennDiagram3D: React.FC = () => {
    const navigate = useNavigate();
    const [showA, setShowA] = useState(true);
    const [showB, setShowB] = useState(true);
    const [showC, setShowC] = useState(true);
    const [highlightIntersection, setHighlightIntersection] = useState<'none' | 'all' | 'ab' | 'bc' | 'ca'>('none');

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-4 shrink-0">
                <Button variant="ghost" onClick={() => navigate('/math')} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-display font-black text-brand-black">Sets & Venn Diagrams</h1>
                    <p className="text-sm text-gray-500 font-bold">Visualizing Unions & Intersections in 3D</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Controls */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card className="bg-pink-50 border-pink-200">
                        <div className="flex flex-col items-center text-center gap-4">
                            <Layers className="w-12 h-12 text-pink-500" />
                            <p className="text-sm leading-relaxed text-brand-black font-bold">
                                "Sets are collections of objects. In 3D, we can visualize them as spheres. Overlapping regions represent intersections!"
                            </p>
                        </div>
                    </Card>

                    <Card className="flex-1 space-y-6">
                        <div>
                            <h3 className="font-black text-brand-black mb-4">Toggle Sets</h3>
                            <div className="space-y-2">
                                <Button
                                    variant={showA ? 'primary' : 'outline'}
                                    className="w-full justify-between"
                                    onClick={() => setShowA(!showA)}
                                >
                                    Set A (Red) {showA ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </Button>
                                <Button
                                    variant={showB ? 'primary' : 'outline'}
                                    className="w-full justify-between"
                                    onClick={() => setShowB(!showB)}
                                >
                                    Set B (Blue) {showB ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </Button>
                                <Button
                                    variant={showC ? 'primary' : 'outline'}
                                    className="w-full justify-between"
                                    onClick={() => setShowC(!showC)}
                                >
                                    Set C (Green) {showC ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-black text-brand-black mb-4">Highlight Regions</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={highlightIntersection === 'none' ? 'secondary' : 'ghost'}
                                    onClick={() => setHighlightIntersection('none')}
                                    className="text-xs"
                                >
                                    Reset
                                </Button>
                                <Button
                                    variant={highlightIntersection === 'all' ? 'secondary' : 'ghost'}
                                    onClick={() => setHighlightIntersection('all')}
                                    className="text-xs"
                                >
                                    A ∩ B ∩ C
                                </Button>
                                <Button
                                    variant={highlightIntersection === 'ab' ? 'secondary' : 'ghost'}
                                    onClick={() => setHighlightIntersection('ab')}
                                    className="text-xs"
                                >
                                    A ∩ B
                                </Button>
                                <Button
                                    variant={highlightIntersection === 'bc' ? 'secondary' : 'ghost'}
                                    onClick={() => setHighlightIntersection('bc')}
                                    className="text-xs"
                                >
                                    B ∩ C
                                </Button>
                                <Button
                                    variant={highlightIntersection === 'ca' ? 'secondary' : 'ghost'}
                                    onClick={() => setHighlightIntersection('ca')}
                                    className="text-xs"
                                >
                                    C ∩ A
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* 3D Scene */}
                <div className="lg:col-span-2 h-[500px] lg:h-auto rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white relative">
                    <Canvas shadows camera={{ position: [0, 0, 8], fov: 50 }}>
                        <color attach="background" args={['#f8fafc']} />
                        <ambientLight intensity={0.8} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                        <Environment preset="city" />

                        <group position={[0, 0, 0]}>
                            {/* Set A - Top */}
                            {showA && (
                                <SetSphere
                                    position={[0, 1, 0]}
                                    color="#ef4444"
                                    label="A"
                                    active={highlightIntersection === 'all' || highlightIntersection === 'ab' || highlightIntersection === 'ca'}
                                    opacity={highlightIntersection !== 'none' && !(highlightIntersection === 'all' || highlightIntersection === 'ab' || highlightIntersection === 'ca') ? 0.1 : 0.4}
                                />
                            )}

                            {/* Set B - Bottom Left */}
                            {showB && (
                                <SetSphere
                                    position={[-1, -0.8, 0]}
                                    color="#3b82f6"
                                    label="B"
                                    active={highlightIntersection === 'all' || highlightIntersection === 'ab' || highlightIntersection === 'bc'}
                                    opacity={highlightIntersection !== 'none' && !(highlightIntersection === 'all' || highlightIntersection === 'ab' || highlightIntersection === 'bc') ? 0.1 : 0.4}
                                />
                            )}

                            {/* Set C - Bottom Right */}
                            {showC && (
                                <SetSphere
                                    position={[1, -0.8, 0]}
                                    color="#22c55e"
                                    label="C"
                                    active={highlightIntersection === 'all' || highlightIntersection === 'bc' || highlightIntersection === 'ca'}
                                    opacity={highlightIntersection !== 'none' && !(highlightIntersection === 'all' || highlightIntersection === 'bc' || highlightIntersection === 'ca') ? 0.1 : 0.4}
                                />
                            )}

                            {/* Intersection Highlight Sphere (Visual trick) */}
                            {highlightIntersection === 'all' && showA && showB && showC && (
                                <mesh position={[0, -0.2, 0]} scale={0.5}>
                                    <sphereGeometry args={[1, 32, 32]} />
                                    <meshStandardMaterial color="#ffffff" emissive="#fbbf24" emissiveIntensity={2} toneMapped={false} />
                                </mesh>
                            )}
                        </group>

                        <OrbitControls enablePan={false} minDistance={5} maxDistance={15} />
                    </Canvas>

                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full border border-gray-200 text-xs font-bold text-gray-500">
                        Drag to Rotate • Scroll to Zoom
                    </div>
                </div>
            </div>
        </div>
    );
};
