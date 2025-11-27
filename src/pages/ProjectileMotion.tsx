import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProjectileMotion3D } from '../features/physix/ProjectileMotion3D';

export const ProjectileMotion: React.FC = () => {
    const navigate = useNavigate();
    const [velocity, setVelocity] = useState(15);
    const [angle, setAngle] = useState(45);
    const [isLaunching, setIsLaunching] = useState(false);
    const [simData, setSimData] = useState({ time: 0, x: 0, y: 1.6 });

    const handleLaunch = () => {
        setIsLaunching(true);
    };

    const handleReset = () => {
        setIsLaunching(false);
        setSimData({ time: 0, x: 0, y: 1.6 });
    };

    const handleUpdate = (data: { time: number; x: number; y: number }) => {
        setSimData(data);
    };

    // Theoretical calculations
    const g = 9.81;
    const y0 = 1.6; // Initial height
    const rad = (angle * Math.PI) / 180;

    // Flight time: solve 0 = y0 + vy*t - 0.5*g*t^2
    // 0.5*g*t^2 - vy*t - y0 = 0
    // t = (vy + sqrt(vy^2 + 2*g*y0)) / g
    const vy = velocity * Math.sin(rad);
    const vx = velocity * Math.cos(rad);
    const flightTime = (vy + Math.sqrt(Math.pow(vy, 2) + 2 * g * y0)) / g;

    const maxRange = vx * flightTime;
    const maxHeight = y0 + (Math.pow(velocity, 2) * Math.pow(Math.sin(rad), 2)) / (2 * g);

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/physix')} className="px-2">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-brand-black">Projectile Motion</h1>
                        <p className="text-gray-500">Launch the origami plane and study its parabolic trajectory.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main 3D View */}
                <div className="lg:col-span-2 h-[600px]">
                    <ProjectileMotion3D
                        initialVelocity={velocity}
                        angle={angle}
                        initialHeight={y0}
                        isLaunching={isLaunching}
                        onUpdate={handleUpdate}
                    />
                </div>

                {/* Controls & Data */}
                <div className="space-y-6">
                    {/* Controls */}
                    <Card className="p-6 space-y-6">
                        <h3 className="text-xl font-bold text-brand-black flex items-center gap-2">
                            <Info className="w-5 h-5 text-brand-blue" />
                            Launch Controls
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Initial Velocity ($v_0$): {velocity} m/s
                                </label>
                                <input
                                    type="range"
                                    min="5"
                                    max="30"
                                    step="1"
                                    value={velocity}
                                    onChange={(e) => !isLaunching && setVelocity(Number(e.target.value))}
                                    disabled={isLaunching}
                                    className="w-full accent-brand-blue"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Launch Angle ($\theta$): {angle}°
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="90"
                                    step="1"
                                    value={angle}
                                    onChange={(e) => !isLaunching && setAngle(Number(e.target.value))}
                                    disabled={isLaunching}
                                    className="w-full accent-brand-blue"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            {!isLaunching ? (
                                <Button onClick={handleLaunch} className="w-full flex items-center justify-center gap-2">
                                    <Play className="w-4 h-4" /> Launch
                                </Button>
                            ) : (
                                <Button onClick={handleReset} variant="outline" className="w-full flex items-center justify-center gap-2">
                                    <RotateCcw className="w-4 h-4" /> Reset
                                </Button>
                            )}
                        </div>
                    </Card>

                    {/* Real-time Data */}
                    <Card className="p-6 space-y-4 bg-gray-50">
                        <h3 className="text-lg font-bold text-brand-black">Flight Data</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                <span className="text-xs text-gray-500 uppercase font-bold">Time</span>
                                <div className="text-xl font-mono text-brand-blue">{simData.time.toFixed(2)}s</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                <span className="text-xs text-gray-500 uppercase font-bold">Height (y)</span>
                                <div className="text-xl font-mono text-brand-blue">{simData.y.toFixed(2)}m</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm col-span-2">
                                <span className="text-xs text-gray-500 uppercase font-bold">Distance (x)</span>
                                <div className="text-xl font-mono text-brand-blue">{simData.x.toFixed(2)}m</div>
                            </div>
                        </div>
                    </Card>

                    {/* Formulas & Theory */}
                    <Card className="p-6 space-y-4">
                        <h3 className="text-lg font-bold text-brand-black">Theoretical Values</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Max Range ($R$):</span>
                                <span className="font-mono font-bold">{maxRange.toFixed(2)}m</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Max Height ($H$):</span>
                                <span className="font-mono font-bold">{maxHeight.toFixed(2)}m</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Flight Time ($T$):</span>
                                <span className="font-mono font-bold">{flightTime.toFixed(2)}s</span>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500 italic">
                                Note: Air resistance is neglected in this simulation ($g = 9.81 m/s^2$).
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
