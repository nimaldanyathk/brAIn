import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Card } from '../../../../components/ui/Card';

const HYBRIDIZATIONS = {
    sp: { name: 'sp', s: 1, p: 1, d: 0, geometry: 'Linear', angle: '180°', color: '#ef4444' },
    sp2: { name: 'sp2', s: 1, p: 2, d: 0, geometry: 'Trigonal Planar', angle: '120°', color: '#f97316' },
    sp3: { name: 'sp3', s: 1, p: 3, d: 0, geometry: 'Tetrahedral', angle: '109.5°', color: '#eab308' },
    dsp3: { name: 'dsp3', s: 1, p: 3, d: 1, geometry: 'Trigonal Bipyramidal', angle: '90°, 120°', color: '#22c55e' },
    d2sp3: { name: 'd2sp3', s: 1, p: 3, d: 2, geometry: 'Octahedral', angle: '90°', color: '#3b82f6' },
};

const OrbitalLobe = ({ position, rotation, color, scale = 1, opacity = 0.6 }: any) => (
    <group position={position} rotation={rotation} scale={scale}>
        {/* Main Lobe */}
        <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Small Lobe (for p-orbital look, or hybrid back lobe) */}
        <mesh position={[0, -0.3, 0]} scale={0.3}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.2} metalness={0.1} />
        </mesh>
    </group>
);

const HybridizationScene = ({ type }: { type: keyof typeof HYBRIDIZATIONS }) => {
    const group = useRef<THREE.Group>(null);
    const [animate] = useState(true);

    useFrame(() => {
        if (group.current && animate) {
            group.current.rotation.y += 0.002;
        }
    });

    const getLobes = (t: keyof typeof HYBRIDIZATIONS) => {
        const lobes = [];
        const color = HYBRIDIZATIONS[t].color;
        
        if (t === 'sp') {
            lobes.push(
                <OrbitalLobe key="1" rotation={[0, 0, Math.PI/2]} color={color} />,
                <OrbitalLobe key="2" rotation={[0, 0, -Math.PI/2]} color={color} />
            );
        } else if (t === 'sp2') {
            for(let i=0; i<3; i++) {
                const angle = (i * 2 * Math.PI) / 3;
                lobes.push(<OrbitalLobe key={i} rotation={[0, 0, angle]} color={color} />);
            }
        } else if (t === 'sp3') {
            // Tetrahedral arrangement
            const angle = 109.5 * Math.PI / 180;
            lobes.push(
                <OrbitalLobe key="1" rotation={[0, 0, 0]} color={color} />,
                <OrbitalLobe key="2" rotation={[angle, 0, 0]} color={color} />,
                <OrbitalLobe key="3" rotation={[angle, (2*Math.PI)/3, 0]} color={color} />,
                <OrbitalLobe key="4" rotation={[angle, -(2*Math.PI)/3, 0]} color={color} />
            );
        } else if (t === 'dsp3') {
             // Trigonal Bipyramidal
             for(let i=0; i<3; i++) {
                const a = (i * 2 * Math.PI) / 3;
                lobes.push(<OrbitalLobe key={`eq-${i}`} rotation={[Math.PI/2, a, 0]} color={color} />);
            }
            lobes.push(
                <OrbitalLobe key="ax-1" rotation={[0, 0, 0]} color={color} />,
                <OrbitalLobe key="ax-2" rotation={[Math.PI, 0, 0]} color={color} />
            );
        } else if (t === 'd2sp3') {
            // Octahedral
            lobes.push(
                <OrbitalLobe key="1" rotation={[0, 0, 0]} color={color} />,
                <OrbitalLobe key="2" rotation={[Math.PI, 0, 0]} color={color} />,
                <OrbitalLobe key="3" rotation={[Math.PI/2, 0, 0]} color={color} />,
                <OrbitalLobe key="4" rotation={[-Math.PI/2, 0, 0]} color={color} />,
                <OrbitalLobe key="5" rotation={[0, 0, Math.PI/2]} color={color} />,
                <OrbitalLobe key="6" rotation={[0, 0, -Math.PI/2]} color={color} />
            );
        }

        return lobes;
    };

    return (
        <group ref={group}>
            {/* Nucleus */}
            <mesh>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            
            {/* Hybrid Orbitals */}
            {getLobes(type)}
        </group>
    );
};

export const Hybridization = () => {
    const [activeType, setActiveType] = useState<keyof typeof HYBRIDIZATIONS>('sp3');

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="lg:col-span-1 flex flex-col gap-4">
                <Card className="p-4 bg-white border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-gray-900">Orbital Hybridization</h3>
                    <div className="flex flex-col gap-2">
                        {(Object.entries(HYBRIDIZATIONS) as [keyof typeof HYBRIDIZATIONS, typeof HYBRIDIZATIONS['sp']][]).map(([key, data]) => (
                            <button
                                key={key}
                                onClick={() => setActiveType(key)}
                                className={`p-3 rounded-lg text-left transition-all border ${
                                    activeType === key
                                    ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm'
                                    : 'bg-white border-gray-100 hover:bg-gray-50 text-gray-600'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm">{data.name.split(/(\d+)/).map((part, i) => i % 2 === 1 ? <sup key={i}>{part}</sup> : part)}</span>
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">{data.geometry}</span>
                                </div>
                                <div className="text-xs opacity-70 mt-1">
                                    s: {data.s} | p: {data.p} {data.d > 0 && `| d: ${data.d}`}
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>
                
                <Card className="p-4 bg-purple-50 border-purple-100">
                    <h4 className="font-bold text-purple-800 text-sm mb-2">Concept</h4>
                    <p className="text-xs text-purple-700 leading-relaxed">
                        Hybridization is the concept of mixing atomic orbitals into new hybrid orbitals (with different energies, shapes, etc.) suitable for the pairing of electrons to form chemical bonds in valence bond theory.
                    </p>
                </Card>
            </div>

            {/* 3D View */}
            <div className="lg:col-span-2 h-[400px] lg:h-auto relative">
                <Card className="h-full p-0 overflow-hidden border-gray-200 shadow-md bg-gray-50">
                    <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
                        <ambientLight intensity={0.6} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} />
                        <HybridizationScene type={activeType} />
                        <OrbitControls enableZoom={true} />
                    </Canvas>
                </Card>
            </div>
        </div>
    );
};


