import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { ArrowLeft, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConicShape = ({ type }: { type: 'parabola' | 'ellipse' | 'hyperbola' }) => {
    // Simplified representations using Torus/Tube geometries or custom shapes
    // For a true conic section, we'd ideally slice a cone. 
    // Here we'll use approximations for visualization.

    if (type === 'ellipse') {
        return (
            <group rotation={[Math.PI / 2, 0, 0]}>
                <mesh>
                    <torusGeometry args={[3, 0.1, 16, 100]} />
                    <meshStandardMaterial color="#10b981" />
                </mesh>
                <Text position={[0, 0, 0.5]} fontSize={0.5} color="black">Ellipse</Text>
            </group>
        );
    }

    if (type === 'parabola') {
        // Parabola approximation using a curved tube
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-3, 5, 0),
            new THREE.Vector3(-1.5, 1, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1.5, 1, 0),
            new THREE.Vector3(3, 5, 0),
        ]);
        return (
            <group>
                <mesh>
                    <tubeGeometry args={[curve, 64, 0.1, 8, false]} />
                    <meshStandardMaterial color="#10b981" />
                </mesh>
                <Text position={[0, 1, 0]} fontSize={0.5} color="black">Parabola</Text>
            </group>
        );
    }

    if (type === 'hyperbola') {
        // Two curves
        const curve1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-3, 5, 0),
            new THREE.Vector3(-1, 1, 0),
            new THREE.Vector3(-0.5, 0, 0), // Vertex
            new THREE.Vector3(-1, -1, 0),
            new THREE.Vector3(-3, -5, 0),
        ]);
        const curve2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(3, 5, 0),
            new THREE.Vector3(1, 1, 0),
            new THREE.Vector3(0.5, 0, 0), // Vertex
            new THREE.Vector3(1, -1, 0),
            new THREE.Vector3(3, -5, 0),
        ]);
        return (
            <group rotation={[0, 0, Math.PI / 2]}>
                <mesh>
                    <tubeGeometry args={[curve1, 64, 0.1, 8, false]} />
                    <meshStandardMaterial color="#10b981" />
                </mesh>
                <mesh>
                    <tubeGeometry args={[curve2, 64, 0.1, 8, false]} />
                    <meshStandardMaterial color="#10b981" />
                </mesh>
                <Text position={[0, 0, 0]} fontSize={0.5} color="black">Hyperbola</Text>
            </group>
        );
    }

    return null;
};

export const CoordinateGeometry3D: React.FC = () => {
    const navigate = useNavigate();
    const [shape, setShape] = useState<'parabola' | 'ellipse' | 'hyperbola'>('parabola');

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex items-center gap-4 shrink-0">
                <Button variant="ghost" onClick={() => navigate('/math')} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-display font-black text-brand-black">Coordinate Geometry</h1>
                    <p className="text-sm text-gray-500 font-bold">Conic Sections in 3D</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card className="bg-emerald-50 border-emerald-200">
                        <div className="flex flex-col items-center text-center gap-4">
                            <Box className="w-12 h-12 text-emerald-500" />
                            <p className="text-sm leading-relaxed text-brand-black font-bold">
                                "Conic sections are curves obtained by slicing a cone. Explore Parabolas, Ellipses, and Hyperbolas."
                            </p>
                        </div>
                    </Card>

                    <Card className="flex-1 space-y-6">
                        <div>
                            <h3 className="font-black text-brand-black mb-4">Select Shape</h3>
                            <div className="space-y-2">
                                <Button
                                    variant={shape === 'parabola' ? 'primary' : 'outline'}
                                    className="w-full justify-between"
                                    onClick={() => setShape('parabola')}
                                >
                                    Parabola
                                </Button>
                                <Button
                                    variant={shape === 'ellipse' ? 'primary' : 'outline'}
                                    className="w-full justify-between"
                                    onClick={() => setShape('ellipse')}
                                >
                                    Ellipse
                                </Button>
                                <Button
                                    variant={shape === 'hyperbola' ? 'primary' : 'outline'}
                                    className="w-full justify-between"
                                    onClick={() => setShape('hyperbola')}
                                >
                                    Hyperbola
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 h-[500px] lg:h-auto rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white relative">
                    <Canvas shadows camera={{ position: [0, 0, 15], fov: 50 }}>
                        <color attach="background" args={['#f8fafc']} />
                        <ambientLight intensity={0.8} />
                        <pointLight position={[10, 10, 10]} intensity={1} />

                        <OrbitControls enablePan={true} minDistance={5} maxDistance={20} />
                        <Grid infiniteGrid fadeDistance={30} sectionColor="#cbd5e1" cellColor="#e2e8f0" />

                        <ConicShape type={shape} />
                    </Canvas>
                </div>
            </div>
        </div>
    );
};
