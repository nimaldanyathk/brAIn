import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { FlaskConical } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Slider } from '../../components/ui/Slider';
import { Astra } from '../../components/Astra';

const MOLECULES = {
    ch4: {
        name: "Methane (CH₄)",
        description: "Tetrahedral. Angle: 109.5°",
        formula: "CH4",
        angle: 109.5,
        atoms: [
            { position: [0, 0, 0], color: "#1d1d1f", size: 0.4, label: "C" },
            { position: [0.6, 0.6, 0.6], color: "#f5f5f5", size: 0.25, label: "H" },
            { position: [-0.6, -0.6, 0.6], color: "#f5f5f5", size: 0.25, label: "H" },
            { position: [0.6, -0.6, -0.6], color: "#f5f5f5", size: 0.25, label: "H" },
            { position: [-0.6, 0.6, -0.6], color: "#f5f5f5", size: 0.25, label: "H" },
        ],
        bonds: [
            { start: [0, 0, 0], end: [0.6, 0.6, 0.6] },
            { start: [0, 0, 0], end: [-0.6, -0.6, 0.6] },
            { start: [0, 0, 0], end: [0.6, -0.6, -0.6] },
            { start: [0, 0, 0], end: [-0.6, 0.6, -0.6] },
        ]
    },
    co2: {
        name: "Carbon Dioxide (CO₂)",
        description: "Linear. Angle: 180°",
        formula: "CO2",
        angle: 180,
        atoms: [
            { position: [0, 0, 0], color: "#1d1d1f", size: 0.4, label: "C" },
            { position: [1.2, 0, 0], color: "#ff0d0d", size: 0.35, label: "O" },
            { position: [-1.2, 0, 0], color: "#ff0d0d", size: 0.35, label: "O" },
        ],
        bonds: [
            { start: [0, 0, 0], end: [1.2, 0, 0], double: true },
            { start: [0, 0, 0], end: [-1.2, 0, 0], double: true },
        ]
    },
    nh3: {
        name: "Ammonia (NH₃)",
        description: "Trigonal Pyramidal. Angle: 107°",
        formula: "NH3",
        angle: 107,
        atoms: [
            { position: [0, 0.1, 0], color: "#3050f8", size: 0.4, label: "N" },
            { position: [0.6, -0.3, 0], color: "#f5f5f5", size: 0.25, label: "H" },
            { position: [-0.3, -0.3, 0.52], color: "#f5f5f5", size: 0.25, label: "H" },
            { position: [-0.3, -0.3, -0.52], color: "#f5f5f5", size: 0.25, label: "H" },
        ],
        bonds: [
            { start: [0, 0.1, 0], end: [0.6, -0.3, 0] },
            { start: [0, 0.1, 0], end: [-0.3, -0.3, 0.52] },
            { start: [0, 0.1, 0], end: [-0.3, -0.3, -0.52] },
        ]
    },
    h2o: {
        name: "Water (H₂O)",
        description: "Bent. Angle: 104.5°",
        formula: "H2O",
        angle: 104.5,
        atoms: [
            { position: [0, 0, 0], color: "#ff0d0d", size: 0.4, label: "O" },
            { position: [0.8, -0.4, 0], color: "#f5f5f5", size: 0.25, label: "H" },
            { position: [-0.8, -0.4, 0], color: "#f5f5f5", size: 0.25, label: "H" },
        ],
        bonds: [
            { start: [0, 0, 0], end: [0.8, -0.4, 0] },
            { start: [0, 0, 0], end: [-0.8, -0.4, 0] },
        ]
    },
    sf6: {
        name: "Sulfur Hexafluoride (SF₆)",
        description: "Octahedral. Angle: 90°",
        formula: "SF6",
        angle: 90,
        atoms: [
            { position: [0, 0, 0], color: "#ffff30", size: 0.45, label: "S" },
            { position: [1, 0, 0], color: "#90e050", size: 0.3, label: "F" },
            { position: [-1, 0, 0], color: "#90e050", size: 0.3, label: "F" },
            { position: [0, 1, 0], color: "#90e050", size: 0.3, label: "F" },
            { position: [0, -1, 0], color: "#90e050", size: 0.3, label: "F" },
            { position: [0, 0, 1], color: "#90e050", size: 0.3, label: "F" },
            { position: [0, 0, -1], color: "#90e050", size: 0.3, label: "F" },
        ],
        bonds: [
            { start: [0, 0, 0], end: [1, 0, 0] },
            { start: [0, 0, 0], end: [-1, 0, 0] },
            { start: [0, 0, 0], end: [0, 1, 0] },
            { start: [0, 0, 0], end: [0, -1, 0] },
            { start: [0, 0, 0], end: [0, 0, 1] },
            { start: [0, 0, 0], end: [0, 0, -1] },
        ]
    },
    pcl5: {
        name: "Phosphorus Pentachloride (PCl₅)",
        description: "Trigonal Bipyramidal.",
        formula: "PCl5",
        angle: 90,
        atoms: [
            { position: [0, 0, 0], color: "#ff8000", size: 0.45, label: "P" },
            { position: [0, 1.2, 0], color: "#1ff01f", size: 0.35, label: "Cl" },
            { position: [0, -1.2, 0], color: "#1ff01f", size: 0.35, label: "Cl" },
            { position: [1.1, 0, 0], color: "#1ff01f", size: 0.35, label: "Cl" },
            { position: [-0.55, 0, 0.95], color: "#1ff01f", size: 0.35, label: "Cl" },
            { position: [-0.55, 0, -0.95], color: "#1ff01f", size: 0.35, label: "Cl" },
        ],
        bonds: [
            { start: [0, 0, 0], end: [0, 1.2, 0] },
            { start: [0, 0, 0], end: [0, -1.2, 0] },
            { start: [0, 0, 0], end: [1.1, 0, 0] },
            { start: [0, 0, 0], end: [-0.55, 0, 0.95] },
            { start: [0, 0, 0], end: [-0.55, 0, -0.95] },
        ]
    },
    c2h4: {
        name: "Ethene (C₂H₄)",
        description: "Trigonal Planar (Double Bond).",
        formula: "C2H4",
        angle: 120,
        atoms: [
            { position: [0.6, 0, 0], color: "#1d1d1f", size: 0.4, label: "C" },
            { position: [-0.6, 0, 0], color: "#1d1d1f", size: 0.4, label: "C" },
            { position: [1.2, 0.9, 0], color: "#f5f5f5", size: 0.25, label: "H" },
            { position: [1.2, -0.9, 0], color: "#f5f5f5", size: 0.25, label: "H" },
            { position: [-1.2, 0.9, 0], color: "#f5f5f5", size: 0.25, label: "H" },
            { position: [-1.2, -0.9, 0], color: "#f5f5f5", size: 0.25, label: "H" },
        ],
        bonds: [
            { start: [0.6, 0, 0], end: [-0.6, 0, 0], double: true },
            { start: [0.6, 0, 0], end: [1.2, 0.9, 0] },
            { start: [0.6, 0, 0], end: [1.2, -0.9, 0] },
            { start: [-0.6, 0, 0], end: [-1.2, 0.9, 0] },
            { start: [-0.6, 0, 0], end: [-1.2, -0.9, 0] },
        ]
    }
};

