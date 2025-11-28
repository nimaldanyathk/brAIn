import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';


export const VectorAddition: React.FC = () => {
    const navigate = useNavigate();
    const [v1, setV1] = useState(50);
    const [v2, setV2] = useState(50);
    const [angle, setAngle] = useState(60);
    const [resultant, setResultant] = useState(0);
    const [resultantAngle, setResultantAngle] = useState(0);

    useEffect(() => {
        // Calculate resultant magnitude: R = sqrt(A^2 + B^2 + 2ABcos(theta))
        const thetaRad = (angle * Math.PI) / 180;
        const r = Math.sqrt(v1 * v1 + v2 * v2 + 2 * v1 * v2 * Math.cos(thetaRad));
        setResultant(r);

        // Calculate resultant angle (alpha) with respect to A: tan(alpha) = (Bsin(theta)) / (A + Bcos(theta))
        const alphaRad = Math.atan2(v2 * Math.sin(thetaRad), v1 + v2 * Math.cos(thetaRad));
        setResultantAngle((alphaRad * 180) / Math.PI);
    }, [v1, v2, angle]);

    // Scaling for visualization
    const scale = 2;
    const originX = 50;
    const originY = 350;

    const v1EndX = originX + v1 * scale;
    const v1EndY = originY;

    const v2EndX = originX + v2 * scale * Math.cos((angle * Math.PI) / 180);
    const v2EndY = originY - v2 * scale * Math.sin((angle * Math.PI) / 180);

    const rEndX = v1EndX + v2 * scale * Math.cos((angle * Math.PI) / 180);
    const rEndY = v1EndY - v2 * scale * Math.sin((angle * Math.PI) / 180);

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/physix')} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-display font-bold text-brand-black">Vector Addition</h1>
                    <p className="text-gray-500">Parallelogram Law of Vector Addition</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-brand-blue" />
                            Parameters
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Vector A Magnitude: {v1}
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={v1}
                                    onChange={(e) => setV1(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Vector B Magnitude: {v2}
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={v2}
                                    onChange={(e) => setV2(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Angle (Î¸): {angle}Â°
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="180"
                                    value={angle}
                                    onChange={(e) => setAngle(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                                />
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-gray-50 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Resultant Magnitude (R):</span>
                                <span className="font-bold text-brand-black">{resultant.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Direction (Î±):</span>
                                <span className="font-bold text-brand-black">{resultantAngle.toFixed(2)}Â°</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-blue-50 border-blue-100">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-brand-blue mt-1" />
                            <div>
                                <h3 className="font-bold text-brand-blue mb-1">The Formula</h3>
                                <p className="text-sm text-blue-800 mb-2">
                                    R = âˆš(AÂ² + BÂ² + 2ABcosÎ¸)
                                </p>
                                <p className="text-sm text-blue-800">
                                    tan Î± = (BsinÎ¸) / (A + BcosÎ¸)
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="p-6 h-[500px] flex items-center justify-center overflow-hidden bg-white relative">
                        <svg width="100%" height="100%" viewBox="0 0 500 400" className="overflow-visible">
                            <defs>
                                <marker id="arrowhead-a" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
                                </marker>
                                <marker id="arrowhead-b" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#8B5CF6" />
                                </marker>
                                <marker id="arrowhead-r" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#EF4444" />
                                </marker>
                            </defs>

                            {/* Grid lines */}
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#grid)" />

                            {/* Vector A */}
                            <line
                                x1={originX}
                                y1={originY}
                                x2={v1EndX}
                                y2={v1EndY}
                                stroke="#3B82F6"
                                strokeWidth="3"
                                markerEnd="url(#arrowhead-a)"
                            />
                            <text x={originX + (v1 * scale) / 2} y={originY + 20} fill="#3B82F6" fontWeight="bold">A</text>

                            {/* Vector B (Projected from Origin) */}
                            <line
                                x1={originX}
                                y1={originY}
                                x2={v2EndX}
                                y2={v2EndY}
                                stroke="#8B5CF6"
                                strokeWidth="3"
                                markerEnd="url(#arrowhead-b)"
                            />
                            <text x={originX + (v2 * scale * Math.cos((angle * Math.PI) / 180)) / 2 - 10} y={originY - (v2 * scale * Math.sin((angle * Math.PI) / 180)) / 2 - 10} fill="#8B5CF6" fontWeight="bold">B</text>

                            {/* Parallel lines for parallelogram */}
                            <line
                                x1={v1EndX}
                                y1={v1EndY}
                                x2={rEndX}
                                y2={rEndY}
                                stroke="#8B5CF6"
                                strokeWidth="1"
                                strokeDasharray="5,5"
                                opacity="0.5"
                            />
                            <line
                                x1={v2EndX}
                                y1={v2EndY}
                                x2={rEndX}
                                y2={rEndY}
                                stroke="#3B82F6"
                                strokeWidth="1"
                                strokeDasharray="5,5"
                                opacity="0.5"
                            />

                            {/* Resultant Vector */}
                            <line
                                x1={originX}
                                y1={originY}
                                x2={rEndX}
                                y2={rEndY}
                                stroke="#EF4444"
                                strokeWidth="4"
                                markerEnd="url(#arrowhead-r)"
                            />
                            <text x={originX + (resultant * scale * Math.cos((resultantAngle * Math.PI) / 180)) / 2} y={originY - (resultant * scale * Math.sin((resultantAngle * Math.PI) / 180)) / 2 - 20} fill="#EF4444" fontWeight="bold">R</text>

                            {/* Angle Arc */}
                            <path
                                d={`M ${originX + 30} ${originY} A 30 30 0 0 0 ${originX + 30 * Math.cos((angle * Math.PI) / 180)} ${originY - 30 * Math.sin((angle * Math.PI) / 180)}`}
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="2"
                            />
                            <text x={originX + 40} y={originY - 10} fill="#10B981" fontSize="12">Î¸</text>
                        </svg>
                    </Card>
                </div>
            </div>
            
        </div>
    );
};

