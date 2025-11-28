import { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Flame, FlaskConical } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Slider } from '../../../../components/ui/Slider';

// --- Constants ---
const BOX_SIZE = 10;
const PARTICLE_RADIUS = 0.3;

// --- Types ---
type ParticleType = 'A' | 'B' | 'AB';

// --- Simulation Component ---
const CollisionSimulation = ({ 
    temp, 
    concentration, 
    isPlaying,
    onReaction 
}: { 
    temp: number, 
    concentration: number, 
    isPlaying: boolean,
    onReaction: () => void
}) => {
    const count = Math.floor(concentration);
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    
    // State vectors
    const positions = useMemo(() => new Float32Array(count * 3), [count]);
    const velocities = useMemo(() => new Float32Array(count * 3), [count]);
    const types = useMemo(() => new Array<ParticleType>(count).fill('A'), [count]);
    const colors = useMemo(() => new Float32Array(count * 3), [count]);

    // Initialize
    useEffect(() => {
        for (let i = 0; i < count; i++) {
            // Random Position
            positions[i*3] = (Math.random() - 0.5) * BOX_SIZE;
            positions[i*3+1] = (Math.random() - 0.5) * BOX_SIZE;
            positions[i*3+2] = (Math.random() - 0.5) * BOX_SIZE;

            // Random Velocity based on Temp
            const speed = (temp / 100) * 0.5;
            velocities[i*3] = (Math.random() - 0.5) * speed;
            velocities[i*3+1] = (Math.random() - 0.5) * speed;
            velocities[i*3+2] = (Math.random() - 0.5) * speed;

            // Assign Type (Half A, Half B initially)
            types[i] = i < count / 2 ? 'A' : 'B';
            
            // Initial Colors
            const color = new THREE.Color(types[i] === 'A' ? '#3b82f6' : '#ef4444');
            colors[i*3] = color.r;
            colors[i*3+1] = color.g;
            colors[i*3+2] = color.b;
        }
    }, [count, temp]); 

    useFrame((_state, delta) => {
        if (!isPlaying || !meshRef.current) return;
        
        const dt = Math.min(delta, 0.05); 

        // Update Positions & Wall Collisions
        for (let i = 0; i < count; i++) {
            const idx = i * 3;
            
            positions[idx] += velocities[idx] * (dt * 60); 
            positions[idx+1] += velocities[idx+1] * (dt * 60);
            positions[idx+2] += velocities[idx+2] * (dt * 60);

            // Wall Bounce
            if (Math.abs(positions[idx]) > BOX_SIZE/2) {
                positions[idx] = Math.sign(positions[idx]) * BOX_SIZE/2;
                velocities[idx] *= -1;
            }
            if (Math.abs(positions[idx+1]) > BOX_SIZE/2) {
                positions[idx+1] = Math.sign(positions[idx+1]) * BOX_SIZE/2;
                velocities[idx+1] *= -1;
            }
            if (Math.abs(positions[idx+2]) > BOX_SIZE/2) {
                positions[idx+2] = Math.sign(positions[idx+2]) * BOX_SIZE/2;
                velocities[idx+2] *= -1;
            }
        }
        
        // Particle Collisions
        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                const idxI = i * 3;
                const idxJ = j * 3;

                const dx = positions[idxI] - positions[idxJ];
                const dy = positions[idxI+1] - positions[idxJ+1];
                const dz = positions[idxI+2] - positions[idxJ+2];
                const distSq = dx*dx + dy*dy + dz*dz;

                if (distSq < (PARTICLE_RADIUS * 2)**2) {
                    // Collision Detected
                    
                    // 1. Elastic Collision Response
                    const vIx = velocities[idxI], vIy = velocities[idxI+1], vIz = velocities[idxI+2];
                    const vJx = velocities[idxJ], vJy = velocities[idxJ+1], vJz = velocities[idxJ+2];

                    velocities[idxI] = vJx; velocities[idxI+1] = vJy; velocities[idxI+2] = vJz;
                    velocities[idxJ] = vIx; velocities[idxJ+1] = vIy; velocities[idxJ+2] = vIz;

                    const dist = Math.sqrt(distSq);
                    const overlap = (PARTICLE_RADIUS * 2) - dist;
                    const nx = dx / dist, ny = dy / dist, nz = dz / dist;
                    
                    positions[idxI] += nx * overlap * 0.5;
                    positions[idxI+1] += ny * overlap * 0.5;
                    positions[idxI+2] += nz * overlap * 0.5;
                    positions[idxJ] -= nx * overlap * 0.5;
                    positions[idxJ+1] -= ny * overlap * 0.5;
                    positions[idxJ+2] -= nz * overlap * 0.5;

                    // 2. Reaction Logic
                    if ((types[i] === 'A' && types[j] === 'B') || (types[i] === 'B' && types[j] === 'A')) {
                        const dvx = vIx - vJx;
                        const dvy = vIy - vJy;
                        const dvz = vIz - vJz;
                        const relativeSpeedSq = dvx*dvx + dvy*dvy + dvz*dvz;
                        
                        if (relativeSpeedSq > 0.05) { 
                             if (types[i] !== 'AB') {
                                 types[i] = 'AB';
                                 types[j] = 'AB';
                                 
                                 colors[idxI] = 0.6; colors[idxI+1] = 0.2; colors[idxI+2] = 0.8; 
                                 colors[idxJ] = 0.6; colors[idxJ+1] = 0.2; colors[idxJ+2] = 0.8;
                                 
                                 onReaction();
                             }
                        }
                    }
                }
            }
        }

        // Render
        for (let i = 0; i < count; i++) {
            dummy.position.set(positions[i*3], positions[i*3+1], positions[i*3+2]);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
            meshRef.current.setColorAt(i, new THREE.Color(colors[i*3], colors[i*3+1], colors[i*3+2]));
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
            <sphereGeometry args={[PARTICLE_RADIUS, 16, 16]} />
            <meshPhysicalMaterial 
                roughness={0.2} 
                metalness={0.1} 
                clearcoat={1}
            />
        </instancedMesh>
    );
};

