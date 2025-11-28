import { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, RefreshCw, Dices, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types ---
type RollResult = 1 | 2 | 3 | 4 | 5 | 6;

export const ProbabilityLab = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState<RollResult[]>([]);
    const [isRolling, setIsRolling] = useState(false);
    const [rollTrigger, setRollTrigger] = useState(0); // Increment to trigger roll

    const rollDice = () => {
        if (isRolling) return;
        setIsRolling(true);
        setRollTrigger(prev => prev + 1);
    };

    const handleRollComplete = (result: RollResult) => {
        setHistory(prev => [...prev, result]);
        setIsRolling(false);
    };

    const resetStats = () => {
        setHistory([]);
    };

    // Calculate stats
    const stats = useMemo(() => {
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        history.forEach(r => counts[r]++);
        const total = history.length || 1; // Avoid div by 0
        return Object.entries(counts).map(([face, count]) => ({
            face: Number(face),
            count,
            percent: (count / total) * 100
        }));
    }, [history]);

    return (
        <div className="w-full h-screen bg-slate-950 text-white relative overflow-hidden font-sans">
            {/* UI Overlay */}
            <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <Button variant="ghost" onClick={() => navigate('/math')} className="bg-slate-900/80 backdrop-blur hover:bg-slate-800 shadow-sm rounded-full text-white border border-slate-700">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Math Realm
                    </Button>
                </div>

                {/* Stats Panel */}
                <div className="pointer-events-auto bg-slate-900/90 backdrop-blur p-6 rounded-2xl border border-slate-700 shadow-2xl w-80">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg flex items-center text-violet-400">
                            <BarChart3 className="w-5 h-5 mr-2" />
                            Distribution
                        </h3>
                        <span className="text-xs text-slate-400">Total Rolls: {history.length}</span>
                    </div>

                    <div className="space-y-3">
                        {stats.map((stat) => (
                            <div key={stat.face} className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300">
                                    <span>Face {stat.face}</span>
                                    <span>{stat.percent.toFixed(1)}%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                                        style={{ width: `${stat.percent}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-500">
                                    <span>Count: {stat.count}</span>
                                    <span>Exp: 16.7%</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button onClick={resetStats} variant="ghost" className="w-full mt-4 text-xs text-slate-400 hover:text-white">
                        <RefreshCw className="w-3 h-3 mr-2" />
                        Reset Data
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
                <Button
                    onClick={rollDice}
                    disabled={isRolling}
                    className="px-12 py-6 text-xl bg-violet-600 hover:bg-violet-500 text-white rounded-2xl shadow-xl shadow-violet-500/20 border-b-4 border-violet-800 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Dices className={`w-8 h-8 mr-3 ${isRolling ? 'animate-spin' : ''}`} />
                    {isRolling ? 'Rolling...' : 'Roll Dice'}
                </Button>
            </div>

            {/* 3D Scene */}
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 8, 8], fov: 45 }}>
                <color attach="background" args={['#0f172a']} />
                <fog attach="fog" args={['#0f172a', 10, 30]} />

                <ambientLight intensity={0.4} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />

                <Environment preset="night" />

                <DiceScene
                    rollTrigger={rollTrigger}
                    onRollComplete={handleRollComplete}
                />

                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
                </mesh>
                <gridHelper args={[100, 20, "#334155", "#1e293b"]} position={[0, -1.99, 0]} />

                <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 4} />
            </Canvas>
        </div>
    );
};

const DiceScene = ({ rollTrigger, onRollComplete }: { rollTrigger: number, onRollComplete: (res: RollResult) => void }) => {
    const diceRef = useRef<THREE.Group>(null);
    const [targetRotation, setTargetRotation] = useState<[number, number, number]>([0, 0, 0]);
    const [isAnimating, setIsAnimating] = useState(false);

    // Dice face rotations (approximate)
    // 1: [0, 0, 0]
    // 2: [0, -PI/2, 0]
    // 3: [PI/2, 0, 0]
    // 4: [-PI/2, 0, 0]
    // 5: [0, PI/2, 0]
    // 6: [PI, 0, 0]
    const faceRotations: Record<number, [number, number, number]> = {
        1: [0, 0, 0],
        6: [Math.PI, 0, 0],
        2: [0, 0, Math.PI / 2], // Adjusted for standard dice layout
        5: [0, 0, -Math.PI / 2],
        3: [-Math.PI / 2, 0, 0],
        4: [Math.PI / 2, 0, 0],
    };

    useEffect(() => {
        if (rollTrigger > 0 && diceRef.current) {
            setIsAnimating(true);

            // Determine result
            const result = (Math.floor(Math.random() * 6) + 1) as RollResult;
            const target = faceRotations[result];

            // Add random full rotations for effect
            const spins = 2 + Math.floor(Math.random() * 2);
            const finalRot: [number, number, number] = [
                target[0] + spins * Math.PI * 2,
                target[1] + spins * Math.PI * 2,
                target[2] + spins * Math.PI * 2
            ];

            setTargetRotation(finalRot);

            // Animation logic handled in useFrame, but we need to signal completion
            setTimeout(() => {
                setIsAnimating(false);
                onRollComplete(result);
                // Reset rotation to base equivalent (remove extra spins) to prevent huge numbers
                if (diceRef.current) {
                    diceRef.current.rotation.set(target[0], target[1], target[2]);
                }
            }, 1000);
        }
    }, [rollTrigger]);

    useFrame((state, delta) => {
        if (diceRef.current && isAnimating) {
            // Lerp rotation
            diceRef.current.rotation.x = THREE.MathUtils.lerp(diceRef.current.rotation.x, targetRotation[0], delta * 5);
            diceRef.current.rotation.y = THREE.MathUtils.lerp(diceRef.current.rotation.y, targetRotation[1], delta * 5);
            diceRef.current.rotation.z = THREE.MathUtils.lerp(diceRef.current.rotation.z, targetRotation[2], delta * 5);

            // Jump effect
            // const time = state.clock.elapsedTime;
            // const jumpHeight = Math.sin(time * 15) * 2 * (1 - Math.min(1, (state.clock.elapsedTime % 1))); // Simple decay
            // Actually, simpler jump:
            if (isAnimating) {
                diceRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 2 + 1;
            }
        } else if (diceRef.current) {
            // Settle
            diceRef.current.position.y = THREE.MathUtils.lerp(diceRef.current.position.y, 1, delta * 5);
        }
    });

    return (
        <group ref={diceRef} position={[0, 1, 0]}>
            <DiceModel />
        </group>
    );
};

const DiceModel = () => {
    // Simple Cube with dots
    return (
        <RoundedBox args={[2, 2, 2]} radius={0.2} smoothness={4} castShadow receiveShadow>
            <meshStandardMaterial color="#ffffff" />
            {/* Dots would be separate meshes or textures. For now, using a simple texture approach or just geometry dots */}
            <DiceDots />
        </RoundedBox>
    );
};

const DiceDots = () => {
    const Dot = ({ pos }: { pos: [number, number, number] }) => (
        <mesh position={pos}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="black" />
        </mesh>
    );

    return (
        <>
            {/* Face 1 (Front) */}
            <Dot pos={[0, 0, 1.05]} />

            {/* Face 6 (Back) */}
            <group position={[0, 0, -1.05]}>
                <Dot pos={[-0.5, 0.5, 0]} /> <Dot pos={[0.5, 0.5, 0]} />
                <Dot pos={[-0.5, 0, 0]} /> <Dot pos={[0.5, 0, 0]} />
                <Dot pos={[-0.5, -0.5, 0]} /> <Dot pos={[0.5, -0.5, 0]} />
            </group>

            {/* Face 2 (Top) - Actually let's map standard dice faces */}
            {/* Standard Dice: 1 opposite 6, 2 opposite 5, 3 opposite 4 */}

            {/* Face 2 (Up) */}
            <group position={[0, 1.05, 0]}>
                <Dot pos={[-0.5, 0, -0.5]} /> <Dot pos={[0.5, 0, 0.5]} />
            </group>

            {/* Face 5 (Down) */}
            <group position={[0, -1.05, 0]}>
                <Dot pos={[-0.5, 0, -0.5]} /> <Dot pos={[0.5, 0, 0.5]} />
                <Dot pos={[-0.5, 0, 0.5]} /> <Dot pos={[0.5, 0, -0.5]} />
                <Dot pos={[0, 0, 0]} />
            </group>

            {/* Face 3 (Right) */}
            <group position={[1.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <Dot pos={[-0.5, 0, -0.5]} /> <Dot pos={[0, 0, 0]} /> <Dot pos={[0.5, 0, 0.5]} />
            </group>

            {/* Face 4 (Left) */}
            <group position={[-1.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <Dot pos={[-0.5, 0, -0.5]} /> <Dot pos={[0.5, 0, 0.5]} />
                <Dot pos={[-0.5, 0, 0.5]} /> <Dot pos={[0.5, 0, -0.5]} />
            </group>
        </>
    );
};