const AtomMesh = ({ position, color, size, label }: any) => (
    <group position={position}>
        <Sphere args={[size, 32, 32]}>
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
        </Sphere>
        <Html position={[0, size + 0.2, 0]} center>
            <div className="bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold backdrop-blur-sm">
                {label}
            </div>
        </Html>
    </group>
);

const BondMesh = ({ start, end, double }: any) => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const mid = startVec.clone().add(endVec).multiplyScalar(0.5);
    const length = startVec.distanceTo(endVec);
    const direction = endVec.clone().sub(startVec).normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

    if (double) {
        return (
            <group position={mid} quaternion={quaternion}>
                <mesh position={[0.05, 0, 0]}>
                    <cylinderGeometry args={[0.03, 0.03, length, 16]} />
                    <meshStandardMaterial color="#9ca3af" />
                </mesh>
                <mesh position={[-0.05, 0, 0]}>
                    <cylinderGeometry args={[0.03, 0.03, length, 16]} />
                    <meshStandardMaterial color="#9ca3af" />
                </mesh>
            </group>
        );
    }

    return (
        <mesh position={mid} quaternion={quaternion}>
            <cylinderGeometry args={[0.05, 0.05, length, 16]} />
            <meshStandardMaterial color="#9ca3af" />
        </mesh>
    );
};

