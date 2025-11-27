import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Activity, Settings2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Astra } from '../../components/Astra';

export const Momentum: React.FC = () => {
    const navigate = useNavigate();

    // Object 1 State
    const [m1, setM1] = useState(2);
    const [v1, setV1] = useState(5);
    const [p1, setP1] = useState(50);

    // Object 2 State
    const [m2, setM2] = useState(2);
    const [v2, setV2] = useState(-5);
    const [p2, setP2] = useState(450);

    const [isPlaying, setIsPlaying] = useState(false);
    const [slowMotion, setSlowMotion] = useState(false);
    const [collisionType, setCollisionType] = useState<'elastic' | 'inelastic'>('elastic');
    const requestRef = useRef<number | null>(null);

    // Initial State for Reset
    const [initialV1, setInitialV1] = useState(5);
    const [initialV2, setInitialV2] = useState(-5);

    const animate = () => {
        if (isPlaying) {
            const dt = slowMotion ? 0.2 : 1;

            setP1((prevP1) => prevP1 + v1 * dt);
            setP2((prevP2) => prevP2 + v2 * dt);

            // Collision Logic
            const r1 = (m1 * 10 + 30) / 2;
            const r2 = (m2 * 10 + 30) / 2;
            const dist = p2 - p1;
            const minDist = r1 + r2;

            if (dist <= minDist) {
                if (collisionType === 'elastic') {
                    // Elastic Collision Formula (Conservation of Momentum & Kinetic Energy)
                    // v1f = ((m1-m2)v1i + 2m2v2i) / (m1+m2)
                    // v2f = ((m2-m1)v2i + 2m1v1i) / (m1+m2)
                    const newV1 = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
                    const newV2 = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
                    setV1(newV1);
                    setV2(newV2);
                } else {
                    // Inelastic Collision Formula (Objects stick together)
                    // vf = (m1v1i + m2v2i) / (m1+m2)
                    const commonVelocity = (m1 * v1 + m2 * v2) / (m1 + m2);
                    setV1(commonVelocity);
                    setV2(commonVelocity);
                }

                // Separation Logic (Crucial to prevent sticking/overlap)
                const overlap = minDist - dist;
                const totalMass = m1 + m2;
                // Move them apart proportional to inverse mass (lighter moves more)
                const move1 = (overlap * (m2 / totalMass)) + 0.1;
                const move2 = (overlap * (m1 / totalMass)) + 0.1;

                setP1(prev => prev - move1);
                setP2(prev => prev + move2);
            }
        }
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [isPlaying, v1, v2, p1, p2, m1, m2, slowMotion, collisionType]);

    const handleReset = () => {
        setIsPlaying(false);
        setP1(50);
        setP2(450);
        setV1(initialV1);
        setV2(initialV2);
    };

    const totalMomentum = m1 * v1 + m2 * v2;

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/physix')} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-display font-bold text-brand-black">Conservation of Momentum</h1>
                    <p className="text-gray-500">Explore Elastic and Inelastic collisions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Settings2 className="w-5 h-5" />
                            Configuration
                        </h2>

                        <div className="space-y-6">
                            {/* Collision Type */}
                            <div className="p-3 bg-gray-100 rounded-lg">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Collision Type</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCollisionType('elastic')}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-colors ${collisionType === 'elastic' ? 'bg-brand-blue text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        Elastic (Bounce)
                                    </button>
                                    <button
                                        onClick={() => setCollisionType('inelastic')}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-colors ${collisionType === 'inelastic' ? 'bg-brand-blue text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        Inelastic (Stick)
                                    </button>
                                </div>
                            </div>

                            {/* Object 1 Controls */}
                            <div className="p-4 bg-blue-50 rounded-lg space-y-3 border border-blue-100">
                                <h3 className="font-bold text-blue-800 flex justify-between">
                                    Blue Object <span>m₁ = {m1}kg</span>
                                </h3>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Mass</label>
                                    <input type="range" min="1" max="10" value={m1} onChange={(e) => setM1(Number(e.target.value))} className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600" disabled={isPlaying} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Initial Velocity: {initialV1} m/s</label>
                                    <input type="range" min="0" max="10" value={initialV1} onChange={(e) => { setInitialV1(Number(e.target.value)); setV1(Number(e.target.value)); }} className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600" disabled={isPlaying} />
                                </div>
                            </div>

                            {/* Object 2 Controls */}
                            <div className="p-4 bg-red-50 rounded-lg space-y-3 border border-red-100">
                                <h3 className="font-bold text-red-800 flex justify-between">
                                    Red Object <span>m₂ = {m2}kg</span>
                                </h3>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Mass</label>
                                    <input type="range" min="1" max="10" value={m2} onChange={(e) => setM2(Number(e.target.value))} className="w-full h-1 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600" disabled={isPlaying} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Initial Velocity: {initialV2} m/s</label>
                                    <input type="range" min="-10" max="0" value={initialV2} onChange={(e) => { setInitialV2(Number(e.target.value)); setV2(Number(e.target.value)); }} className="w-full h-1 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600" disabled={isPlaying} />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="slowMo"
                                    checked={slowMotion}
                                    onChange={(e) => setSlowMotion(e.target.checked)}
                                    className="w-4 h-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue"
                                />
                                <label htmlFor="slowMo" className="text-sm font-medium text-gray-700">Slow Motion</label>
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={() => setIsPlaying(!isPlaying)} className="w-full">
                                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                    {isPlaying ? 'Pause' : 'Start'}
                                </Button>
                                <Button onClick={handleReset} variant="outline">
                                    <RotateCcw className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-green-50 border-green-100">
                        <div className="flex items-start gap-3">
                            <Activity className="w-5 h-5 text-green-600 mt-1" />
                            <div>
                                <h3 className="font-bold text-green-800 mb-1">Total Momentum</h3>
                                <p className="text-3xl font-black text-green-700 tracking-tight">{totalMomentum.toFixed(2)} <span className="text-sm font-normal text-green-600">kg·m/s</span></p>
                                <p className="text-xs text-green-800 mt-2 font-mono bg-green-100 p-2 rounded">
                                    P_total = m₁v₁ + m₂v₂
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 h-[400px] flex flex-col justify-center bg-gray-50 relative overflow-hidden border-2 border-gray-200">
                        <div className="absolute top-4 right-4 text-xs font-mono text-gray-400">
                            System: Isolated | Friction: None
                        </div>

                        <div className="absolute bottom-10 left-0 w-full h-1 bg-gray-300"></div>

                        {/* Object 1 */}
                        <div
                            className="absolute bottom-11 rounded-full shadow-lg flex items-center justify-center text-white font-bold transition-transform will-change-transform bg-blue-500 border-2 border-blue-600 z-10"
                            style={{
                                width: `${m1 * 10 + 30}px`,
                                height: `${m1 * 10 + 30}px`,
                                transform: `translateX(${p1}px)`
                            }}
                        >
                            {m1}kg
                        </div>
                        {/* Momentum Vector 1 */}
                        <div
                            className="absolute bottom-24 h-4 bg-blue-500/30 transition-transform origin-left flex items-center rounded-r-full backdrop-blur-sm border border-blue-300"
                            style={{
                                width: `${Math.abs(m1 * v1) * 3}px`,
                                transform: `translateX(${p1 + (m1 * 10 + 30) / 2}px) ${v1 < 0 ? 'rotate(180deg)' : ''}`
                            }}
                        >
                            <span className={`text-xs font-bold text-blue-700 absolute -top-5 ${v1 < 0 ? 'rotate-180 right-0' : 'left-0'}`}>
                                p₁ = {(m1 * v1).toFixed(1)}
                            </span>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-blue-500 border-b-[6px] border-b-transparent"></div>
                        </div>

                        {/* Object 2 */}
                        <div
                            className="absolute bottom-11 rounded-full shadow-lg flex items-center justify-center text-white font-bold transition-transform will-change-transform bg-red-500 border-2 border-red-600 z-10"
                            style={{
                                width: `${m2 * 10 + 30}px`,
                                height: `${m2 * 10 + 30}px`,
                                transform: `translateX(${p2}px)`
                            }}
                        >
                            {m2}kg
                        </div>
                        {/* Momentum Vector 2 */}
                        <div
                            className="absolute bottom-24 h-4 bg-red-500/30 transition-transform origin-left flex items-center rounded-r-full backdrop-blur-sm border border-red-300"
                            style={{
                                width: `${Math.abs(m2 * v2) * 3}px`,
                                transform: `translateX(${p2 + (m2 * 10 + 30) / 2}px) ${v2 < 0 ? 'rotate(180deg)' : ''}`
                            }}
                        >
                            <span className={`text-xs font-bold text-red-700 absolute -top-5 ${v2 < 0 ? 'rotate-180 right-0' : 'left-0'}`}>
                                p₂ = {(m2 * v2).toFixed(1)}
                            </span>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-red-500 border-b-[6px] border-b-transparent"></div>
                        </div>

                    </Card>

                    {/* Real-time Data Table */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4 border-l-4 border-l-blue-500">
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-bold text-blue-800">Object 1</span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Left</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-500 text-xs">Velocity (v₁)</div>
                                    <div className="font-mono font-bold">{v1.toFixed(2)} m/s</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-500 text-xs">Momentum (p₁)</div>
                                    <div className="font-mono font-bold text-blue-600">{(m1 * v1).toFixed(2)}</div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 border-l-4 border-l-red-500">
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-bold text-red-800">Object 2</span>
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Right</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-500 text-xs">Velocity (v₂)</div>
                                    <div className="font-mono font-bold">{v2.toFixed(2)} m/s</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-500 text-xs">Momentum (p₂)</div>
                                    <div className="font-mono font-bold text-red-600">{(m2 * v2).toFixed(2)}</div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                        <strong>Did you know?</strong> In an isolated system, the total momentum before collision is equal to the total momentum after collision. This is true for both elastic and inelastic collisions!
                    </div>
                </div>
            </div>
            <Astra context="physics" topic="momentum" />
        </div>
    );
};
