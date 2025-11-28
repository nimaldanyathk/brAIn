import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Info, Battery, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';


export const Energy: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'work' | 'conservation'>('work');

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/physix')} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-display font-bold text-brand-black">Energy & Work</h1>
                    <p className="text-gray-500">Explore the transformation and conservation of energy.</p>
                </div>
            </div>

            <div className="flex gap-4 border-b border-gray-200 pb-2">
                <button
                    onClick={() => setActiveTab('work')}
                    className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'work'
                        ? 'bg-blue-50 text-brand-blue border-b-2 border-brand-blue'
                        : 'text-gray-500 hover:text-brand-black hover:bg-gray-50'
                        }`}
                >
                    Work-Energy Theorem
                </button>
                <button
                    onClick={() => setActiveTab('conservation')}
                    className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'conservation'
                        ? 'bg-blue-50 text-brand-blue border-b-2 border-brand-blue'
                        : 'text-gray-500 hover:text-brand-black hover:bg-gray-50'
                        }`}
                >
                    Conservation of Energy
                </button>
            </div>

            <div className="min-h-[500px]">
                {activeTab === 'work' && <WorkEnergy />}
                {activeTab === 'conservation' && <ConservationEnergy />}
            </div>
            
        </div>
    );
};

const WorkEnergy: React.FC = () => {
    const [force, setForce] = useState(10);
    const [mass, setMass] = useState(2);
    const [distance, setDistance] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const requestRef = useRef<number | null>(null);

    // Work = Force * Distance
    // KE = 0.5 * m * v^2
    // Work = Change in KE (assuming start from rest)
    // v = sqrt(2*Work / m)

    const workDone = force * distance;
    const velocity = Math.sqrt((2 * workDone) / mass);

    // Work-Energy Animation
    const animate = () => {
        if (isPlaying) {
            setDistance((prev) => {
                if (prev >= 100) {
                    setIsPlaying(false);
                    return 100;
                }
                // Slower animation speed for better visibility
                // Velocity is in m/s, we need to scale it to pixels/frame carefully
                // Let's say 1 meter = 5 pixels. 
                // If velocity is 10 m/s, that's 50 pixels/sec.
                // At 60fps, that's ~0.8 pixels/frame.
                const pixelsPerFrame = (velocity * 5) / 60;
                return prev + Math.max(0.1, pixelsPerFrame * 0.5); // Slow down factor
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
    }, [isPlaying, velocity]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Parameters</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Force (F): {force} N
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={force}
                                onChange={(e) => setForce(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                                disabled={isPlaying}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mass (m): {mass} kg
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={mass}
                                onChange={(e) => setMass(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                                disabled={isPlaying}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={() => setIsPlaying(!isPlaying)} className="w-full" disabled={distance >= 100}>
                                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                {isPlaying ? 'Pause' : 'Apply Force'}
                            </Button>
                            <Button onClick={() => { setDistance(0); setIsPlaying(false); }} variant="outline">
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="p-4 bg-gray-100 rounded-lg space-y-3">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Work Done (J)</span>
                                    <span className="font-bold text-brand-black">{workDone.toFixed(0)}</span>
                                </div>
                                <div className="w-full bg-gray-300 rounded-full h-2">
                                    <div
                                        className="bg-brand-blue h-2 rounded-full transition-all duration-75"
                                        style={{ width: `${Math.min(100, (workDone / 5000) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Gauge className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Velocity</span>
                                </div>
                                <span className="font-mono font-bold text-brand-black">{velocity.toFixed(1)} m/s</span>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-blue-50 border-blue-100">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-brand-blue mt-1" />
                        <div>
                            <h3 className="font-bold text-brand-blue mb-1">Work-Energy Theorem</h3>
                            <p className="text-sm text-blue-800">
                                Work ($W = F \cdot d$) transfers energy to the object, increasing its Kinetic Energy ($KE = \frac{1}{2}mv^2$).
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card className="p-6 h-[400px] flex flex-col justify-center bg-white relative overflow-hidden">
                    <div className="absolute bottom-10 left-0 w-full h-1 bg-gray-300"></div>

                    {/* Distance Markers */}
                    <div className="absolute bottom-5 left-10 text-gray-400 text-xs">0m</div>
                    <div className="absolute bottom-5 right-10 text-gray-400 text-xs">100m</div>

                    {/* Object */}
                    <div
                        className="absolute bottom-11 w-20 h-20 bg-brand-blue rounded-lg shadow-lg flex items-center justify-center text-white font-bold transition-transform will-change-transform"
                        style={{ left: '40px', transform: `translateX(${distance * 5}px)` }}
                    >
                        {mass}kg
                    </div>

                    {/* Force Arrow */}
                    {isPlaying && distance < 100 && (
                        <div
                            className="absolute bottom-20 left-10 flex items-center transition-transform will-change-transform"
                            style={{ transform: `translateX(${distance * 5}px)` }}
                        >
                            <div className="w-24 h-10 flex items-center justify-center">
                                <span className="text-red-500 font-bold animate-pulse whitespace-nowrap">Force {force}N â†’</span>
                            </div>
                        </div>
                    )}

                    {/* Speed Lines Effect */}
                    {velocity > 10 && (
                        <div
                            className="absolute bottom-16 h-10 w-20 opacity-30 transition-transform will-change-transform"
                            style={{
                                left: '10px',
                                transform: `translateX(${distance * 5}px)`,
                                background: 'linear-gradient(to right, transparent, #3b82f6)'
                            }}
                        ></div>
                    )}
                </Card>
            </div>
        </div>
    );
};

const ConservationEnergy: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [drag, setDrag] = useState(false);
    const requestRef = useRef<number | null>(null);

    // Physics State
    const [theta, setTheta] = useState(Math.PI / 4); // 45 degrees
    const [omega, setOmega] = useState(0); // Angular velocity

    // Physics Constants
    const L = 200; // Length in pixels (approx 2 meters visually)
    const damping = drag ? 0.995 : 1.0;
    const dt = 0.016; // Fixed time step (approx 60 FPS)

    // We need to refactor to use Refs for physics state to get true smooth updates
    // React state is too slow/batched for high-frequency physics integration
    const physicsState = useRef({ theta: Math.PI / 4, omega: 0 });

    // Sync Ref with State for rendering
    useEffect(() => {
        physicsState.current.theta = theta;
        physicsState.current.omega = omega; // Also sync omega on reset
    }, [theta, omega]); // Only when reset happens

    const animatePhysics = () => {
        if (isPlaying) {
            const state = physicsState.current;
            const gravityPixels = 980; // 1m = 100px

            const alpha = -(gravityPixels / L) * Math.sin(state.theta);
            state.omega = (state.omega + alpha * dt) * damping;
            state.theta += state.omega * dt;

            // Update React state for render
            setTheta(state.theta);
            setOmega(state.omega);
        }
        requestRef.current = requestAnimationFrame(animatePhysics);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animatePhysics);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [isPlaying, drag]); // Re-bind when playing state changes

    const handleReset = () => {
        setIsPlaying(false);
        setTheta(Math.PI / 4);
        setOmega(0);
    };

    // Energy Calculations
    // h = L - Lcos(theta)
    // PE = mgh (assume m=1)
    // KE = 0.5 * m * (L*omega)^2
    // We need to scale these for the UI bars

    const h = L * (1 - Math.cos(theta));
    const v = L * omega; // Tangential velocity
    const gRender = 9.8; // Use standard gravity for display calculation scaling
    const pe = gRender * h * 10; // Scale up
    const ke = 0.5 * v * v;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Pendulum Controls</h2>
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="drag"
                                checked={drag}
                                onChange={(e) => setDrag(e.target.checked)}
                                className="w-4 h-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue"
                            />
                            <label htmlFor="drag" className="text-sm font-medium text-gray-700">Enable Air Resistance</label>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={() => setIsPlaying(!isPlaying)} className="w-full">
                                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                {isPlaying ? 'Pause' : 'Release'}
                            </Button>
                            <Button onClick={handleReset} variant="outline">
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-200">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-blue-600 font-bold">Potential Energy (PE)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-75" style={{ width: `${Math.min(100, pe / 10)}%` }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-green-600 font-bold">Kinetic Energy (KE)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-600 h-2.5 rounded-full transition-all duration-75" style={{ width: `${Math.min(100, ke / 10)}%` }}></div>
                                </div>
                            </div>

                            {drag && (
                                <div className="text-xs text-gray-500 italic">
                                    Total energy decreases due to air resistance.
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-blue-50 border-blue-100">
                    <div className="flex items-start gap-3">
                        <Battery className="w-5 h-5 text-brand-blue mt-1" />
                        <div>
                            <h3 className="font-bold text-brand-blue mb-1">Conservation of Energy</h3>
                            <p className="text-sm text-blue-800">
                                As the pendulum falls, PE converts to KE. As it rises, KE converts back to PE.
                                Without friction, the total energy remains constant forever.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card className="p-6 h-[400px] flex justify-center bg-white relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 w-4 h-4 bg-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2 z-10"></div>

                    {/* Pendulum String */}
                    <div
                        className="absolute top-0 left-1/2 origin-top w-0.5 bg-gray-800 transition-transform will-change-transform"
                        style={{ height: `${L}px`, transform: `rotate(${theta}rad)` }}
                    ></div>

                    {/* Pendulum Bob */}
                    <div
                        className="absolute top-0 left-1/2 origin-top transition-transform will-change-transform"
                        style={{ transform: `rotate(${theta}rad)` }}
                    >
                        <div
                            className="w-12 h-12 bg-brand-purple rounded-full shadow-lg relative -left-6 flex items-center justify-center text-white text-xs font-bold"
                            style={{ top: `${L}px` }}
                        >
                            m
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