const MoleculeScene = ({ molecule, angleOffset }: { molecule: keyof typeof MOLECULES, angleOffset: number }) => {
    const data = MOLECULES[molecule];
    
    // Recalculate positions for H2O
    let atoms = data.atoms.map(a => ({ ...a }));
    let bonds = data.bonds.map(b => ({ ...b }));

    if (molecule === 'h2o') {
        const angleRad = ((data.angle + angleOffset) * Math.PI) / 180 / 2;
        const dist = 0.96; // O-H bond length in Angstroms (approx scaled)
        
        // H1
        atoms[1].position = [Math.sin(angleRad) * dist, -Math.cos(angleRad) * dist, 0];
        // H2
        atoms[2].position = [-Math.sin(angleRad) * dist, -Math.cos(angleRad) * dist, 0];
        
        // Update bonds
        bonds[0].end = atoms[1].position as any;
        bonds[1].end = atoms[2].position as any;
    }

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <directionalLight position={[-5, 5, 5]} intensity={0.5} />

            <group>
                {atoms.map((atom, i) => (
                    <AtomMesh key={i} {...atom} />
                ))}
                {bonds.map((bond, i) => (
                    <BondMesh key={i} {...bond} />
                ))}
            </group>

            <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={true} />
        </>
    );
};

export const MoleculeViewer = () => {
    const [activeMolecule, setActiveMolecule] = useState<keyof typeof MOLECULES>('ch4');
    const [angleOffset, setAngleOffset] = useState(0);

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Left Panel: Controls */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card className="bg-green-50 border-green-200">
                        <div className="flex flex-col items-center text-center gap-4">
                            <Astra context="chemistry" size="sm" />
                            <p className="text-sm leading-relaxed text-brand-black font-bold">
                                "Explore molecular geometries! Try adjusting the bond angle for Water to see how repulsion works."
                            </p>
                        </div>
                    </Card>

                    <Card className="flex-1 overflow-y-auto">
                        <h2 className="text-lg font-black text-brand-black flex items-center gap-2 mb-4">
                            <FlaskConical className="w-5 h-5 text-green-600" />
                            Select Molecule
                        </h2>
                        <div className="flex flex-col gap-3">
                            {(Object.keys(MOLECULES) as Array<keyof typeof MOLECULES>).map((key) => (
                                <button
                                    key={key}
                                    onClick={() => { setActiveMolecule(key); setAngleOffset(0); }}
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

                    {activeMolecule === 'h2o' && (
                         <Card className="bg-white border-gray-200">
                            <div className="mb-4">
                                <h3 className="font-bold text-sm mb-1">Adjust Bond Angle</h3>
                                <p className="text-xs text-gray-500">Theoretical vs Real</p>
                            </div>
                            <Slider 
                                label={`Angle: ${(104.5 + angleOffset).toFixed(1)}°`}
                                value={angleOffset}
                                min={-15}
                                max={15}
                                step={0.5}
                                onChange={setAngleOffset}
                                color="green"
                            />
                         </Card>
                    )}
                </div>

                {/* Right Panel: 3D View */}
                <div className="lg:col-span-2 h-[500px] lg:h-auto">
                    <Card className="h-full bg-gray-50 p-0 overflow-hidden relative border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <span className="text-xs font-black uppercase tracking-wider text-gray-500">Viewing</span>
                            <div className="font-bold text-brand-black">{MOLECULES[activeMolecule].name}</div>
                        </div>

                        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                            <Suspense fallback={null}>
                                <MoleculeScene molecule={activeMolecule} angleOffset={angleOffset} />
                            </Suspense>
                        </Canvas>
                    </Card>
                </div>
            </div>
        </div>
    );
};
