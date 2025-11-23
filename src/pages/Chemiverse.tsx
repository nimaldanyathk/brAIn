import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Astra } from '../components/Astra';

// Molecule Data
const MOLECULES = {
    water: {
        name: "Water (H₂O)",
        description: "The elixir of life! Two hydrogen atoms bonded to one oxygen atom.",
        atoms: [
            { position: [0, 0, 0], color: "#ef4444", size: 0.6, label: "O" }, // Oxygen
            { position: [0.8, 0.6, 0], color: "#f5f5f5", size: 0.3, label: "H" }, // Hydrogen
            { position: [-0.8, 0.6, 0], color: "#f5f5f5", size: 0.3, label: "H" }, // Hydrogen
        ],
        bonds: [
            { start: [0, 0, 0], end: [0.8, 0.6, 0] },
            { start: [0, 0, 0], end: [-0.8, 0.6, 0] },
        ]
    },
    co2: {
        name: "Carbon Dioxide (CO₂)",
        description: "A greenhouse gas. One carbon atom double-bonded to two oxygen atoms.",
        atoms: [
            { position: [0, 0, 0], color: "#1d1d1f", size: 0.5, label: "C" }, // Carbon
            { position: [1.2, 0, 0], color: "#ef4444", size: 0.5, label: "O" }, // Oxygen
            { position: [-1.2, 0, 0], color: "#ef4444", size: 0.5, label: "O" }, // Oxygen
        ],
        bonds: [
            { start: [0, 0, 0], end: [1.2, 0, 0] },
            { start: [0, 0, 0], end: [-1.2, 0, 0] },
        ]
    },
    methane: {
        name: "Methane (CH₄)",
        description: "The simplest hydrocarbon. One carbon atom bonded to four hydrogen atoms.",
        atoms: [
            { position: [0, 0, 0], color: "#1d1d1f", size: 0.5, label: "C" }, // Carbon
            { position: [0.8, 0.8, 0.8], color: "#f5f5f5", size: 0.3, label: "H" }, // Hydrogen
            { position: [-0.8, -0.8, 0.8], color: "#f5f5f5", size: 0.3, label: "H" }, // Hydrogen
            { position: [0.8, -0.8, -0.8], color: "#f5f5f5", size: 0.3, label: "H" }, // Hydrogen
            { position: [-0.8, 0.8, -0.8], color: "#f5f5f5", size: 0.3, label: "H" }, // Hydrogen
        ],
        bonds: [
            { start: [0, 0, 0], end: [0.8, 0.8, 0.8] },
            { start: [0, 0, 0], end: [-0.8, -0.8, 0.8] },
            { start: [0, 0, 0], end: [0.8, -0.8, -0.8] },
            { start: [0, 0, 0], end: [-0.8, 0.8, -0.8] },
        ]
    }
};

const AtomMesh = ({ position, color, size, label }: any) => (
    <group position={position}>
        <Sphere args={[size, 32, 32]}>
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
        </Sphere>
        <Html position={[0, size + 0.2, 0]} center>
            <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-md font-bold backdrop-blur-sm">
                {label}
            </div>
        </Html>
    </group>
);

const BondMesh = ({ start, end }: any) => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const mid = startVec.clone().add(endVec).multiplyScalar(0.5);
    const length = startVec.distanceTo(endVec);

    // Calculate rotation to align cylinder with bond direction
    const direction = endVec.clone().sub(startVec).normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

    return (
        <mesh position={mid} quaternion={quaternion}>
            <cylinderGeometry args={[0.1, 0.1, length, 16]} />
            <meshStandardMaterial color="#9ca3af" />
        </mesh>
    );
};

import * as THREE from 'three';

const MoleculeScene = ({ molecule }: { molecule: keyof typeof MOLECULES }) => {
    const data = MOLECULES[molecule];

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <directionalLight position={[-5, 5, 5]} intensity={0.5} />

            <group>
                {data.atoms.map((atom, i) => (
                    <AtomMesh key={i} {...atom} />
                ))}
                {data.bonds.map((bond, i) => (
                    <BondMesh key={i} {...bond} />
                ))}
            </group>

            <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />
        </>
    );
};

export const Chemiverse: React.FC = () => {
    const navigate = useNavigate();
    const [activeMolecule, setActiveMolecule] = useState<keyof typeof MOLECULES>('water');

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-4 shrink-0">
                <Button variant="ghost" onClick={() => navigate('/')} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-display font-black text-brand-black">Chemiverse</h1>
                    <p className="text-sm text-gray-500 font-bold">Molecular Explorer</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Left Panel: Controls */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card className="bg-green-50 border-green-200">
                        <div className="flex flex-col items-center text-center gap-4">
                            <Astra context="chemistry" size="sm" />
                            <p className="text-sm leading-relaxed text-brand-black font-bold">
                                "Welcome to the atomic level! Select a molecule to inspect its 3D structure."
                            </p>
                        </div>
                    </Card>

                    <Card className="flex-1">
                        <h2 className="text-lg font-black text-brand-black flex items-center gap-2 mb-4">
                            <FlaskConical className="w-5 h-5 text-green-600" />
                            Select Molecule
                        </h2>
                        <div className="flex flex-col gap-3">
                            {(Object.keys(MOLECULES) as Array<keyof typeof MOLECULES>).map((key) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveMolecule(key)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${activeMolecule === key
                                        ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                        : 'bg-white text-brand-black border-gray-200 hover:border-black'
                                        }`}
                                >
                                    <div className="font-bold">{MOLECULES[key].name}</div>
                                    <div className={`text-xs mt-1 ${activeMolecule === key ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {MOLECULES[key].description}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Panel: 3D View */}
                <div className="lg:col-span-2 h-[500px] lg:h-auto">
                    <Card className="h-full bg-gray-50 p-0 overflow-hidden relative border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <span className="text-xs font-black uppercase tracking-wider text-gray-500">Viewing</span>
                            <div className="font-bold text-brand-black">{MOLECULES[activeMolecule].name}</div>
                        </div>

                        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                            <Suspense fallback={null}>
                                <MoleculeScene molecule={activeMolecule} />
                            </Suspense>
                        </Canvas>
                    </Card>
                </div>
            </div>
        </div>
    );
};
