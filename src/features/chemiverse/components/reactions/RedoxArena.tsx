import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Trail, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Zap, RotateCcw, Play, ChevronRight, ChevronLeft } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';

// --- Types & Data ---
type CompoundData = {
    id: string;
    name: string;
    cation: { label: string; color: string; radius: number; charge: number };
    anion: { label: string; color: string; radius: number; charge: number };
    electrons: number;
    equation: { ox: string; red: string; net: string };
};

const COMPOUNDS: CompoundData[] = [
    {
        id: 'NaCl',
        name: 'Sodium Chloride (Salt)',
        cation: { label: 'Na', color: '#9ca3af', radius: 1.2, charge: 1 },
        anion: { label: 'Cl', color: '#84cc16', radius: 1.0, charge: -1 },
        electrons: 1,
        equation: { 
            ox: 'Na → Na⁺ + e⁻', 
            red: 'Cl + e⁻ → Cl⁻', 
            net: 'Na + Cl → Na⁺Cl⁻' 
        }
    },
    {
        id: 'MgO',
        name: 'Magnesium Oxide',
        cation: { label: 'Mg', color: '#d1d5db', radius: 1.1, charge: 2 },
        anion: { label: 'O', color: '#ef4444', radius: 0.9, charge: -2 },
        electrons: 2,
        equation: { 
            ox: 'Mg ? Mg²? + 2e?', 
            red: 'O + 2e? ? O²?', 
            net: 'Mg + O ? Mg²?O²?' 
        }
    },
    {
        id: 'LiF',
        name: 'Lithium Fluoride',
        cation: { label: 'Li', color: '#c084fc', radius: 1.0, charge: 1 },
        anion: { label: 'F', color: '#fcd34d', radius: 0.8, charge: -1 },
        electrons: 1,
        equation: { 
            ox: 'Li → Li⁺ + e⁻', 
            red: 'F + e⁻ → F⁻', 
            net: 'Li + F → Li⁺F⁻' 
        }
    }
];

// --- Components ---

