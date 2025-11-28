import { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Trail, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing';
import * as THREE from 'three';
import { ArrowLeft, Thermometer, Gauge, RotateCcw, Activity, Beaker, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Slider } from '../../components/ui/Slider';
import { StatesOfMatterAI } from './components/StatesOfMatterAI';

// --- Physics Constants ---
const PARTICLE_COUNT = 300;
const BOX_SIZE = 12;
const RADIUS = 0.3;
const SIGMA = 0.8;
const CUTOFF = SIGMA * 2.5;

// --- Phase Diagram Component ---
const PhaseDiagram = ({ temp, pressure }: { temp: number, pressure: number, stateMode: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;

        // Clear
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        // Draw Regions (Simplified approximations)
        // Solid (Top Left)
        ctx.fillStyle = '#dbeafe'; // Blue-50
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w * 0.4, 0);
        ctx.lineTo(w * 0.5, h);
        ctx.lineTo(0, h);
        ctx.fill();

        // Liquid (Top Middle)
        ctx.fillStyle = '#e0f2fe'; // Sky-50
        ctx.beginPath();
        ctx.moveTo(w * 0.4, 0);
        ctx.lineTo(w, 0);
        ctx.lineTo(w, h * 0.4);
        ctx.lineTo(w * 0.5, h);
        ctx.fill();

        // Gas (Bottom Right)
        ctx.fillStyle = '#fef2f2'; // Red-50
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(w * 0.5, h);
        ctx.lineTo(w, h * 0.4);
        ctx.lineTo(w, h);
        ctx.fill();

        // Labels
        ctx.fillStyle = '#1e3a8a';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('SOLID', 20, h - 20);
        ctx.fillStyle = '#0369a1';
        ctx.fillText('LIQUID', w * 0.5, h * 0.4);
        ctx.fillStyle = '#b91c1c';
        ctx.fillText('GAS', w - 40, h - 20);

        // Current Point
        const x = (temp / 1000) * w;
        const y = h - (pressure / 50) * h;

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

    }, [temp, pressure]);

    return (
        <div className="relative border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <canvas ref={canvasRef} width={280} height={150} className="w-full h-auto" />
            <div className="absolute bottom-1 right-2 text-[10px] font-bold text-gray-400">Temperature →</div>
            <div className="absolute top-2 left-1 text-[10px] font-bold text-gray-400 rotate-90 origin-left">Pressure →</div>
        </div>
    );
};

