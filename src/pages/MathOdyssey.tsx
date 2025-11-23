import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Slider } from '../components/ui/Slider';
import { Astra } from '../components/Astra';

export const MathOdyssey: React.FC = () => {
    const navigate = useNavigate();
    const [angle, setAngle] = useState(45);
    const [sin, setSin] = useState(0);
    const [cos, setCos] = useState(0);
    const [tan, setTan] = useState(0);

    useEffect(() => {
        const rad = (angle * Math.PI) / 180;
        setSin(parseFloat(Math.sin(rad).toFixed(3)));
        setCos(parseFloat(Math.cos(rad).toFixed(3)));
        setTan(parseFloat(Math.tan(rad).toFixed(3)));
    }, [angle]);

    // Calculate coordinates for the unit circle point
    const radius = 120;
    const cx = 150;
    const cy = 150;
    const x = cx + radius * Math.cos((angle * Math.PI) / 180);
    const y = cy - radius * Math.sin((angle * Math.PI) / 180); // SVG y is inverted

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-4 shrink-0">
                <Button variant="ghost" onClick={() => navigate('/')} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-display font-black text-brand-black">Math Odyssey</h1>
                    <p className="text-sm text-gray-500 font-bold">Trigonometry & The Unit Circle</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Left Panel: Controls & Info */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card className="bg-yellow-50 border-yellow-200">
                        <div className="flex flex-col items-center text-center gap-4">
                            <Astra context="math" size="sm" />
                            <p className="text-sm leading-relaxed text-brand-black font-bold">
                                "The Unit Circle connects angles to coordinates! Watch how Sine (height) and Cosine (width) change."
                            </p>
                        </div>
                    </Card>

                    <Card className="flex-1 space-y-8">
                        <div>
                            <h2 className="text-lg font-black text-brand-black flex items-center gap-2 mb-4">
                                <Calculator className="w-5 h-5 text-yellow-600" />
                                Controls
                            </h2>
                            <Slider
                                label="Angle (Degrees)"
                                value={angle}
                                min={0}
                                max={360}
                                unit="°"
                                color="red"
                                onChange={setAngle}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl border-2 border-red-100">
                                <span className="font-bold text-red-600">Sine (sin)</span>
                                <span className="font-mono font-black text-xl">{sin}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border-2 border-blue-100">
                                <span className="font-bold text-blue-600">Cosine (cos)</span>
                                <span className="font-mono font-black text-xl">{cos}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border-2 border-green-100">
                                <span className="font-bold text-green-600">Tangent (tan)</span>
                                <span className="font-mono font-black text-xl">{tan}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Panel: Visualization */}
                <div className="lg:col-span-2 h-[500px] lg:h-auto">
                    <Card className="h-full flex items-center justify-center bg-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />

                        <svg width="300" height="300" viewBox="0 0 300 300" className="z-10 overflow-visible">
                            {/* Axes */}
                            <line x1="0" y1="150" x2="300" y2="150" stroke="#d1d5db" strokeWidth="2" />
                            <line x1="150" y1="0" x2="150" y2="300" stroke="#d1d5db" strokeWidth="2" />

                            {/* Unit Circle */}
                            <circle cx="150" cy="150" r="120" fill="none" stroke="#1d1d1f" strokeWidth="3" />

                            {/* Angle Arc */}
                            <path
                                d={`M 180 150 A 30 30 0 ${angle > 180 ? 1 : 0} 0 ${150 + 30 * Math.cos((angle * Math.PI) / -180)} ${150 + 30 * Math.sin((angle * Math.PI) / -180)}`}
                                fill="none"
                                stroke="#eab308"
                                strokeWidth="2"
                                strokeDasharray="4 2"
                            />
                            <text x="190" y="140" className="text-xs font-bold fill-yellow-600">{angle}°</text>

                            {/* Radius Line */}
                            <line x1="150" y1="150" x2={x} y2={y} stroke="#1d1d1f" strokeWidth="2" />

                            {/* Cosine Line (Blue) */}
                            <line x1="150" y1="150" x2={x} y2="150" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />

                            {/* Sine Line (Red) */}
                            <line x1={x} y1="150" x2={x} y2={y} stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />

                            {/* Point */}
                            <circle cx={x} cy={y} r="6" fill="#1d1d1f" stroke="white" strokeWidth="2" />

                            {/* Labels */}
                            <text x={150 + (x - 150) / 2} y="170" className="text-xs font-bold fill-blue-600 text-center" textAnchor="middle">cos</text>
                            <text x={x + 10} y={150 + (y - 150) / 2} className="text-xs font-bold fill-red-600" alignmentBaseline="middle">sin</text>
                        </svg>
                    </Card>
                </div>
            </div>
        </div>
    );
};
