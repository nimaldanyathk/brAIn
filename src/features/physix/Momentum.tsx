import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Activity } from 'lucide-react';
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
    const requestRef = useRef<number | null>(null);

    // Initial State for Reset
    const [initialV1, setInitialV1] = useState(5);
    const [initialV2, setInitialV2] = useState(-5);

    const animate = () => {
        if (isPlaying) {
            const dt = slowMotion ? 0.2 : 1;

            setP1((prevP1) => {
                const nextP1 = prevP1 + v1 * dt;
                return nextP1;
            });

            setP2((prevP2) => {
                const nextP2 = prevP2 + v2 * dt;
                return nextP2;
            });

            // Collision Logic
            // Check if they overlap
            // Radius approx = m*10 + 30 / 2
            const r1 = (m1 * 10 + 30) / 2;
            const r2 = (m2 * 10 + 30) / 2;
            const dist = p2 - p1;
            const minDist = r1 + r2;

            if (dist <= minDist) {
                // Elastic Collision Formula
                const newV1 = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
                const newV2 = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);

                setV1(newV1);
                setV2(newV2);

                // Separation Logic (Crucial to prevent sticking)
                const overlap = minDist - dist;
                // Move them apart proportional to inverse mass (lighter moves more)
                const totalMass = m1 + m2;
                const move1 = (overlap * (m2 / totalMass)) + 0.1; // +0.1 buffer
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
    }, [isPlaying, v1, v2, p1, p2, m1, m2, slowMotion]);

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
                    <p className="text-gray-500">Elastic collisions in an isolated system.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">Parameters</h2>

                        <div className="space-y-6">
                            {/* Object 1 Controls */}
                            <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                                <h3 className="font-bold text-blue-800">Blue Object (Left)</h3>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Mass: {m1}kg</label>
                                    <input type="range" min="1" max="10" value={m1} onChange={(e) => setM1(Number(e.target.value))} className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600" disabled={isPlaying} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Initial Velocity: {initialV1}m/s</label>
                                    <input type="range" min="0" max="10" value={initialV1} onChange={(e) => { setInitialV1(Number(e.target.value)); setV1(Number(e.target.value)); }} className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600" disabled={isPlaying} />
                                </div>
                            </div>

                            {/* Object 2 Controls */}
                            <div className="p-4 bg-red-50 rounded-lg space-y-3">
                                <h3 className="font-bold text-red-800">Red Object (Right)</h3>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Mass: {m2}kg</label>
                                    <input type="range" min="1" max="10" value={m2} onChange={(e) => setM2(Number(e.target.value))} className="w-full h-1 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600" disabled={isPlaying} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Initial Velocity: {initialV2}m/s</label>
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
                                <p className="text-2xl font-bold text-green-700">{totalMomentum.toFixed(2)} kg·m/s</p>
                                <p className="text-sm text-green-800 mt-2">
                                    {'$P_{total} = m_1v_1 + m_2v_2$'}
                                    <br />
                                    Remains constant before and after collision!
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="p-6 h-[400px] flex flex-col justify-center bg-gray-50 relative overflow-hidden">
                        <div className="absolute bottom-10 left-0 w-full h-1 bg-gray-300"></div>

                        {/* Object 1 */}
                        <div
                            className="absolute bottom-11 rounded-full shadow-lg flex items-center justify-center text-white font-bold transition-transform will-change-transform bg-blue-500 border-2 border-blue-600"
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
                            className="absolute bottom-24 h-2 bg-blue-500/80 transition-transform origin-left flex items-center"
                            style={{
                                width: `${Math.abs(m1 * v1) * 2}px`,
                                transform: `translateX(${p1 + (m1 * 10 + 30) / 2}px) ${v1 < 0 ? 'rotate(180deg)' : ''}`
                            }}
                        >
                            <span className={`text-xs font-bold text-blue-700 absolute -top-4 ${v1 < 0 ? 'rotate-180 right-0' : 'left-0'}`}>p1</span>
                        </div>

                        {/* Object 2 */}
                        <div
                            className="absolute bottom-11 rounded-full shadow-lg flex items-center justify-center text-white font-bold transition-transform will-change-transform bg-red-500 border-2 border-red-600"
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
                            className="absolute bottom-24 h-2 bg-red-500/80 transition-transform origin-left flex items-center"
                            style={{
                                width: `${Math.abs(m2 * v2) * 2}px`,
                                transform: `translateX(${p2 + (m2 * 10 + 30) / 2}px) ${v2 < 0 ? 'rotate(180deg)' : ''}`
                            }}
                        >
                            <span className={`text-xs font-bold text-red-700 absolute -top-4 ${v2 < 0 ? 'rotate-180 right-0' : 'left-0'}`}>p2</span>
                        </div>

                    </Card>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <Card className="p-4 flex justify-between items-center border-l-4 border-l-blue-500">
                            <div>
                                <div className="text-xs text-gray-500">Momentum (p1)</div>
                                <div className="text-xl font-bold text-blue-600">{(m1 * v1).toFixed(1)}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500">Velocity (v1)</div>
                                <div className="font-mono text-gray-700">{v1.toFixed(2)} m/s</div>
                            </div>
                        </Card>
                        <Card className="p-4 flex justify-between items-center border-l-4 border-l-red-500">
                            <div>
                                <div className="text-xs text-gray-500">Momentum (p2)</div>
                                <div className="text-xl font-bold text-red-600">{(m2 * v2).toFixed(1)}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500">Velocity (v2)</div>
                                <div className="font-mono text-gray-700">{v2.toFixed(2)} m/s</div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            <Astra context="physics" topic="momentum" />
        </div>
    );
};