// --- Particle System ---
const ParticleSystem = ({ temp, pressure, stateMode }: { temp: number, pressure: number, stateMode: string }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    
    // Physics State
    const positions = useMemo(() => {
        const pos = new Float32Array(PARTICLE_COUNT * 3);
        let i = 0;
        const perRow = Math.ceil(Math.pow(PARTICLE_COUNT, 1/3));
        const spacing = 1.0;
        for(let x=0; x<perRow; x++) {
            for(let y=0; y<perRow; y++) {
                for(let z=0; z<perRow; z++) {
                    if(i < PARTICLE_COUNT) {
                        pos[i*3] = (x - perRow/2) * spacing;
                        pos[i*3+1] = (y - perRow/2) * spacing;
                        pos[i*3+2] = (z - perRow/2) * spacing;
                        i++;
                    }
                }
            }
        }
        return pos;
    }, []);

    const velocities = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
    const forces = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

    useFrame((_state, delta) => {
        if (!meshRef.current) return;

        const dt = Math.min(delta, 0.02);
        forces.fill(0);

        // 1. Spatial Grid Optimization
        const cellSize = CUTOFF;
        const grid = new Map<string, number[]>();
        
        const getCellKey = (x: number, y: number, z: number) => {
            return `${Math.floor(x/cellSize)},${Math.floor(y/cellSize)},${Math.floor(z/cellSize)}`;
        };

        // Populate Grid
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const idx = i * 3;
            const key = getCellKey(positions[idx], positions[idx+1], positions[idx+2]);
            if (!grid.has(key)) grid.set(key, []);
            grid.get(key)!.push(i);
        }

        // Apply Forces using Grid
        if (temp < 800) {
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const idxI = i * 3;
                const cellX = Math.floor(positions[idxI]/cellSize);
                const cellY = Math.floor(positions[idxI+1]/cellSize);
                const cellZ = Math.floor(positions[idxI+2]/cellSize);

                // Check neighbor cells (3x3x3)
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        for (let z = -1; z <= 1; z++) {
                            const key = `${cellX+x},${cellY+y},${cellZ+z}`;
                            const neighbors = grid.get(key);
                            if (!neighbors) continue;

                            for (const j of neighbors) {
                                if (j <= i) continue; // Avoid double counting and self

                                const idxJ = j * 3;
                                const dx = positions[idxJ] - positions[idxI];
                                const dy = positions[idxJ+1] - positions[idxI+1];
                                const dz = positions[idxJ+2] - positions[idxI+2];
                                
                                const r2 = dx*dx + dy*dy + dz*dz;
                                
                                if (r2 < CUTOFF * CUTOFF && r2 > 0.01) {
                                    const r = Math.sqrt(r2);
                                    let f = 0;
                                    
                                    if (r < SIGMA) {
                                        f = -400 * (SIGMA - r); 
                                    } else {
                                        f = 20 * (r - SIGMA); 
                                    }

                                    const fx = (dx / r) * f;
                                    const fy = (dy / r) * f;
                                    const fz = (dz / r) * f;

                                    forces[idxI] += fx;
                                    forces[idxI+1] += fy;
                                    forces[idxI+2] += fz;

                                    forces[idxJ] -= fx;
                                    forces[idxJ+1] -= fy;
                                    forces[idxJ+2] -= fz;
                                }
                            }
                        }
                    }
                }
            }
        }

        // Box Bounds
        const currentBoxHeight = BOX_SIZE - (pressure / 5);
        const bounds = { x: BOX_SIZE/2, y: currentBoxHeight/2, z: BOX_SIZE/2 };

        // Update Particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const idx = i * 3;

            // Apply Forces to Velocity
            velocities[idx] += forces[idx] * dt;
            velocities[idx+1] += forces[idx+1] * dt;
            velocities[idx+2] += forces[idx+2] * dt;

            // Gravity
            if (temp < 600) {
                velocities[idx+1] -= 9.8 * dt; 
            }

            // Temperature (Thermostat)
            const speed = Math.sqrt(velocities[idx]**2 + velocities[idx+1]**2 + velocities[idx+2]**2);
            const targetSpeed = (temp / 100) * 2; 
            
            const thermalFactor = 0.05;
            if (speed < targetSpeed) {
                velocities[idx] += (Math.random()-0.5) * targetSpeed * thermalFactor;
                velocities[idx+1] += (Math.random()-0.5) * targetSpeed * thermalFactor;
                velocities[idx+2] += (Math.random()-0.5) * targetSpeed * thermalFactor;
            } else {
                velocities[idx] *= 0.99; 
            }

            // Update Position
            positions[idx] += velocities[idx] * dt;
            positions[idx+1] += velocities[idx+1] * dt;
            positions[idx+2] += velocities[idx+2] * dt;

            // Wall Collisions
            if (Math.abs(positions[idx]) > bounds.x) {
                positions[idx] = Math.sign(positions[idx]) * bounds.x;
                velocities[idx] *= -0.8;
            }
            if (positions[idx+1] < -BOX_SIZE/2) {
                positions[idx+1] = -BOX_SIZE/2;
                velocities[idx+1] *= -0.8;
            }
            if (positions[idx+1] > bounds.y) {
                positions[idx+1] = bounds.y;
                velocities[idx+1] *= -0.8;
            }
            if (Math.abs(positions[idx+2]) > bounds.z) {
                positions[idx+2] = Math.sign(positions[idx+2]) * bounds.z;
                velocities[idx+2] *= -0.8;
            }

            // Render Update
            dummy.position.set(positions[idx], positions[idx+1], positions[idx+2]);
            
            // Color Logic based on State Mode
            const vMag = Math.sqrt(velocities[idx]**2 + velocities[idx+1]**2 + velocities[idx+2]**2);
            const color = new THREE.Color();
            
            if (stateMode === 'plasma') {
                // Neon Purple/Pink
                color.setHSL(0.8 + Math.sin(vMag * 0.1)*0.1, 1, 0.6);
                dummy.scale.setScalar(1.2);
            } else if (stateMode === 'gas') {
                // Steam White/Grey
                color.setHSL(0, 0, 0.8 + Math.random()*0.2);
                dummy.scale.setScalar(0.8);
            } else if (stateMode === 'liquid') {
                // Deep Ocean Blue
                color.setHSL(0.6, 0.9, 0.4 + Math.random()*0.1);
                dummy.scale.setScalar(1);
            } else {
                // Solid Ice Cyan
                color.setHSL(0.5, 0.8, 0.8);
                dummy.scale.setScalar(1);
            }

            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
            meshRef.current.setColorAt(i, color);
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <group>
            <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]} castShadow receiveShadow>
                <sphereGeometry args={[RADIUS, 32, 32]} />
                <meshPhysicalMaterial 
                    roughness={stateMode === 'solid' ? 0.4 : stateMode === 'liquid' ? 0.1 : 0.8}
                    metalness={stateMode === 'liquid' ? 0.8 : 0.1}
                    transmission={stateMode === 'liquid' ? 0.6 : 0}
                    thickness={stateMode === 'liquid' ? 0.5 : 0}
                    emissive={stateMode === 'plasma' ? '#8b5cf6' : '#000000'}
                    emissiveIntensity={stateMode === 'plasma' ? 2 : 0}
                    clearcoat={stateMode === 'liquid' ? 1 : 0}
                    clearcoatRoughness={0.1}
                    transparent={stateMode === 'gas'}
                    opacity={stateMode === 'gas' ? 0.6 : 1}
                />
            </instancedMesh>
            {/* Trail Effect for Plasma */}
            {stateMode === 'plasma' && (
                 <Trail width={2} length={4} color={new THREE.Color(0x8b5cf6)} attenuation={(t) => t * t}>
                    <mesh visible={false}>
                        <sphereGeometry args={[0.1]} />
                        <meshBasicMaterial />
                    </mesh>
                 </Trail>
            )}
        </group>
    );
};

