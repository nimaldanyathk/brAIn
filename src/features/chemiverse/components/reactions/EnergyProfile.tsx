import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Line, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Zap, Activity, Thermometer, ArrowRight } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Slider } from '../../../../components/ui/Slider';

// --- Constants ---
const POINTS = 100;
const WIDTH = 10;

// --- 3D Graph Component ---
const EnergyCurve = ({ 
    hasCatalyst, 
    isExothermic, 
    progress 
}: { 
    hasCatalyst: boolean, 
    isExothermic: boolean, 
    progress: number 
}) => {
    // Calculate curve points
    const points = useMemo(() => {
        const pts = [];
        const startY = 0;
        const endY = isExothermic ? -2 : 2;
        const peakY = hasCatalyst ? 2 : 5; // Catalyst lowers peak
        
        for (let i = 0; i <= POINTS; i++) {
            const t = i / POINTS;
            const x = (t - 0.5) * WIDTH;
            
            // Gaussian-like hump for activation energy
            // Combined with linear interpolation for start/end states
            
            
            // Hump calculation (bell curve centered at 0)
            
            
            // Smooth blend
            // We want the hump to sit on top of the transition
            // But for a reaction coordinate, it's usually: Reactants -> Transition State -> Products
            
            // Let's use a Bezier-like approximation for smoother look
            // P0(start), P1(peak), P2(end)
            // Actually, let's stick to a math function for easy animation
            
            let y = 0;
            if (t < 0.5) {
                // Reactants to Transition State
                // Smoothstep from 0 to peak
                const t2 = t * 2;
                y = startY + (peakY - startY) * (t2 * t2 * (3 - 2 * t2));
            } else {
                // Transition State to Products
                // Smoothstep from peak to end
                const t2 = (t - 0.5) * 2;
                y = peakY + (endY - peakY) * (t2 * t2 * (3 - 2 * t2));
            }

            pts.push(new THREE.Vector3(x, y, 0));
        }
        return pts;
    }, [hasCatalyst, isExothermic]);

    // Ball Position
    const ballPos = useMemo(() => {
        const t = progress / 100;
        const index = Math.floor(t * POINTS);
        return points[Math.min(index, POINTS)];
    }, [progress, points]);

    return (
        <group>
            {/* The Energy Curve */}
            <Line 
                points={points} 
                color={hasCatalyst ? "#10b981" : "#3b82f6"} 
                lineWidth={5} 
            />
            
            {/* Dashed line for original path if catalyst is active */}
            {hasCatalyst && (
                <EnergyCurveGhost isExothermic={isExothermic} />
            )}

            {/* The Reaction Particle (Ball) */}
            <Sphere position={ballPos} args={[0.3, 32, 32]}>
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
            </Sphere>
            
            {/* Labels */}
            <Text position={[-5, 0.5, 0]} fontSize={0.4} color="black" anchorX="right">
                Reactants
            </Text>
            <Text position={[5, isExothermic ? -1.5 : 2.5, 0]} fontSize={0.4} color="black" anchorX="left">
                Products
            </Text>
            <Text position={[0, hasCatalyst ? 2.5 : 5.5, 0]} fontSize={0.4} color="gray" anchorY="bottom">
                Transition State
            </Text>

            {/* Activation Energy Arrow/Label */}
            <group position={[-1, (hasCatalyst ? 1 : 2.5), 0]}>
                 <Html center>
                    <div className="bg-white/80 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm border border-gray-200">
                        Ea {hasCatalyst ? '(Lowered)' : ''}
                    </div>
                 </Html>
            </group>
        </group>
    );
};