const Atom = ({ 
    position, 
    color, 
    radius, 
    label, 
    charge = 0 
}: { 
    position: [number, number, number], 
    color: string, 
    radius: number, 
    label: string,
    charge?: number
}) => {
    return (
        <group position={position}>
            {/* Nucleus/Core */}
            <mesh castShadow>
                <sphereGeometry args={[radius, 32, 32]} />
                <meshPhysicalMaterial 
                    color={color} 
                    roughness={0.2} 
                    metalness={0.1} 
                    clearcoat={0.8}
                />
            </mesh>
            
            {/* Label */}
            <Text position={[0, radius + 0.5, 0]} fontSize={0.5} color="black">
                {label}
            </Text>
            
            {/* Charge Indicator */}
            {charge !== 0 && (
                <Html position={[radius * 0.7, radius * 0.7, 0]} center>
                    <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border border-white
                        ${charge > 0 ? 'bg-red-500' : 'bg-blue-500'}
                    `}>
                        {Math.abs(charge) > 1 ? Math.abs(charge) : ''}{charge > 0 ? '+' : '-'}
                    </div>
                </Html>
            )}
        </group>
    );
};

const Electron = ({ 
    startPos, 
    endPos, 
    progress, 
    visible,
    offset = 0
}: { 
    startPos: THREE.Vector3, 
    endPos: THREE.Vector3, 
    progress: number,
    visible: boolean,
    offset?: number
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame(() => {
        if (meshRef.current && visible) {
            // Parabolic arc path with offset for multiple electrons
            const currentPos = new THREE.Vector3().lerpVectors(startPos, endPos, progress);
            // Add arc height + lateral offset
            currentPos.y += Math.sin(progress * Math.PI) * (2 + offset); 
            currentPos.z += Math.sin(progress * Math.PI) * offset;
            meshRef.current.position.copy(currentPos);
        }
    });

    if (!visible) return null;

    return (
        <Trail width={0.2} length={4} color="#fbbf24" attenuation={(t) => t * t}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#fbbf24" toneMapped={false} />
            </mesh>
        </Trail>
    );
};

const RedoxScene = ({ 
    compound,
    isReacted, 
    isAnimating 
}: { 
    compound: CompoundData,
    isReacted: boolean, 
    isAnimating: boolean 
}) => {
    // Animation State
    const [electronProgress, setElectronProgress] = useState(0);
    const naPos = useRef(new THREE.Vector3(-3, 0, 0));
    const clPos = useRef(new THREE.Vector3(3, 0, 0));
    
    // Animation Loop
    useFrame((_state, delta) => {
        if (isAnimating) {
            // 1. Electron Transfer Phase
            if (electronProgress < 1) {
                setElectronProgress(prev => Math.min(prev + delta * 1.5, 1));
            } 
        } else if (isReacted) {
             // 2. Ionic Attraction Phase (After electron lands)
             // Move atoms closer based on radii sum
             const targetDist = (compound.cation.radius + compound.anion.radius) * 0.6; // slightly overlap
             naPos.current.lerp(new THREE.Vector3(-targetDist/2, 0, 0), delta * 3);
             clPos.current.lerp(new THREE.Vector3(targetDist/2, 0, 0), delta * 3);
        } else {
            // Reset positions
            setElectronProgress(0);
            naPos.current.lerp(new THREE.Vector3(-3, 0, 0), delta * 5);
            clPos.current.lerp(new THREE.Vector3(3, 0, 0), delta * 5);
        }
    });

    return (
        <group>
            {/* Cation (Metal) */}
            <Atom 
                position={[naPos.current.x, naPos.current.y, naPos.current.z]} 
                color={compound.cation.color}
                radius={compound.cation.radius} 
                label={compound.cation.label} 
                charge={isReacted && electronProgress >= 1 ? compound.cation.charge : 0}
            />

            {/* Anion (Non-Metal) */}
            <Atom 
                position={[clPos.current.x, clPos.current.y, clPos.current.z]} 
                color={compound.anion.color}
                radius={compound.anion.radius} 
                label={compound.anion.label} 
                charge={isReacted && electronProgress >= 1 ? compound.anion.charge : 0}
            />

            {/* The Jumping Electrons */}
            {Array.from({ length: compound.electrons }).map((_, i) => (
                <Electron 
                    key={i}
                    startPos={new THREE.Vector3(-3 + compound.cation.radius, 0, 0)} 
                    endPos={new THREE.Vector3(3 - compound.anion.radius, 0, 0)}   
                    progress={electronProgress}
                    visible={isAnimating && electronProgress < 1}
                    offset={i === 0 ? 0 : 0.5 * (i % 2 === 0 ? 1 : -1)} // Offset for multiple
                />
            ))}
            
            {/* Result Label */}
            {isReacted && electronProgress >= 1 && (
                <Html position={[0, -2.5, 0]} center>
                    <div className="text-3xl font-black text-gray-800 tracking-widest animate-pulse drop-shadow-md">
                        {compound.cation.label}{compound.anion.label}
                    </div>
                </Html>
            )}
        </group>
    );
};

export const RedoxArena = () => {
    const [compoundIndex, setCompoundIndex] = useState(0);
    const [isReacted, setIsReacted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const compound = COMPOUNDS[compoundIndex];

    const handleReaction = () => {
        setIsAnimating(true);
        setIsReacted(true);
        setTimeout(() => setIsAnimating(false), 800); 
    };

    const reset = () => {
        setIsReacted(false);
        setIsAnimating(false);
    };

    const nextCompound = () => {
        reset();
        setCompoundIndex((prev) => (prev + 1) % COMPOUNDS.length);
    };

    const prevCompound = () => {
        reset();
        setCompoundIndex((prev) => (prev - 1 + COMPOUNDS.length) % COMPOUNDS.length);
    };

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Controls */}
            <div className="lg:col-span-1 flex flex-col gap-4">
                <Card className="p-6 bg-white border-gray-200 shadow-sm flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-green-600 font-black uppercase tracking-wider text-sm">
                        <Zap className="w-4 h-4" /> Redox Reaction
                    </div>
                    
                    {/* Compound Selector */}
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-200">
                        <Button variant="ghost" size="sm" onClick={prevCompound}>
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <div className="text-center">
                            <div className="font-bold text-lg text-gray-900">{compound.id}</div>
                            <div className="text-xs text-gray-500">{compound.name}</div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={nextCompound}>
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                        <strong>Oxidation-Reduction (Redox)</strong> involves the transfer of electrons from a metal to a non-metal.
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2 border border-gray-100 font-mono">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-500 text-xs uppercase">Oxidation</span>
                            <span className="text-red-600 bg-red-50 px-2 py-1 rounded">{compound.equation.ox}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-500 text-xs uppercase">Reduction</span>
                            <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">{compound.equation.red}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2 font-bold text-center text-purple-600">
                            {compound.equation.net}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <Button 
                            variant="primary" 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={handleReaction}
                            disabled={isReacted}
                        >
                            <Play className="w-4 h-4 mr-2" /> Start Reaction
                        </Button>
                        <Button variant="secondary" onClick={reset}>
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>
                </Card>
            </div>

            {/* 3D View */}
            <div className="lg:col-span-2 h-[500px] lg:h-auto relative rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white">
                <Canvas camera={{ position: [0, 2, 10], fov: 45 }} shadows>
                    <color attach="background" args={['#ffffff']} />
                    <ambientLight intensity={0.8} />
                    <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                    <Environment preset="city" />
                    
                    {/* Floor for shadows */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                        <planeGeometry args={[20, 20]} />
                        <shadowMaterial opacity={0.1} />
                    </mesh>

                    <RedoxScene 
                        compound={compound} 
                        isReacted={isReacted} 
                        isAnimating={isAnimating} 
                    />

                    <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/2} />
                </Canvas>
                
                {/* Overlay Legend */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white/90 backdrop-blur px-4 py-3 rounded-lg border border-gray-100 shadow-sm text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div> 
                        <span className="font-bold text-gray-600">Electron (e⁻)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: compound.cation.color }}></div> 
                        <span className="font-bold text-gray-600">{compound.cation.label} (Metal)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: compound.anion.color }}></div> 
                        <span className="font-bold text-gray-600">{compound.anion.label} (Non-Metal)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


