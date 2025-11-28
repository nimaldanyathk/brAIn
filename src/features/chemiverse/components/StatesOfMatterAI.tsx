import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

// --- Reusable Particle for AI Scenes ---
const AIParticle = ({ position, color, behavior, time }: { position: [number, number, number], color: string, behavior: 'solid' | 'liquid' | 'gas' | 'plasma', time: number }) => {
    const ref = useRef<THREE.Mesh>(null);
    const initialPos = useRef(new THREE.Vector3(...position));
    const randomOffset = useRef(new THREE.Vector3(Math.random(), Math.random(), Math.random()));

    useFrame(() => {
        if (!ref.current) return;

        if (behavior === 'solid') {
            // Vibrate in place
            ref.current.position.x = initialPos.current.x + Math.sin(time * 10 + randomOffset.current.x) * 0.05;
            ref.current.position.y = initialPos.current.y + Math.cos(time * 10 + randomOffset.current.y) * 0.05;
            ref.current.position.z = initialPos.current.z + Math.sin(time * 10 + randomOffset.current.z) * 0.05;
        } else if (behavior === 'liquid') {
            // Flow/Slosh (Simplified)
            ref.current.position.x = initialPos.current.x + Math.sin(time * 2 + initialPos.current.y) * 0.2;
            ref.current.position.y = initialPos.current.y + Math.cos(time * 3 + initialPos.current.x) * 0.1;
        } else if (behavior === 'gas') {
            // Move freely
            ref.current.position.x = initialPos.current.x + Math.sin(time * 2 + randomOffset.current.x * 10) * 1.5;
            ref.current.position.y = initialPos.current.y + Math.cos(time * 2.5 + randomOffset.current.y * 10) * 1.5;
            ref.current.position.z = initialPos.current.z + Math.sin(time * 1.5 + randomOffset.current.z * 10) * 1.5;
        } else if (behavior === 'plasma') {
            // Violent motion
            ref.current.position.x = initialPos.current.x + Math.sin(time * 10 + randomOffset.current.x * 100) * 0.5;
            ref.current.position.y = initialPos.current.y + Math.cos(time * 10 + randomOffset.current.y * 100) * 0.5;
            ref.current.position.z = initialPos.current.z + Math.sin(time * 10 + randomOffset.current.z * 100) * 0.5;
        }
    });

    return (
        <mesh ref={ref} position={position}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial 
                color={color} 
                emissive={behavior === 'plasma' ? color : '#000000'}
                emissiveIntensity={behavior === 'plasma' ? 2 : 0}
            />
        </mesh>
    );
};

