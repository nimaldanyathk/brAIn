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
    // Linear
    hf: {
        name: "Hydrogen Fluoride (HF)",
        description: "Linear molecule. Used in etching glass.",
        atoms: [
            { position: [0.5, 0, 0], color: "#f5f5f5", size: 0.3, label: "H" },
            { position: [-0.4, 0, 0], color: "#90e0ef", size: 0.6, label: "F" },
        ],
        bonds: [{ start: [0.5, 0, 0], end: [-0.4, 0, 0] }]
    },
    hcl: {
        name: "Hydrogen Chloride (HCl)",
        description: "Linear molecule. Major component of stomach acid.",
        atoms: [
            { position: [0.6, 0, 0], color: "#f5f5f5", size: 0.3, label: "H" },
            { position: [-0.5, 0, 0], color: "#1f7a1f", size: 0.7, label: "Cl" },
        ],
        bonds: [{ start: [0.6, 0, 0], end: [-0.5, 0, 0] }]
    },
    hbr: {
        name: "Hydrogen Bromide (HBr)",
        description: "Linear molecule. Used to produce bromides.",
        atoms: [
            { position: [0.7, 0, 0], color: "#f5f5f5", size: 0.3, label: "H" },
            { position: [-0.6, 0, 0], color: "#7f0000", size: 0.75, label: "Br" },
        ],
        bonds: [{ start: [0.7, 0, 0], end: [-0.6, 0, 0] }]
    },
    hi: {
        name: "Hydrogen Iodide (HI)",
        description: "Linear molecule. Strong acid used in organic synthesis.",
        atoms: [
            { position: [0.8, 0, 0], color: "#f5f5f5", size: 0.3, label: "H" },
            { position: [-0.7, 0, 0], color: "#9400d3", size: 0.8, label: "I" },
        ],
        bonds: [{ start: [0.8, 0, 0], end: [-0.7, 0, 0] }]
    },
    h2: {
        name: "Hydrogen (H₂)",
        description: "Linear molecule. The most abundant element in the universe.",
        atoms: [
            { position: [0.4, 0, 0], color: "#f5f5f5", size: 0.3, label: "H" },
            { position: [-0.4, 0, 0], color: "#f5f5f5", size: 0.3, label: "H" },
        ],
        bonds: [{ start: [0.4, 0, 0], end: [-0.4, 0, 0] }]
    },
    co2: {
        name: "Carbon Dioxide (CO₂)",
        description: "Linear molecule. A greenhouse gas.",
        atoms: [
            { position: [0, 0, 0], color: "#1d1d1f", size: 0.5, label: "C" },
            { position: [1.2, 0, 0], color: "#ef4444", size: 0.5, label: "O" },
            { position: [-1.2, 0, 0], color: "#ef4444", size: 0.5, label: "O" },
        ],
        bonds: [
            { start: [0, 0, 0], end: [1.2, 0, 0] },
            { start: [0, 0, 0], end: [-1.2, 0, 0] },
        ]
    },

    // Bent
    water: {
        name: "Water (H₂O)",
        description: "Bent molecule. The elixir of life!",
        atoms: [
            { position: [0, 0.1, 0], color: "#ef4444", size: 0.6, label: "O" },
            { position: [0.8, -0.4, 0], color: "#f5f5f5", size: 0.3, label: "H" },
            { position: [-0.8, -0.4, 0], color: "#f5f5f5", size: 0.3, label: "H" },
        ],
        bonds: [
            { start: [0, 0.1, 0], end: [0.8, -0.4, 0] },
            { start: [0, 0.1, 0], end: [-0.8, -0.4, 0] },
        ]
    },
    h2s: {
        name: "Hydrogen Sulfide (H₂S)",
        description: "Bent molecule. Smells like rotten eggs.",
        atoms: [
            { position: [0, 0.1, 0], color: "#ffd700", size: 0.65, label: "S" },
            { position: [0.9, -0.4, 0], color: "#f5f5f5", size: 0.3, label: "H" },
            { position: [-0.9, -0.4, 0], color: "#f5f5f5", size: 0.3, label: "H" },
        ],
        bonds: [
            { start: [0, 0.1, 0], end: [0.9, -0.4, 0] },
            { start: [0, 0.1, 0], end: [-0.9, -0.4, 0] },
        ]
    },

    // Trigonal Pyramidal
    nh3: {
        name: "Ammonia (NH₃)",
        description: "Trigonal Pyramidal. Used in fertilizers.",
        atoms: [
            { position: [0, 0.2, 0], color: "#0000ff", size: 0.6, label: "N" },
            { position: [0.8, -0.4, 0], color: "#f5f5f5", size: 0.3, label: "H" },
            { position: [-0.4, -0.4, 0.7], color: "#f5f5f5", size: 0.3, label: "H" },
            { position: [-0.4, -0.4, -0.7], color: "#f5f5f5", size: 0.3, label: "H" },
        ],
        bonds: [
            { start: [0, 0.2, 0], end: [0.8, -0.4, 0] },
            { start: [0, 0.2, 0], end: [-0.4, -0.4, 0.7] },
            { start: [0, 0.2, 0], end: [-0.4, -0.4, -0.7] },
        ]
    },
    nf3: {
        name: "Nitrogen Trifluoride (NF₃)",
        description: "Trigonal Pyramidal. Greenhouse gas.",
        atoms: [
            { position: [0, 0.2, 0], color: "#0000ff", size: 0.6, label: "N" },
            { position: [0.9, -0.4, 0], color: "#90e0ef", size: 0.4, label: "F" },
            { position: [-0.45, -0.4, 0.8], color: "#90e0ef", size: 0.4, label: "F" },
            { position: [-0.45, -0.4, -0.8], color: "#90e0ef", size: 0.4, label: "F" },
        ],
        bonds: [
            { start: [0, 0.2, 0], end: [0.9, -0.4, 0] },
            { start: [0, 0.2, 0], end: [-0.45, -0.4, 0.8] },
            { start: [0, 0.2, 0], end: [-0.45, -0.4, -0.8] },
        ]
    },

    // Trigonal Planar
    bf3: {
        name: "Boron Trifluoride (BF₃)",
        description: "Trigonal Planar. Lewis acid.",
        atoms: [
            { position: [0, 0, 0], color: "#ffb6c1", size: 0.5, label: "B" },
            { position: [0, 1.2, 0], color: "#90e0ef", size: 0.4, label: "F" },
            { position: [1.04, -0.6, 0], color: "#90e0ef", size: 0.4, label: "F" },
            { position: [-1.04, -0.6, 0], color: "#90e0ef", size: 0.4, label: "F" },
        ],
        bonds: [
            { start: [0, 0, 0], end: [0, 1.2, 0] },
            { start: [0, 0, 0], end: [1.04, -0.6, 0] },
            { start: [0, 0, 0], end: [-1.04, -0.6, 0] },
        ]
    },

    // Tetrahedral
    methane: {
        name: "Methane (CH₄)",
        description: "Tetrahedral. Simplest hydrocarbon.",
        atoms: [
            { position: [0, 0, 0], color: "#1d1d1f", size: 0.5, label: "C" },
            { position: [0.6, 0.6, 0.6], color: "#f5f5f5", size: 0.3, label: "H" },
            { position: [-0.6, -0.6, 0.6], color: "#f5f5f5", size: 0.3, label: "H" },
            { position: [0.6, -0.6, -0.6], color: "#f5f5f5", size: 0.3, label: "H" },
            { position: [-0.6, 0.6, -0.6], color: "#f5f5f5", size: 0.3, label: "H" },
        ],
        bonds: [
            { start: [0, 0, 0], end: [0.6, 0.6, 0.6] },
            { start: [0, 0, 0], end: [-0.6, -0.6, 0.6] },
            { start: [0, 0, 0], end: [0.6, -0.6, -0.6] },
            { start: [0, 0, 0], end: [-0.6, 0.6, -0.6] },
        ]
    },
    chcl3: {
        name: "Chloroform (CHCl₃)",
        description: "Tetrahedral. Formerly used as anesthetic.",
        atoms: [
            { position: [0, 0, 0], color: "#1d1d1f", size: 0.5, label: "C" },
            { position: [0, 0.8, 0], color: "#f5f5f5", size: 0.3, label: "H" },
            { position: [0.94, -0.33, 0], color: "#1f7a1f", size: 0.5, label: "Cl" },
            { position: [-0.47, -0.33, 0.82], color: "#1f7a1f", size: 0.5, label: "Cl" },
            { position: [-0.47, -0.33, -0.82], color: "#1f7a1f", size: 0.5, label: "Cl" },
        ],
        bonds: [
            { start: [0, 0, 0], end: [0, 0.8, 0] },
            { start: [0, 0, 0], end: [0.94, -0.33, 0] },
            { start: [0, 0, 0], end: [-0.47, -0.33, 0.82] },
            { start: [0, 0, 0], end: [-0.47, -0.33, -0.82] },
        ]
    },
    ccl4: {
        name: "Carbon Tetrachloride (CCl₄)",
        description: "Tetrahedral. Cleaning agent.",
        atoms: [
            { position: [0, 0, 0], color: "#1d1d1f", size: 0.5, label: "C" },
            { position: [0.8, 0.8, 0.8], color: "#1f7a1f", size: 0.5, label: "Cl" },
            { position: [-0.8, -0.8, 0.8], color: "#1f7a1f", size: 0.5, label: "Cl" },
            { position: [0.8, -0.8, -0.8], color: "#1f7a1f", size: 0.5, label: "Cl" },
            { position: [-0.8, 0.8, -0.8], color: "#1f7a1f", size: 0.5, label: "Cl" },
        ],
        bonds: [
            { start: [0, 0, 0], end: [0.8, 0.8, 0.8] },
            { start: [0, 0, 0], end: [-0.8, -0.8, 0.8] },
            { start: [0, 0, 0], end: [0.8, -0.8, -0.8] },
            { start: [0, 0, 0], end: [-0.8, 0.8, -0.8] },
        ]
    },
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

                        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
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