export const CollisionLab = () => {
    const [temp, setTemp] = useState(300); 
    const [concentration, setConcentration] = useState(50); 
    const [isPlaying, setIsPlaying] = useState(true);
    const [reactionCount, setReactionCount] = useState(0);

    const handleReaction = () => {
        setReactionCount(prev => prev + 1);
    };

    const reset = () => {
        setReactionCount(0);
        setConcentration(prev => prev === 50 ? 50.001 : 50); 
    };

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Controls */}
            <div className="lg:col-span-1 flex flex-col gap-4">
                <Card className="p-6 bg-white border-gray-200 shadow-sm flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-wider text-sm">
                        <FlaskConical className="w-4 h-4" /> Collision Theory
                    </div>
                    
                    <p className="text-sm text-gray-600">
                        For a reaction to occur, particles must collide with:
                        <br/>1. Correct Orientation
                        <br/>2. Sufficient Energy (Activation Energy)
                    </p>

                    {/* Stats */}
                    <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                        <div className="text-3xl font-black text-purple-600">{reactionCount}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reactions</div>
                    </div>

                    {/* Sliders */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="font-bold text-gray-700 flex items-center gap-2">
                                    <Flame className="w-4 h-4 text-orange-500" /> Temperature
                                </label>
                                <span className="font-mono font-bold text-gray-900">{Math.round(temp)} K</span>
                            </div>
                            <Slider 
                                label="Temperature"
                                value={temp} 
                                onChange={setTemp} 
                                min={100} 
                                max={1000} 
                                step={10}
                                color="red"
                            />
                            <p className="text-xs text-gray-400 mt-1">Higher temp = Faster particles = More energy</p>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="font-bold text-gray-700">Concentration</label>
                                <span className="font-mono font-bold text-gray-900">{Math.round(concentration)}</span>
                            </div>
                            <Slider 
                                label="Concentration"
                                value={concentration} 
                                onChange={setConcentration} 
                                min={10} 
                                max={100} 
                                step={1}
                                color="blue"
                            />
                             <p className="text-xs text-gray-400 mt-1">More particles = More collisions</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <Button 
                            variant="primary" 
                            className="flex-1"
                            onClick={() => setIsPlaying(!isPlaying)}
                        >
                            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                            {isPlaying ? 'Pause' : 'Resume'}
                        </Button>
                        <Button variant="secondary" onClick={reset}>
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>
                </Card>
            </div>

            {/* 3D View */}
            <div className="lg:col-span-2 h-[500px] lg:h-auto relative rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-gray-900">
                <Canvas camera={{ position: [0, 0, 18], fov: 45 }} shadows>
                    <color attach="background" args={['#0f172a']} />
                    <ambientLight intensity={0.4} />
                    <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                    <Environment preset="city" />

                    {/* Container Box */}
                    <mesh>
                        <boxGeometry args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
                        <meshBasicMaterial color="#1e293b" wireframe transparent opacity={0.3} />
                    </mesh>

                    <CollisionSimulation 
                        temp={temp} 
                        concentration={concentration} 
                        isPlaying={isPlaying} 
                        onReaction={handleReaction}
                    />

                    <OrbitControls />
                    <EffectComposer>
                        <Bloom luminanceThreshold={0.5} intensity={1.5} radius={0.4} />
                    </EffectComposer>
                </Canvas>
                
                {/* Overlay Legend */}
                <div className="absolute bottom-4 left-4 flex gap-4 bg-black/50 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-white">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div> Reactant A
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div> Reactant B
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></div> Product AB
                    </div>
                </div>
            </div>
        </div>
    );
};