export const StatesOfMatter = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'simulation' | 'ai'>('simulation');
    
    // Simulation State
    const [temp, setTemp] = useState(100);
    const [pressure, setPressure] = useState(10);
    const [stateMode, setStateMode] = useState<'solid' | 'liquid' | 'gas' | 'plasma'>('solid');

    useEffect(() => {
        const effectiveTemp = temp - (pressure * 2); 
        
        if (temp > 800) setStateMode('plasma');
        else if (effectiveTemp > 400) setStateMode('gas');
        else if (effectiveTemp > 200) setStateMode('liquid');
        else setStateMode('solid');
    }, [temp, pressure]);

    return (
        <div className="h-full flex flex-col bg-white text-gray-900 font-sans overflow-hidden">
            {/* Header */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/chemistry')} className="px-2 text-gray-700 hover:bg-gray-100">
                    <ArrowLeft className="w-8 h-8" />
                </Button>
                <div>
                    <h1 className="text-4xl font-black text-gray-900">STATES OF MATTER</h1>
                    <div className="flex items-center gap-4 mt-1">
                        <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">
                            Interactive Physics Lab
                        </p>
                        {/* Tab Switcher */}
                        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                            <button 
                                onClick={() => setActiveTab('simulation')}
                                className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all
                                    ${activeTab === 'simulation' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}
                                `}
                            >
                                <div className="flex items-center gap-1">
                                    <Beaker className="w-3 h-3" /> Simulation
                                </div>
                            </button>
                            <button 
                                onClick={() => setActiveTab('ai')}
                                className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all
                                    ${activeTab === 'ai' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}
                                `}
                            >
                                <div className="flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> AI Tutor
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative h-full">
                {activeTab === 'simulation' ? (
                    <>
                        {/* Controls */}
                        <div className="absolute top-24 right-6 z-20 w-80 flex flex-col gap-6">
                            <Card className="bg-white/90 backdrop-blur-xl border-gray-200 shadow-xl p-6">
                                <div className="flex items-center gap-2 mb-4 text-blue-600 font-bold uppercase tracking-wider text-sm">
                                    <Activity className="w-4 h-4" /> Phase Diagram
                                </div>
                                <PhaseDiagram temp={temp} pressure={pressure} stateMode={stateMode} />
                                <div className="mt-4 text-center">
                                    <span className={`inline-block px-3 py-1 rounded-full font-black text-sm uppercase
                                        ${stateMode === 'solid' ? 'bg-cyan-100 text-cyan-800' : 
                                          stateMode === 'liquid' ? 'bg-blue-100 text-blue-800' :
                                          stateMode === 'gas' ? 'bg-gray-100 text-gray-800' : 'bg-purple-100 text-purple-800'
                                        }`}>
                                        {stateMode}
                                    </span>
                                </div>
                                {/* Legend */}
                                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-gray-500">
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-300"></div> Solid (Ice)</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-600"></div> Liquid (Water)</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-300"></div> Gas (Steam)</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_5px_#a855f7]"></div> Plasma</div>
                                </div>
                            </Card>

                            <Card className="bg-white/90 backdrop-blur-xl border-gray-200 shadow-xl p-6">
                                <div className="flex flex-col gap-6">
                                    {/* Temperature */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="flex items-center gap-2 font-bold text-gray-700">
                                                <Thermometer className="w-5 h-5 text-red-500" /> Temperature
                                            </label>
                                            <span className="font-mono font-bold text-gray-900">{Math.round(temp)} K</span>
                                        </div>
                                        <Slider 
                                            label="Temperature"
                                            value={temp} 
                                            onChange={setTemp} 
                                            min={0} 
                                            max={1000} 
                                            step={1}
                                            color="red"
                                        />
                                    </div>

                                    {/* Pressure */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="flex items-center gap-2 font-bold text-gray-700">
                                                <Gauge className="w-5 h-5 text-green-500" /> Pressure
                                            </label>
                                            <span className="font-mono font-bold text-gray-900">{Math.round(pressure)} atm</span>
                                        </div>
                                        <Slider 
                                            label="Pressure"
                                            value={pressure} 
                                            onChange={setPressure} 
                                            min={0} 
                                            max={50} 
                                            step={1}
                                            color="green"
                                        />
                                    </div>

                                    <Button 
                                        variant="secondary" 
                                        onClick={() => { setTemp(100); setPressure(10); }}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw className="w-4 h-4" /> Reset Simulation
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        {/* 3D Scene */}
                        <div className="w-full h-full bg-gradient-to-b from-gray-50 to-gray-200">
                            <Canvas camera={{ position: [0, 5, 22], fov: 45 }} shadows>
                                <ambientLight intensity={0.6} />
                                <spotLight position={[20, 20, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
                                <pointLight position={[-10, 10, -10]} intensity={0.5} />
                                <Environment preset='city' />
                                
                                {/* Container */}
                                <group>
                                    {/* Floor */}
                                    <mesh position={[0, -BOX_SIZE/2 - 0.2, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
                                        <planeGeometry args={[BOX_SIZE * 2, BOX_SIZE * 2]} />
                                        <meshStandardMaterial color="#f1f5f9" />
                                    </mesh>
                                    
                                    {/* Piston (Ceiling) */}
                                    <mesh position={[0, (BOX_SIZE/2 - (pressure/5)) + 0.2, 0]} rotation={[Math.PI/2, 0, 0]}>
                                        <cylinderGeometry args={[BOX_SIZE/1.8, BOX_SIZE/1.8, 0.5, 32]} />
                                        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
                                    </mesh>
                                    
                                    {/* Glass Walls */}
                                    <mesh position={[0, 0, 0]}>
                                        <boxGeometry args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
                                        <meshPhysicalMaterial 
                                            color="#ffffff"
                                            transmission={0.95}
                                            opacity={1}
                                            metalness={0}
                                            roughness={0}
                                            ior={1.5}
                                            thickness={0.5}
                                            transparent
                                            side={THREE.BackSide} 
                                        />
                                    </mesh>
                                    {/* Glass Walls Outer (for reflection) */}
                                     <mesh position={[0, 0, 0]}>
                                        <boxGeometry args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
                                        <meshPhysicalMaterial 
                                            color="#ffffff"
                                            transmission={0.95}
                                            opacity={1}
                                            metalness={0}
                                            roughness={0}
                                            ior={1.5}
                                            thickness={0.5}
                                            transparent
                                        />
                                    </mesh>
                                </group>

                                <ParticleSystem temp={temp} pressure={pressure} stateMode={stateMode} />
                                
                                <OrbitControls enablePan={false} maxDistance={40} minDistance={10} />
                                <EffectComposer>
                                    <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
                                    <SSAO radius={0.4} intensity={50} luminanceInfluence={0.4} />
                                </EffectComposer>
                            </Canvas>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full pt-20">
                        <StatesOfMatterAI />
                    </div>
                )}
            </div>
        </div>
    );
};