const SCENES = [
    {
        title: "1. Solid State",
        text: "In a solid, particles are packed tightly together in a fixed arrangement. They vibrate but do not move past each other. This gives solids a definite shape and volume.",
        behavior: 'solid',
        color: '#22d3ee', // Cyan
        render: (time: number) => (
            <group>
                {/* 3x3x3 Cube Lattice */}
                {Array.from({ length: 3 }).map((_, x) => 
                    Array.from({ length: 3 }).map((_, y) => 
                        Array.from({ length: 3 }).map((_, z) => (
                            <AIParticle 
                                key={`${x}-${y}-${z}`} 
                                position={[(x-1)*0.8, (y-1)*0.8, (z-1)*0.8]} 
                                color="#22d3ee" 
                                behavior="solid" 
                                time={time} 
                            />
                        ))
                    )
                )}
            </group>
        )
    },
    {
        title: "2. Liquid State",
        text: "In a liquid, particles are close together but not in a fixed arrangement. They can flow and slide past each other, allowing liquids to take the shape of their container.",
        behavior: 'liquid',
        color: '#2563eb', // Blue
        render: (time: number) => (
            <group position={[0, -1, 0]}>
                {/* Pool of particles */}
                {Array.from({ length: 40 }).map((_, i) => (
                    <AIParticle 
                        key={i} 
                        position={[(Math.random()-0.5)*2, (Math.random())*1.5, (Math.random()-0.5)*2]} 
                        color="#2563eb" 
                        behavior="liquid" 
                        time={time} 
                    />
                ))}
                {/* Container Cup */}
                <mesh position={[0, 0.5, 0]}>
                    <cylinderGeometry args={[1.5, 1.5, 2.5, 32, 1, true]} />
                    <meshStandardMaterial color="#9ca3af" transparent opacity={0.3} side={THREE.DoubleSide} />
                </mesh>
            </group>
        )
    },
    {
        title: "3. Gas State",
        text: "In a gas, particles are far apart and move randomly at high speeds. They fill the entire available space and have no definite shape or volume.",
        behavior: 'gas',
        color: '#9ca3af', // Grey
        render: (time: number) => (
            <group>
                {Array.from({ length: 20 }).map((_, i) => (
                    <AIParticle 
                        key={i} 
                        position={[(Math.random()-0.5)*1, (Math.random()-0.5)*1, (Math.random()-0.5)*1]} 
                        color="#9ca3af" 
                        behavior="gas" 
                        time={time} 
                    />
                ))}
                {/* Boundary Box */}
                <mesh>
                    <boxGeometry args={[4, 4, 4]} />
                    <meshStandardMaterial color="#e5e7eb" wireframe />
                </mesh>
            </group>
        )
    },
    {
        title: "4. Plasma State",
        text: "Plasma is ionized gas. At very high temperatures, electrons are ripped away from atoms. It consists of charged ions and free electrons, and it glows!",
        behavior: 'plasma',
        color: '#a855f7', // Purple
        render: (time: number) => (
            <group>
                {Array.from({ length: 20 }).map((_, i) => (
                    <group key={i}>
                        <AIParticle 
                            position={[(Math.random()-0.5)*1, (Math.random()-0.5)*1, (Math.random()-0.5)*1]} 
                            color="#a855f7" 
                            behavior="plasma" 
                            time={time} 
                        />
                         {/* Trail Effect */}
                         <Trail width={1} length={3} color={new THREE.Color('#a855f7')} attenuation={(t) => t * t}>
                            <mesh visible={false}>
                                <sphereGeometry args={[0.1]} />
                                <meshBasicMaterial />
                            </mesh>
                        </Trail>
                    </group>
                ))}
            </group>
        )
    }
];

const VideoScene = ({ sceneIndex, isPlaying }: { sceneIndex: number, isPlaying: boolean }) => {
    const group = useRef<THREE.Group>(null);
    const [time, setTime] = useState(0);

    useFrame((_state, delta) => {
        if (isPlaying) {
            setTime(t => t + delta);
        }
        if (group.current) {
            group.current.rotation.y += 0.002;
        }
    });

    return (
        <group ref={group}>
            {SCENES[sceneIndex].render(time)}
        </group>
    );
};

export const StatesOfMatterAI = () => {
    const [sceneIndex, setSceneIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const nextScene = () => setSceneIndex(prev => (prev + 1) % SCENES.length);
    const prevScene = () => setSceneIndex(prev => (prev - 1 + SCENES.length) % SCENES.length);

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Controls / Script */}
            <div className="lg:col-span-1 flex flex-col gap-4">
                <Card className="p-6 bg-white border-gray-200 shadow-sm flex flex-col gap-6 h-full">
                    <div className="flex items-center gap-2 text-purple-600 font-black uppercase tracking-wider text-sm">
                        <Sparkles className="w-4 h-4" /> AI Tutor Mode
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                        <h2 className="text-2xl font-black text-gray-900 mb-4">
                            {SCENES[sceneIndex].title}
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            "{SCENES[sceneIndex].text}"
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-100">
                        <Button variant="ghost" onClick={() => { setSceneIndex(0); setIsPlaying(false); }}>
                            <RotateCcw className="w-5 h-5" />
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={prevScene}>Prev</Button>
                            <Button 
                                variant="primary" 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-12 h-12 rounded-full p-0 flex items-center justify-center"
                            >
                                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                            </Button>
                            <Button variant="secondary" onClick={nextScene}>Next</Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 3D View */}
            <div className="lg:col-span-2 h-[400px] lg:h-auto relative">
                <Card className="h-full p-0 overflow-hidden border-gray-200 shadow-md bg-gray-900">
                    <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-bold">
                        Scene {sceneIndex + 1} / {SCENES.length}
                    </div>
                    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                        <color attach="background" args={['#111827']} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} />
                        <VideoScene sceneIndex={sceneIndex} isPlaying={isPlaying} />
                        <OrbitControls enableZoom={true} />
                    </Canvas>
                </Card>
            </div>
        </div>
    );
};