// Ghost curve to show the original path when catalyst is active
const EnergyCurveGhost = ({ isExothermic }: { isExothermic: boolean }) => {
    const points = useMemo(() => {
        const pts = [];
        const startY = 0;
        const endY = isExothermic ? -2 : 2;
        const peakY = 5; // Original high peak
        
        for (let i = 0; i <= POINTS; i++) {
            const t = i / POINTS;
            const x = (t - 0.5) * WIDTH;
            let y = 0;
            if (t < 0.5) {
                const t2 = t * 2;
                y = startY + (peakY - startY) * (t2 * t2 * (3 - 2 * t2));
            } else {
                const t2 = (t - 0.5) * 2;
                y = peakY + (endY - peakY) * (t2 * t2 * (3 - 2 * t2));
            }
            pts.push(new THREE.Vector3(x, y, 0));
        }
        return pts;
    }, [isExothermic]);

    return (
        <Line 
            points={points} 
            color="#cbd5e1" 
            lineWidth={2} 
            dashed 
            dashSize={0.2} 
            gapSize={0.1} 
        />
    );
};

export const EnergyProfile = () => {
    const [progress, setProgress] = useState(0);
    const [hasCatalyst, setHasCatalyst] = useState(false);
    const [isExothermic, setIsExothermic] = useState(true);

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Controls */}
            <div className="lg:col-span-1 flex flex-col gap-4">
                <Card className="p-6 bg-white border-gray-200 shadow-sm flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-wider text-sm">
                        <Activity className="w-4 h-4" /> Energy Profile
                    </div>
                    
                    <p className="text-sm text-gray-600">
                        Reactions need energy to start (Activation Energy). 
                        Catalysts lower this barrier, making the reaction faster.
                    </p>

                    {/* Toggles */}
                    <div className="flex flex-col gap-3">
                        <Button 
                            variant={hasCatalyst ? 'primary' : 'outline'}
                            onClick={() => setHasCatalyst(!hasCatalyst)}
                            className="justify-between group"
                        >
                            <span className="flex items-center gap-2">
                                <Zap className={`w-4 h-4 ${hasCatalyst ? 'text-yellow-300' : 'text-gray-400'}`} />
                                Add Catalyst
                            </span>
                            <span className="text-xs opacity-60 font-normal">
                                {hasCatalyst ? 'Active' : 'Inactive'}
                            </span>
                        </Button>

                        <Button 
                            variant="outline"
                            onClick={() => setIsExothermic(!isExothermic)}
                            className="justify-between"
                        >
                            <span className="flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-red-500" />
                                Reaction Type
                            </span>
                            <span className={`text-xs font-bold ${isExothermic ? 'text-orange-500' : 'text-blue-500'}`}>
                                {isExothermic ? 'Exothermic (Release Heat)' : 'Endothermic (Absorb Heat)'}
                            </span>
                        </Button>
                    </div>

                    {/* Progress Slider */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between mb-2">
                            <label className="font-bold text-gray-700 flex items-center gap-2">
                                <ArrowRight className="w-4 h-4 text-gray-400" /> Reaction Progress
                            </label>
                            <span className="font-mono font-bold text-gray-900">{Math.round(progress)}%</span>
                        </div>
                        <Slider 
                            label="Reaction Progress"
                            value={progress} 
                            onChange={setProgress} 
                            min={0} 
                            max={100} 
                            step={1}
                            color="blue"
                        />
                    </div>
                </Card>
            </div>

            {/* 3D View */}
            <div className="lg:col-span-2 h-[500px] lg:h-auto relative rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white">
                <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
                    <color attach="background" args={['#ffffff']} />
                    <ambientLight intensity={0.8} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    
                    {/* Grid Helper for context */}
                    <gridHelper args={[20, 20, '#e2e8f0', '#f1f5f9']} position={[0, -3, 0]} />

                    <EnergyCurve 
                        hasCatalyst={hasCatalyst} 
                        isExothermic={isExothermic} 
                        progress={progress} 
                    />

                    <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/2} />
                </Canvas>
                
                {/* Overlay Legend */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white/90 backdrop-blur px-4 py-3 rounded-lg border border-gray-100 shadow-sm text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-1 bg-blue-500 rounded-full"></div> 
                        <span className="font-bold text-gray-600">Standard Path</span>
                    </div>
                    {hasCatalyst && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-1 bg-emerald-500 rounded-full"></div> 
                            <span className="font-bold text-gray-600">Catalyzed Path</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div> 
                        <span className="font-bold text-gray-600">Reactants</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

