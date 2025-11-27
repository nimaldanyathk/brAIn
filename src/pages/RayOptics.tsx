import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Line, Environment, MeshTransmissionMaterial, RoundedBox } from '@react-three/drei';
import { ArrowLeft, Settings, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Slider } from '../components/ui/Slider';
import * as THREE from 'three';

// Types
type OpticalElement = 'concave-mirror' | 'convex-mirror' | 'convex-lens' | 'concave-lens';

interface RayOpticsProps { }

const Stand = () => (
    <group position={[0, -2.2, 0]}>
        {/* Base */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.8, 1, 0.2, 32]} />
            <meshStandardMaterial color="#333" roughness={0.5} metalness={0.8} />
        </mesh>
        {/* Rod */}
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.1, 0.1, 2.2, 16]} />
            <meshStandardMaterial color="#888" roughness={0.2} metalness={1} />
        </mesh>
        {/* Holder */}
        <mesh position={[0, 2.2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <torusGeometry args={[2.1, 0.1, 16, 100]} />
            <meshStandardMaterial color="#333" roughness={0.5} metalness={0.8} />
        </mesh>
    </group>
);

const OpticalElementMesh = ({ type }: { type: OpticalElement }) => {
    return (
        <group>
            <Stand />
            {type === 'concave-mirror' && (
                <group rotation={[0, Math.PI / 2, 0]}>
                    <mesh castShadow receiveShadow>
                        <sphereGeometry args={[2, 64, 32, 0, Math.PI * 2, 0, 0.5]} />
                        <meshStandardMaterial color="#silver" metalness={1} roughness={0.05} side={THREE.DoubleSide} />
                    </mesh>
                    <mesh position={[0, 0, -0.05]}>
                        <sphereGeometry args={[2.1, 64, 32, 0, Math.PI * 2, 0, 0.5]} />
                        <meshStandardMaterial color="#222" side={THREE.BackSide} roughness={0.8} />
                    </mesh>
                </group>
            )}
            {type === 'convex-mirror' && (
                <group rotation={[0, -Math.PI / 2, 0]}>
                    <mesh castShadow receiveShadow>
                        <sphereGeometry args={[2, 64, 32, 0, Math.PI * 2, 0, 0.5]} />
                        <meshStandardMaterial color="#silver" metalness={1} roughness={0.05} side={THREE.DoubleSide} />
                    </mesh>
                    <mesh position={[0, 0, -0.05]}>
                        <sphereGeometry args={[2.05, 64, 32, 0, Math.PI * 2, 0, 0.5]} />
                        <meshStandardMaterial color="#222" side={THREE.BackSide} roughness={0.8} />
                    </mesh>
                </group>
            )}
            {type === 'convex-lens' && (
                <group rotation={[0, 0, Math.PI / 2]} scale={[0.3, 1, 1]}>
                    <mesh castShadow receiveShadow>
                        <sphereGeometry args={[2, 64, 64]} />
                        <MeshTransmissionMaterial
                            backside
                            thickness={1}
                            roughness={0}
                            transmission={1}
                            ior={1.5}
                            chromaticAberration={0.06}
                            anisotropy={0.1}
                        />
                    </mesh>
                </group>
            )}
            {type === 'concave-lens' && (
                <group rotation={[0, Math.PI / 2, 0]}>
                    <mesh castShadow receiveShadow>
                        <cylinderGeometry args={[2, 2, 0.4, 64]} />
                        <MeshTransmissionMaterial
                            backside
                            thickness={0.5}
                            roughness={0}
                            transmission={1}
                            ior={1.5}
                            chromaticAberration={0.06}
                        />
                    </mesh>
                    {/* Visual trick for concave shape */}
                    <mesh position={[0, 0.25, 0]}>
                        <cylinderGeometry args={[1.8, 1.8, 0.15, 64]} />
                        <meshStandardMaterial color="#a0e0ff" transparent opacity={0.1} />
                    </mesh>
                    <mesh position={[0, -0.25, 0]}>
                        <cylinderGeometry args={[1.8, 1.8, 0.15, 64]} />
                        <meshStandardMaterial color="#a0e0ff" transparent opacity={0.1} />
                    </mesh>
                </group>
            )}
        </group>
    );
};

const LaserBox = ({ position }: { position: [number, number, number] }) => (
    <group position={position}>
        <RoundedBox args={[0.5, 2.5, 1]} radius={0.1} castShadow receiveShadow>
            <meshStandardMaterial color="#222" roughness={0.4} metalness={0.6} />
        </RoundedBox>
        {/* Laser Apertures */}
        <mesh position={[0.26, 1, 0]}>
            <circleGeometry args={[0.05, 16]} />
            <meshBasicMaterial color="red" toneMapped={false} />
        </mesh>
        <mesh position={[0.26, 0, 0]}>
            <circleGeometry args={[0.05, 16]} />
            <meshBasicMaterial color="orange" toneMapped={false} />
        </mesh>
    </group>
);

const RayDiagram = ({ type, objectPos, focalLength = 2 }: { type: OpticalElement, objectPos: number, focalLength?: number }) => {
    const h = 1;
    const u = -objectPos;
    let v = 0;
    let hi = 0;
    let f = focalLength;

    if (type === 'concave-mirror') {
        f = -focalLength;
        if (u !== f) {
            v = 1 / ((1 / f) - (1 / u));
            hi = -(v / u) * h;
        }
    } else if (type === 'convex-mirror') {
        f = focalLength;
        v = 1 / ((1 / f) - (1 / u));
        hi = -(v / u) * h;
    } else if (type === 'convex-lens') {
        f = focalLength;
        v = 1 / ((1 / f) + (1 / u));
        hi = (v / u) * h;
    } else if (type === 'concave-lens') {
        f = -focalLength;
        v = 1 / ((1 / f) + (1 / u));
        hi = (v / u) * h;
    }

    const rays = [];
    const rayWidth = 3;

    // Ray 1: Parallel (Red)
    rays.push(
        <Line points={[[u, h, 0], [0, h, 0]]} color="red" lineWidth={rayWidth} toneMapped={false} />
    );

    if (type.includes('mirror')) {
        rays.push(<Line points={[[0, h, 0], [v, hi, 0]]} color="red" lineWidth={rayWidth} toneMapped={false} />);
        if (v > 0 && type === 'concave-mirror') rays.push(<Line points={[[0, h, 0], [v, hi, 0]]} color="red" lineWidth={1} dashed opacity={0.5} transparent />);
        if (type === 'convex-mirror') rays.push(<Line points={[[0, h, 0], [v, hi, 0]]} color="red" lineWidth={1} dashed opacity={0.5} transparent />);
    } else {
        rays.push(<Line points={[[0, h, 0], [v, hi, 0]]} color="red" lineWidth={rayWidth} toneMapped={false} />);
    }

    // Ray 2: Center (Orange)
    rays.push(
        <Line points={[[u, 0, 0], [0, 0, 0]]} color="orange" lineWidth={rayWidth} toneMapped={false} />
    );
    if (type.includes('mirror')) {
        rays.push(<Line points={[[0, 0, 0], [v, hi, 0]]} color="orange" lineWidth={rayWidth} toneMapped={false} />);
    } else {
        rays.push(<Line points={[[0, 0, 0], [v, hi, 0]]} color="orange" lineWidth={rayWidth} toneMapped={false} />);
    }

    return (
        <group>
            {/* Laser Source Model */}
            <LaserBox position={[u - 0.25, 0, 0]} />

            {/* Object Arrow (Visual only, aligned with laser box) */}
            <Line points={[[u, 0, 0], [u, h, 0]]} color="#444" lineWidth={1} dashed opacity={0.3} transparent />

            {/* Image Marker */}
            <group position={[v, hi / 2, 0]}>
                <mesh>
                    <cylinderGeometry args={[0.05, 0.05, Math.abs(hi), 8]} />
                    <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
                </mesh>
                <Html position={[0, hi > 0 ? hi / 2 + 0.2 : -hi / 2 - 0.2, 0]}>
                    <div className="bg-green-500/90 backdrop-blur text-white text-xs px-2 py-1 rounded shadow-lg">Image</div>
                </Html>
            </group>

            {/* Rays */}
            {rays.map((ray, i) => <React.Fragment key={i}>{ray}</React.Fragment>)}
        </group>
    );
};

export const RayOptics: React.FC<RayOpticsProps> = () => {
    const navigate = useNavigate();
    const [element, setElement] = useState<OpticalElement>('concave-mirror');
    const [objectPos, setObjectPos] = useState(4);

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex items-center gap-4 shrink-0">
                <Button variant="ghost" onClick={() => navigate('/physix')} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-display font-black text-brand-black">Ray Optics Lab</h1>
                    <p className="text-sm text-gray-500 font-bold">Advanced Simulation Environment</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card className="flex-1">
                        <h2 className="text-lg font-black text-brand-black flex items-center gap-2 mb-6">
                            <Settings className="w-5 h-5 text-brand-blue" />
                            Lab Controls
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Optical Element</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['concave-mirror', 'convex-mirror', 'convex-lens', 'concave-lens'] as OpticalElement[]).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setElement(type)}
                                            className={`p-2 text-sm rounded-lg border-2 transition-all capitalize ${element === type
                                                ? 'bg-brand-blue text-white border-brand-blue'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue'
                                                }`}
                                        >
                                            {type.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Slider
                                    label="Source Position"
                                    value={objectPos}
                                    min={1.5}
                                    max={8}
                                    step={0.1}
                                    unit="cm"
                                    onChange={(v) => setObjectPos(v)}
                                />
                                <p className="text-xs text-gray-400 mt-2">
                                    Slide to move the laser source along the optical bench.
                                </p>
                            </div>
                            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                                <div className="flex items-start gap-2">
                                    <Info className="w-4 h-4 text-yellow-500 mt-0.5" />
                                    <p className="text-xs text-gray-300 leading-relaxed">
                                        <strong>Lab Note:</strong> <br />
                                        Observe how the laser beams interact with the {element.replace('-', ' ')}.
                                        Real-time ray tracing is active.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 h-[500px] lg:h-auto">
                    <Card className="h-full bg-black p-0 overflow-hidden relative border-4 border-gray-800 shadow-2xl">
                        <Canvas shadows camera={{ position: [5, 5, 12], fov: 45 }}>
                            <color attach="background" args={['#050505']} />

                            {/* Lighting */}
                            <ambientLight intensity={0.2} />
                            <spotLight
                                position={[10, 15, 10]}
                                angle={0.3}
                                penumbra={0.5}
                                intensity={2}
                                castShadow
                                shadow-bias={-0.0001}
                            />
                            <Environment preset="city" />

                            <group position={[0, 0, 0]}>
                                {/* Table Surface */}
                                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
                                    <planeGeometry args={[50, 50]} />
                                    <meshStandardMaterial color="#3d2817" roughness={0.6} metalness={0.1} />
                                </mesh>

                                {/* Optical Bench Rail */}
                                <mesh position={[0, -2.45, 0]} receiveShadow>
                                    <boxGeometry args={[20, 0.1, 1]} />
                                    <meshStandardMaterial color="#111" roughness={0.4} metalness={0.8} />
                                </mesh>
                                <mesh position={[0, -2.4, 0]} receiveShadow>
                                    <boxGeometry args={[20, 0.05, 0.2]} />
                                    <meshStandardMaterial color="#silver" roughness={0.2} metalness={0.9} />
                                </mesh>

                                {/* Element */}
                                <OpticalElementMesh type={element} />

                                {/* Ray Diagram */}
                                <RayDiagram type={element} objectPos={objectPos} />
                            </group>

                            <OrbitControls
                                enablePan={true}
                                enableZoom={true}
                                minPolarAngle={0}
                                maxPolarAngle={Math.PI / 2.2} // Don't go below table
                                maxDistance={20}
                            />
                        </Canvas>
                    </Card>
                </div>
            </div>
        </div>
    );
};
