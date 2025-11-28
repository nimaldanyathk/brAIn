import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Info, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';


export const NewtonLaws: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'first' | 'second' | 'third'>('first');

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/physix')} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-display font-bold text-brand-black">Newton's Laws of Motion</h1>
                    <p className="text-gray-500">Explore the fundamental principles of motion.</p>
                </div>
            </div>

            <div className="flex gap-4 border-b border-gray-200 pb-2">
                <button
                    onClick={() => setActiveTab('first')}
                    className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'first'
                        ? 'bg-blue-50 text-brand-blue border-b-2 border-brand-blue'
                        : 'text-gray-500 hover:text-brand-black hover:bg-gray-50'
                        }`}
                >
                    First Law (Inertia)
                </button>
                <button
                    onClick={() => setActiveTab('second')}
                    className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'second'
                        ? 'bg-blue-50 text-brand-blue border-b-2 border-brand-blue'
                        : 'text-gray-500 hover:text-brand-black hover:bg-gray-50'
                        }`}
                >
                    Second Law (F=ma)
                </button>
                <button
                    onClick={() => setActiveTab('third')}
                    className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'third'
                        ? 'bg-blue-50 text-brand-blue border-b-2 border-brand-blue'
                        : 'text-gray-500 hover:text-brand-black hover:bg-gray-50'
                        }`}
                >
                    Third Law (Action-Reaction)
                </button>
            </div>

            <div className="min-h-[500px]">
                {activeTab === 'first' && <FirstLaw />}
                {activeTab === 'second' && <SecondLaw />}
                {activeTab === 'third' && <ThirdLaw />}
            </div>
            
        </div>
    );
};

const FirstLaw: React.FC = () => {
    const [velocity, setVelocity] = useState(0);
    const [surface, setSurface] = useState<'ice' | 'sand'>('ice');
    const [position, setPosition] = useState(50);
    const [isPlaying, setIsPlaying] = useState(false);
    const requestRef = useRef<number | null>(null);

    const frictionCoeff = surface === 'ice' ? 0.005 : 0.15;

    const animate = () => {
        if (isPlaying) {
            setPosition((prevPos) => {
                let newPos = prevPos + velocity;
                // Wall collision (stop)
                if (newPos > 700) {
                    setIsPlaying(false);
                    setVelocity(0);
                    return 700;
                }
                return newPos;
            });

            setVelocity((prevVel) => {
                if (prevVel <= 0) return 0;
                const newVel = Math.max(0, prevVel - frictionCoeff);
                if (newVel === 0) setIsPlaying(false);
                return newVel;
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
    }, [isPlaying, surface]); // Re-run if surface changes to update friction logic context if needed

    const handlePush = (force: number) => {
        setVelocity(force);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setPosition(50);
        setVelocity(0);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Controls</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Surface Type
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSurface('ice')}
                                    className={`flex-1 py-2 px-4 rounded-lg border ${surface === 'ice' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white border-gray-300'}`}
                                >
                                    Ice (Low Friction)
                                </button>
                                <button
                                    onClick={() => setSurface('sand')}
                                    className={`flex-1 py-2 px-4 rounded-lg border ${surface === 'sand' ? 'bg-yellow-100 border-yellow-500 text-yellow-700' : 'bg-white border-gray-300'}`}
                                >
                                    Sand (High Friction)
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Apply Force (Push)
                            </label>
                            <div className="flex gap-2">
                                <Button onClick={() => handlePush(5)} size="sm" variant="outline" disabled={isPlaying && velocity > 0}>Light Push</Button>
                                <Button onClick={() => handlePush(10)} size="sm" variant="outline" disabled={isPlaying && velocity > 0}>Strong Push</Button>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button onClick={() => setIsPlaying(!isPlaying)} className="w-full" disabled={velocity === 0 && position < 700}>
                                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                {isPlaying ? 'Pause' : 'Resume'}
                            </Button>
                            <Button onClick={handleReset} variant="outline">
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-blue-50 border-blue-100">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-brand-blue mt-1" />
                        <div>
                            <h3 className="font-bold text-brand-blue mb-1">Law of Inertia</h3>
                            <p className="text-sm text-blue-800">
                                Objects keep moving unless a force stops them.
                                On <strong>Ice</strong>, friction is low, so it glides far.
                                On <strong>Sand</strong>, friction is high, stopping it quickly.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card className="p-6 h-[400px] flex flex-col justify-end bg-sky-50 relative overflow-hidden">
                    {/* Background Scenery */}
                    <div className="absolute top-10 left-20 opacity-20"><Wind className="w-12 h-12 text-gray-400" /></div>

                    {/* Track Surface */}
                    <div
                        className={`absolute bottom-0 left-0 w-full h-20 transition-colors duration-500 ${surface === 'ice' ? 'bg-blue-100' : 'bg-yellow-100'}`}
                        style={{
                            backgroundImage: surface === 'sand' ? 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d4b996\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' : 'none'
                        }}
                    ></div>

                    {/* Object */}
                    <div
                        className="absolute bottom-20 w-24 h-24 bg-brand-blue rounded-xl shadow-lg flex items-center justify-center text-white font-bold transition-transform will-change-transform"
                        style={{ transform: `translateX(${position}px)` }}
                    >
                        <div className="text-center">
                            <div>Mass</div>
                            <div className="text-xs font-normal opacity-80">{velocity.toFixed(1)} m/s</div>
                        </div>
                    </div>

                    {/* Friction Force Arrow */}
                    {isPlaying && velocity > 0 && (
                        <div
                            className="absolute bottom-24 flex items-center transition-transform"
                            style={{ transform: `translateX(${position + 40}px)` }}
                        >
                            <div className="w-20 h-8 flex items-center justify-center bg-red-100/80 rounded border border-red-300 backdrop-blur-sm">
                                <span className="text-red-600 text-xs font-bold">â† Friction</span>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

const SecondLaw: React.FC = () => {
    const [mass, setMass] = useState(5);
    const [force, setForce] = useState(20);
    const [position, setPosition] = useState(50);
    const [velocity, setVelocity] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const requestRef = useRef<number | null>(null);

    const acceleration = force / mass;

    const animate = () => {
        if (isPlaying) {
            // Reduced time step multiplier from 0.05 to 0.02 for slower, more observable acceleration
            setVelocity((prevVel) => prevVel + acceleration * 0.02); // v = u + at
            setPosition((prevPos) => {
                const newPos = prevPos + velocity;
                if (newPos > 700) {
                    setIsPlaying(false);
                    return 700;
                }
                return newPos;
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
    }, [isPlaying, velocity, acceleration]);

    const handleReset = () => {
        setIsPlaying(false);
        setPosition(50);
        setVelocity(0);
    };

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
                                min="5"
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
                                max="20"
                                value={mass}
                                onChange={(e) => setMass(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                                disabled={isPlaying}
                            />
                        </div>

                        <div className="p-4 bg-gray-100 rounded-lg space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Acceleration (a):</span>
                                <span className="font-bold text-brand-black">{acceleration.toFixed(2)} m/sÂ²</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Velocity (v):</span>
                                <span className="font-bold text-brand-black">{velocity.toFixed(1)} m/s</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={() => setIsPlaying(!isPlaying)} className="w-full" disabled={position >= 700}>
                                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                {isPlaying ? 'Pause' : 'Apply Force'}
                            </Button>
                            <Button onClick={handleReset} variant="outline">
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-blue-50 border-blue-100">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-brand-blue mt-1" />
                        <div>
                            <h3 className="font-bold text-brand-blue mb-1">F = ma</h3>
                            <p className="text-sm text-blue-800">
                                A constant force causes constant acceleration (speed increases steadily).
                                Heavier objects accelerate slower.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card className="p-6 h-[400px] flex items-center bg-white relative overflow-hidden">
                    {/* Grid Background */}
                    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    {/* Mass Box */}
                    <div
                        className="absolute bottom-20 bg-brand-purple rounded-lg shadow-lg flex items-center justify-center text-white font-bold transition-transform will-change-transform"
                        style={{
                            width: `${mass * 5 + 50}px`,
                            height: `${mass * 5 + 50}px`,
                            transform: `translateX(${position}px)`
                        }}
                    >
                        {mass}kg
                    </div>

                    {/* Force Arrow (Attached to object) */}
                    {isPlaying && (
                        <div
                            className="absolute bottom-20 flex items-center transition-transform will-change-transform"
                            style={{
                                transform: `translateX(${position + (mass * 5 + 50)}px)`,
                                bottom: `calc(80px + ${(mass * 5 + 50) / 2}px - 10px)`
                            }}
                        >
                            <div
                                className="h-4 bg-brand-blue flex items-center justify-center text-white text-xs font-bold overflow-hidden whitespace-nowrap"
                                style={{ width: `${force * 3}px` }}
                            >
                                F = {force}N
                            </div>
                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-brand-blue border-b-[8px] border-b-transparent"></div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

const ThirdLaw: React.FC = () => {
    const [mass1, setMass1] = useState(60);
    const [mass2, setMass2] = useState(60);
    const [pos1, setPos1] = useState(250);
    const [pos2, setPos2] = useState(350);
    const [isPlaying, setIsPlaying] = useState(false);
    const requestRef = useRef<number | null>(null);

    // Push force duration is instantaneous for impulse, resulting in velocity
    // Impulse J = F*dt = m*v
    // Assume a standard push impulse of 300 Ns
    const impulse = 300;
    const v1 = -impulse / mass1; // Moves left
    const v2 = impulse / mass2;  // Moves right

    const animate = () => {
        if (isPlaying) {
            setPos1(p => Math.max(0, p + v1 * 0.1));
            setPos2(p => Math.min(600, p + v2 * 0.1));
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
    }, [isPlaying, v1, v2]);

    const handleReset = () => {
        setIsPlaying(false);
        setPos1(250);
        setPos2(350);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Skaters Interaction</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Skater 1 Mass (Blue): {mass1} kg
                            </label>
                            <input
                                type="range"
                                min="40"
                                max="120"
                                value={mass1}
                                onChange={(e) => setMass1(Number(e.target.value))}
                                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                disabled={isPlaying}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Skater 2 Mass (Red): {mass2} kg
                            </label>
                            <input
                                type="range"
                                min="40"
                                max="120"
                                value={mass2}
                                onChange={(e) => setMass2(Number(e.target.value))}
                                className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                                disabled={isPlaying}
                            />
                        </div>

                        <div className="p-4 bg-gray-100 rounded-lg space-y-2">
                            <div className="flex justify-between">
                                <span className="text-blue-600 font-bold">Velocity 1:</span>
                                <span>{v1.toFixed(2)} m/s</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-red-600 font-bold">Velocity 2:</span>
                                <span>{v2.toFixed(2)} m/s</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={() => setIsPlaying(!isPlaying)} className="w-full">
                                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                {isPlaying ? 'Pause' : 'Push Off'}
                            </Button>
                            <Button onClick={handleReset} variant="outline">
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-blue-50 border-blue-100">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-brand-blue mt-1" />
                        <div>
                            <h3 className="font-bold text-brand-blue mb-1">Action & Reaction</h3>
                            <p className="text-sm text-blue-800">
                                When Skater 1 pushes Skater 2, both move apart!
                                The forces are equal and opposite, but the lighter skater moves faster ($a = F/m$).
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card className="p-6 h-[400px] flex items-center justify-center bg-white relative overflow-hidden">
                    {/* Floor */}
                    <div className="absolute bottom-0 w-full h-20 bg-gray-100 border-t border-gray-200"></div>

                    {/* Skater 1 */}
                    <div
                        className="absolute bottom-20 transition-transform will-change-transform"
                        style={{ transform: `translateX(${pos1}px)` }}
                    >
                        <div className="w-16 h-32 bg-blue-500 rounded-full relative flex items-center justify-center text-white font-bold">
                            {mass1}
                            {/* Arms */}
                            {isPlaying ? (
                                <div className="absolute right-0 top-10 w-8 h-2 bg-blue-500 origin-left -rotate-45"></div>
                            ) : (
                                <div className="absolute right-0 top-10 w-8 h-2 bg-blue-500"></div>
                            )}
                        </div>
                        <div className="w-20 h-2 bg-gray-800 rounded-full mt-1 mx-auto opacity-20 blur-sm"></div>
                    </div>

                    {/* Skater 2 */}
                    <div
                        className="absolute bottom-20 transition-transform will-change-transform"
                        style={{ transform: `translateX(${pos2}px)` }}
                    >
                        <div className="w-16 h-32 bg-red-500 rounded-full relative flex items-center justify-center text-white font-bold">
                            {mass2}
                            {/* Arms */}
                            {isPlaying ? (
                                <div className="absolute left-0 top-10 w-8 h-2 bg-red-500 origin-right rotate-45"></div>
                            ) : (
                                <div className="absolute left-0 top-10 w-8 h-2 bg-red-500"></div>
                            )}
                        </div>
                        <div className="w-20 h-2 bg-gray-800 rounded-full mt-1 mx-auto opacity-20 blur-sm"></div>
                    </div>

                    {/* Force Arrows (Flash on push) */}
                    {!isPlaying && (
                        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 flex gap-4 opacity-50">
                            <div className="flex items-center">
                                <span className="text-blue-500 font-bold mr-2">â† F1</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-red-500 font-bold ml-2">F2 â†’</span>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

