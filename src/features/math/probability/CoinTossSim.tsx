import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { ArrowLeft, Coins, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Slider } from '../../../components/ui/Slider';

// --- 3D Components ---

const Coin = ({
    position,
    rotation
}: {
    position: [number, number, number],
    rotation: [number, number, number]
}) => {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={position} rotation={rotation}>
                {/* Coin Body */}
                <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
                    <meshStandardMaterial
                        color="#ffd700"
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>

                {/* Face Details (Simulated with rings for now) */}
                <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1, 1.4, 32]} />
                    <meshStandardMaterial color="#e6c200" />
                </mesh>
                <mesh position={[0, -0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1, 1.4, 32]} />
                    <meshStandardMaterial color="#c0c0c0" />
                </mesh>
            </group>
        </Float>
    );
};

// --- Main Component ---

export const CoinTossSim: React.FC = () => {
    const navigate = useNavigate();
    const [numCoins, setNumCoins] = useState(1);
    const [isFlipping, setIsFlipping] = useState(false);
    const [results, setResults] = useState<('H' | 'T')[]>([]);
    const [history, setHistory] = useState<{ heads: number, tails: number }>({ heads: 0, tails: 0 });

    const handleToss = () => {
        setIsFlipping(true);
        setResults([]); // Clear previous results immediately for animation start

        // Simulate flip duration
        setTimeout(() => {
            const newResults: ('H' | 'T')[] = [];
            let newHeads = 0;
            let newTails = 0;

            for (let i = 0; i < numCoins; i++) {
                const result = Math.random() > 0.5 ? 'H' : 'T';
                newResults.push(result);
                if (result === 'H') newHeads++;
                else newTails++;
            }

            setResults(newResults);
            setHistory(prev => ({
                heads: prev.heads + newHeads,
                tails: prev.tails + newTails
            }));
            setIsFlipping(false);
        }, 1500); // 1.5s flip animation
    };

    const resetHistory = () => {
        setHistory({ heads: 0, tails: 0 });
        setResults([]);
    };

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-4 shrink-0">
                <Button variant="ghost" onClick={() => navigate('/math')} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-display font-black text-brand-black">Coin Toss Sim</h1>
                    <p className="text-sm text-gray-500 font-bold">Probability & Sample Spaces</p>
                </div>
            </div>

            {/* Stats Panel (Neo-Brutalist) */}
            <div className="flex items-center gap-6 px-6 py-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div>
                    <span className="text-xs text-gray-500 font-black uppercase">Total Flips</span>
                    <p className="text-2xl font-mono font-black text-brand-black">{history.heads + history.tails}</p>
                </div>
                <div className="w-0.5 h-10 bg-gray-200" />
                <div>
                    <span className="text-xs text-gray-500 font-black uppercase">Heads</span>
                    <p className="text-2xl font-mono font-black text-brand-blue">{history.heads}</p>
                </div>
                <div>
                    <span className="text-xs text-gray-500 font-black uppercase">Tails</span>
                    <p className="text-2xl font-mono font-black text-purple-600">{history.tails}</p>
                </div>
                <div className="ml-auto">
                    <Button variant="ghost" onClick={resetHistory} className="text-gray-500 hover:text-red-500">
                        <RefreshCw className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Controls */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card className="bg-yellow-50 border-yellow-200">
                        <div className="flex flex-col items-center text-center gap-4">
                            <Coins className="w-12 h-12 text-yellow-600" />
                            <p className="text-sm leading-relaxed text-brand-black font-bold">
                                "Each coin flip is an independent event. The probability of Heads is always 0.5."
                            </p>
                        </div>
                    </Card>

                    <Card className="flex-1 space-y-6">
                        <div>
                            <h3 className="font-black text-brand-black mb-4">Configuration</h3>
                            <Slider
                                label="Number of Coins"
                                value={numCoins}
                                min={1}
                                max={5}
                                step={1}
                                onChange={setNumCoins}
                                color="purple"
                            />
                        </div>

                        <Button
                            onClick={handleToss}
                            disabled={isFlipping}
                            className="w-full py-4 text-lg font-black bg-brand-black text-white hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all"
                        >
                            {isFlipping ? 'FLIPPING...' : 'TOSS COINS'}
                        </Button>

                        {/* Last Toss Result */}
                        {results.length > 0 && (
                            <div className="bg-gray-100 p-4 rounded-xl border-2 border-gray-200">
                                <span className="text-xs text-gray-500 font-black uppercase mb-2 block">Last Result</span>
                                <div className="flex gap-2 flex-wrap">
                                    {results.map((r, i) => (
                                        <span key={i} className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-black text-white ${r === 'H' ? 'bg-brand-blue' : 'bg-purple-600'}`}>
                                            {r}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* 3D Scene */}
                <div className="lg:col-span-2 h-[500px] lg:h-auto rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-900 relative">
                    <Canvas camera={{ position: [0, 5, 10], fov: 50 }} shadows>
                        <Environment preset="city" />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} castShadow />

                        <group position={[0, 0, 0]}>
                            {Array.from({ length: numCoins }).map((_, i) => {
                                // Arrange coins in a line or grid
                                const offset = (i - (numCoins - 1) / 2) * 4;
                                return (
                                    <Coin
                                        key={i}
                                        position={[offset, 0, 0]}
                                        rotation={[isFlipping ? Math.PI * 10 : (results[i] === 'T' ? Math.PI : 0), 0, 0]}
                                    />
                                );
                            })}
                        </group>
                    </Canvas>

                    {/* Overlay Info */}
                    <div className="absolute bottom-4 right-4 text-white/50 text-xs font-mono">
                        3D Simulation
                    </div>
                </div>
            </div>
        </div>
    );
};
