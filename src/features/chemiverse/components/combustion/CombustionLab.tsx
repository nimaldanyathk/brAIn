import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Sphere, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Flame, Wind } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';

import { Slider } from '../../../../components/ui/Slider';

// --- Constants ---
const FLAME_PARTICLES = 400;

// --- Components ---

const FlameParticle = ({ 
    position, 
    oxygenLevel 
}: { 
    position: [number, number, number], 
    oxygenLevel: number 
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [life, setLife] = useState(Math.random());
    const speed = useRef(0.02 + Math.random() * 0.03);
    const offset = useRef(Math.random() * Math.PI * 2);

    useFrame((state) => {
        if (meshRef.current) {
            // Update life
            let newLife = life - 0.01;
            if (newLife <= 0) {
                newLife = 1;
                // Reset position to base
                meshRef.current.position.set(
                    (Math.random() - 0.5) * 0.3, 
                    0, 
                    (Math.random() - 0.5) * 0.3
                );
            }
            setLife(newLife);

            // Move up
            meshRef.current.position.y += speed.current;
            
            // Wiggle
            meshRef.current.position.x += Math.sin(state.clock.elapsedTime * 5 + offset.current) * 0.005;

            // Color & Size Logic based on Oxygen Level (Complete vs Incomplete)
            // High Oxygen -> Blue Base, less Yellow
            // Low Oxygen -> Yellow/Orange/Black (Soot)
            
            const p = meshRef.current.position;
            const scale = (1 - newLife) * (oxygenLevel > 50 ? 0.8 : 1.2); // Bigger flame if incomplete
            meshRef.current.scale.setScalar(scale);

            // Color Gradient
            // Zone 1: Blue (Base) - Complete Combustion
            // Zone 2: Dark (Inner) - Unburnt Wax
            // Zone 3: Yellow (Outer) - Incomplete/Soot
            
            let color = new THREE.Color();
            
            if (p.y < 0.5) {
                // Base
                if (oxygenLevel > 80) color.set('#3b82f6'); // Blue
                else if (oxygenLevel > 40) color.set('#f59e0b'); // Orange
                else color.set('#ef4444'); // Red
            } else {
                // Top
                if (oxygenLevel > 80) {
                    color.set('#60a5fa'); // Light Blue (Clean)
                } else {
                    // Sooty Yellow
                    const sootFactor = (100 - oxygenLevel) / 100;
                    if (Math.random() < sootFactor * 0.2 && p.y > 1.5) {
                        color.set('#1f2937'); // Black Soot
                    } else {
                        color.set('#fbbf24'); // Yellow
                    }
                }
            }
            
            // Dark Zone Logic (Center)
            const dist = Math.sqrt(p.x*p.x + p.z*p.z);
            if (p.y < 0.8 && dist < 0.15) {
                color.set('#111827'); // Dark inner cone
            }

            (meshRef.current.material as THREE.MeshBasicMaterial).color = color;
            (meshRef.current.material as THREE.MeshBasicMaterial).opacity = newLife;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial transparent opacity={0.8} />
        </mesh>
    );
};

const Candle = ({ oxygenLevel }: { oxygenLevel: number }) => {
    return (
        <group position={[0, -2, 0]}>
            {/* Wax Body */}
            <mesh position={[0, -1, 0]}>
                <cylinderGeometry args={[0.8, 0.8, 4, 32]} />
                <meshStandardMaterial color="#fef3c7" roughness={0.1} />
            </mesh>
            {/* Wick */}
            <mesh position={[0, 1.2, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
                <meshStandardMaterial color="#1f2937" />
            </mesh>
            {/* Flame Particles */}
            <group position={[0, 1.5, 0]}>
                {Array.from({ length: FLAME_PARTICLES }).map((_, i) => (
                    <FlameParticle 
                        key={i} 
                        position={[0, 0, 0]} 
                        oxygenLevel={oxygenLevel} 
                    />
                ))}
            </group>
            {/* Point Light from Flame */}
            <pointLight 
                position={[0, 2, 0]} 
                intensity={oxygenLevel > 50 ? 1 : 0.5} 
                color={oxygenLevel > 80 ? '#60a5fa' : '#fbbf24'} 
                distance={5}
                castShadow
            />
        </group>
    );
};

const ReactionMolecule = ({ type, position }: { type: 'CH4' | 'O2' | 'CO2' | 'H2O' | 'CO' | 'C', position: [number, number, number] }) => {
    // Simple representation
    const colors = {
        CH4: '#10b981', // Green
        O2: '#3b82f6',  // Blue
        CO2: '#6b7280', // Grey
        H2O: '#0ea5e9', // Light Blue
        CO: '#ef4444',  // Red (Danger)
        C: '#000000'    // Black (Soot)
    };

    return (
        <Sphere position={position} args={[0.2, 16, 16]}>
            <meshStandardMaterial color={colors[type]} />
            <Html position={[0, 0.3, 0]} center>
                <div className="text-[8px] font-bold text-gray-600 bg-white/80 px-1 rounded">{type}</div>
            </Html>
        </Sphere>
    );
};

const ReactionChamber = ({ oxygenLevel }: { oxygenLevel: number }) => {
    // Visualize molecules reacting
    // Complete: CH4 + 2O2 -> CO2 + 2H2O
    // Incomplete: CH4 + 1.5O2 -> CO + 2H2O
    
    const isComplete = oxygenLevel > 70;
    
    return (
        <group position={[3, 0, 0]}>
            <Text position={[0, 2, 0]} fontSize={0.4} color="black" anchorX="center">
                Reaction View
            </Text>
            
            {/* Reactants */}
            <group position={[-1.5, 0, 0]}>
                <ReactionMolecule type="CH4" position={[0, 0, 0]} />
                <ReactionMolecule type="O2" position={[0.5, 0.5, 0]} />
                {isComplete && <ReactionMolecule type="O2" position={[0.5, -0.5, 0]} />}
            </group>

            <Text position={[0, 0, 0]} fontSize={0.4} color="black">
                ?
            </Text>

            {/* Products */}
            <group position={[1.5, 0, 0]}>
                {isComplete ? (
                    <>
                        <ReactionMolecule type="CO2" position={[0, 0, 0]} />
                        <ReactionMolecule type="H2O" position={[0.5, 0.5, 0]} />
                        <ReactionMolecule type="H2O" position={[0.5, -0.5, 0]} />
                    </>
                ) : (
                    <>
                        <ReactionMolecule type="CO" position={[0, 0, 0]} />
                        <ReactionMolecule type="H2O" position={[0.5, 0.5, 0]} />
                        <ReactionMolecule type="C" position={[0.5, -0.5, 0]} />
                    </>
                )}
            </group>
        </group>
    );
};

export const CombustionLab = () => {
    const [oxygenLevel, setOxygenLevel] = useState(100); // 0 to 100%

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Controls */}
            <div className="lg:col-span-1 flex flex-col gap-4">
                <Card className="p-6 bg-white border-gray-200 shadow-sm flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-wider text-sm">
                        <Flame className="w-4 h-4" /> Combustion Lab
                    </div>
                    
                    <p className="text-sm text-gray-600">
                        Adjust the <strong>Air Hole</strong> to control Oxygen supply.
                        Observe how the flame color and reaction products change.
                    </p>

                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between mb-2">
                            <label className="font-bold text-gray-700 flex items-center gap-2">
                                <Wind className="w-4 h-4 text-gray-400" /> Oxygen Supply
                            </label>
                            <span className={`font-mono font-bold ${oxygenLevel > 70 ? 'text-blue-600' : 'text-orange-600'}`}>
                                {oxygenLevel}%
                            </span>
                        </div>
                        <Slider 
                            label="Oxygen"
                            value={oxygenLevel} 
                            onChange={setOxygenLevel} 
                            min={0} 
                            max={100} 
                            step={1}
                            color={oxygenLevel > 70 ? 'blue' : 'red'}
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Closed (Sooty)</span>
                            <span>Open (Clean)</span>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className={`p-4 rounded-lg border text-sm transition-colors duration-300
                        ${oxygenLevel > 70 ? 'bg-blue-50 border-blue-100 text-blue-900' : 'bg-orange-50 border-orange-100 text-orange-900'}
                    `}>
                        <div className="font-bold mb-1 flex items-center gap-2">
                            {oxygenLevel > 70 ? 'Complete Combustion' : 'Incomplete Combustion'}
                        </div>
                        <div className="font-mono text-xs mb-2">
                            {oxygenLevel > 70 
                                ? 'CH4 + 2O2 ? CO2 + 2H2O' 
                                : 'CH4 + 1.5O2 ? CO + 2H2O + C'}
                        </div>
                        <p className="opacity-80">
                            {oxygenLevel > 70 
                                ? 'Blue flame. High energy. Clean burning (CO2 + Water).' 
                                : 'Yellow flame. Low energy. Produces Soot (C) and Carbon Monoxide (CO).'}
                        </p>
                    </div>
                </Card>
            </div>

            {/* 3D View */}
            <div className="lg:col-span-2 h-[500px] lg:h-auto relative rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white">
                <Canvas camera={{ position: [0, 2, 8], fov: 45 }} shadows>
                    <color attach="background" args={['#ffffff']} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={0.5} />
                    <Environment preset="city" />
                    
                    {/* Floor */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
                        <planeGeometry args={[20, 20]} />
                        <shadowMaterial opacity={0.1} />
                    </mesh>

                    <Candle oxygenLevel={oxygenLevel} />
                    <ReactionChamber oxygenLevel={oxygenLevel} />

                    <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/2} />
                </Canvas>
                
                {/* Overlay Legend */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white/90 backdrop-blur px-4 py-3 rounded-lg border border-gray-100 shadow-sm text-xs">
                    <div className="font-bold text-gray-400 mb-1 uppercase tracking-wider">Flame Zones</div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div> 
                        <span className="font-bold text-gray-600">Blue (Complete)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div> 
                        <span className="font-bold text-gray-600">Yellow (Luminous)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-900 rounded-full"></div> 
                        <span className="font-bold text-gray-600">Dark (Unburnt)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

