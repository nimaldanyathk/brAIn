import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';

const SCENES = [
    {
        title: "1. Atomic Orbitals",
        text: "Electrons don't orbit like planets. They exist in probability clouds called orbitals (s, p, d, f).",
        duration: 5000,
        render: (time: number) => (
            <group rotation={[0, time * 0.2, 0]}>
                <mesh scale={1 + Math.sin(time * 2) * 0.1}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial color="#3b82f6" transparent opacity={0.4} />
                </mesh>
                <mesh>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshStandardMaterial color="#1d4ed8" />
                </mesh>
            </group>
        )
    },
    {
        title: "2. Orbital Overlap",
        text: "When atoms approach, their orbitals can overlap. This is the first step in forming a bond.",
        duration: 5000,
        render: (time: number) => {
            const dist = Math.max(0.8, 3 - time * 0.5);
            return (
                <group rotation={[0, time * 0.2, 0]}>
                    <mesh position={[-dist, 0, 0]}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshStandardMaterial color="#3b82f6" transparent opacity={0.4} />
                    </mesh>
                    <mesh position={[dist, 0, 0]}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshStandardMaterial color="#ef4444" transparent opacity={0.4} />
                    </mesh>
                </group>
            );
        }
    },
    {
        title: "3. Sigma Bond Formation",
        text: "Head-on overlap creates a strong Sigma (s) bond. Electron density is concentrated between nuclei.",
        duration: 5000,
        render: (time: number) => (
            <group rotation={[0, time * 0.2, 0]}>
                <mesh position={[-0.8, 0, 0]} scale={[1.2, 0.8, 0.8]}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial color="#8b5cf6" transparent opacity={0.6} />
                </mesh>
                <mesh position={[0.8, 0, 0]} scale={[1.2, 0.8, 0.8]}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial color="#8b5cf6" transparent opacity={0.6} />
                </mesh>
                {/* Bond region */}
                <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI/2]}>
                    <cylinderGeometry args={[0.4, 0.4, 1.6, 16]} />
                    <meshStandardMaterial color="#a78bfa" transparent opacity={0.8} />
                </mesh>
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
            group.current.rotation.y += 0.005;
        }
    });

    return (
        <group ref={group}>
            {SCENES[sceneIndex].render(time)}
        </group>
    );
};

export const AITutor = () => {
    const [sceneIndex, setSceneIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const nextScene = () => setSceneIndex(prev => (prev + 1) % SCENES.length);
    const prevScene = () => setSceneIndex(prev => (prev - 1 + SCENES.length) % SCENES.length);

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
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



