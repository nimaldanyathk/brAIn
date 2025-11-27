import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Info, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Astra } from '../../components/Astra';

export const Gravitation: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'universal' | 'kepler'>('universal');

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/physix')} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-display font-bold text-brand-black">Gravitation</h1>
                    <p className="text-gray-500">Universal Law of Gravitation and Kepler's Laws.</p>
                </div>
            </div>

            <div className="flex gap-4 border-b border-gray-200 pb-2">
                <button
                    onClick={() => setActiveTab('universal')}
                    className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'universal'
                        ? 'bg-blue-50 text-brand-blue border-b-2 border-brand-blue'
                        : 'text-gray-500 hover:text-brand-black hover:bg-gray-50'
                        }`}
                >
                    Universal Law
                </button>
                <button
                    onClick={() => setActiveTab('kepler')}
                    className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'kepler'
                        ? 'bg-blue-50 text-brand-blue border-b-2 border-brand-blue'
                        : 'text-gray-500 hover:text-brand-black hover:bg-gray-50'
                        }`}
                >
                    Kepler's Laws
                </button>
            </div>

            <div className="min-h-[500px]">
                {activeTab === 'universal' && <UniversalLaw />}
                {activeTab === 'kepler' && <KeplersLaws />}
            </div>
            <Astra context="physics" topic="gravitation" />
        </div>
    );
};

const UniversalLaw: React.FC = () => {
    const [m1, setM1] = useState(50);
    const [m2, setM2] = useState(50);
    const [distance, setDistance] = useState(200);

    // F = G * (m1 * m2) / r^2
    // We'll use a scaled G for visualization
    const G = 1000;
    const force = (G * m1 * m2) / (distance * distance);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Parameters</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mass 1 (m1): {m1} kg
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={m1}
                                onChange={(e) => setM1(Number(e.target.value))}
                                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mass 2 (m2): {m2} kg
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={m2}
                                onChange={(e) => setM2(Number(e.target.value))}
                                className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Distance (r): {distance} m
                            </label>
                            <input
                                type="range"
                                min="100"
                                max="400"
                                value={distance}
                                onChange={(e) => setDistance(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600"
                            />
                        </div>

                        <div className="p-4 bg-gray-100 rounded-lg text-center">
                            <p className="text-sm text-gray-600">Gravitational Force (F):</p>
                            <p className="text-3xl font-bold text-brand-black">{force.toFixed(2)} N</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-blue-50 border-blue-100">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-brand-blue mt-1" />
                        <div>
                            <h3 className="font-bold text-brand-blue mb-1">Newton's Law</h3>
                            <p className="text-sm text-blue-800">
                                Every mass attracts every other mass. Force is proportional to the product of masses and inversely proportional to the square of distance.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card className="p-6 h-[400px] flex items-center justify-center bg-black relative overflow-hidden">
                    {/* Stars Background */}
                    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

                    {/* Mass 1 */}
                    <div
                        className="absolute rounded-full bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center text-white font-bold transition-all duration-300"
                        style={{
                            width: `${m1 + 20}px`,
                            height: `${m1 + 20}px`,
                            left: `calc(50% - ${distance / 2}px - ${(m1 + 20) / 2}px)`
                        }}
                    >
                        m1
                    </div>

                    {/* Mass 2 */}
                    <div
                        className="absolute rounded-full bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] flex items-center justify-center text-white font-bold transition-all duration-300"
                        style={{
                            width: `${m2 + 20}px`,
                            height: `${m2 + 20}px`,
                            left: `calc(50% + ${distance / 2}px - ${(m2 + 20) / 2}px)`
                        }}
                    >
                        m2
                    </div>

                    {/* Force Arrows */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] h-10 pointer-events-none">
                        <div
                            className="absolute top-1/2 left-1/2 -translate-y-1/2 h-0.5 bg-white opacity-30"
                            style={{ width: `${distance}px`, transform: 'translateX(-50%)' }}
                        ></div>
                        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 text-white text-xs bg-black px-2" style={{ transform: 'translate(-50%, -50%)' }}>
                            r = {distance}m
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const KeplersLaws: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [eccentricity, setEccentricity] = useState(0.6);
    const requestRef = useRef<number | null>(null);
    const angleRef = useRef(0);
    const [planetPos, setPlanetPos] = useState({ x: 0, y: 0 });

    // Ellipse parameters
    const a = 150; // semi-major axis
    const b = a * Math.sqrt(1 - eccentricity * eccentricity); // semi-minor axis
    const c = a * eccentricity; // distance from center to focus

    const animate = () => {
        if (isPlaying) {
            // Kepler's 2nd Law approximation: d(theta)/dt = L / (m * r^2)
            // Closer to sun (r is small) -> faster angular velocity

            // Calculate current radius r
            const r = Math.sqrt(Math.pow(a * Math.cos(angleRef.current) - c, 2) + Math.pow(b * Math.sin(angleRef.current), 2));

            // Angular velocity varies inversely with r^2 (simplified)
            const angularVelocity = 2000 / (r * r);

            angleRef.current += angularVelocity;
            if (angleRef.current > 2 * Math.PI) angleRef.current -= 2 * Math.PI;

            setPlanetPos({
                x: a * Math.cos(angleRef.current),
                y: b * Math.sin(angleRef.current)
            });
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
    }, [isPlaying, eccentricity]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Orbit Controls</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Eccentricity (e): {eccentricity}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="0.8"
                                step="0.1"
                                value={eccentricity}
                                onChange={(e) => setEccentricity(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                            />
                            <p className="text-xs text-gray-500 mt-1">0 = Circle, close to 1 = Very Elliptical</p>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={() => setIsPlaying(!isPlaying)} className="w-full">
                                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                {isPlaying ? 'Pause' : 'Start Orbit'}
                            </Button>
                            <Button onClick={() => { setEccentricity(0.6); setIsPlaying(false); }} variant="outline">
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-blue-50 border-blue-100">
                    <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-brand-blue mt-1" />
                        <div>
                            <h3 className="font-bold text-brand-blue mb-1">Kepler's Laws</h3>
                            <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
                                <li>Planets move in ellipses with Sun at one focus.</li>
                                <li>Planets sweep equal areas in equal times (faster when closer).</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card className="p-6 h-[400px] flex items-center justify-center bg-black relative overflow-hidden">
                    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

                    {/* Orbit Path */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <ellipse
                            cx="50%"
                            cy="50%"
                            rx={a}
                            ry={b}
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                        />
                    </svg>

                    {/* Sun (at focus -c) */}
                    <div
                        className="absolute rounded-full bg-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.6)] flex items-center justify-center text-yellow-900 font-bold"
                        style={{
                            width: '40px',
                            height: '40px',
                            left: `calc(50% - 20px - ${c}px)`,
                            top: 'calc(50% - 20px)'
                        }}
                    >
                        Sun
                    </div>

                    {/* Planet */}
                    <div
                        className="absolute rounded-full bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.8)]"
                        style={{
                            width: '20px',
                            height: '20px',
                            left: `calc(50% - 10px + ${planetPos.x}px)`,
                            top: `calc(50% - 10px + ${planetPos.y}px)`
                        }}
                    ></div>
                </Card>
            </div>
        </div>
    );
};
