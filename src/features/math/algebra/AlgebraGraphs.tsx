import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Slider } from '../../../components/ui/Slider';
import { ArrowLeft, Grid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Bar = ({ position, height, color, label }: { position: [number, number, number], height: number, color: string, label: string }) => {
    return (
        <group position={[position[0], height / 2, position[2]]}>
            <mesh>
                <boxGeometry args={[0.8, height, 0.8]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <Text position={[0, height / 2 + 0.5, 0]} fontSize={0.3} color="black" anchorX="center" anchorY="middle">
                {label}
            </Text>
        </group>
    );
};

export const AlgebraGraphs: React.FC = () => {
    const navigate = useNavigate();
    const [n, setN] = useState(10);
    const [type, setType] = useState<'ap' | 'gp'>('ap');
    const [a, setA] = useState(2); // First term
    const [d, setD] = useState(1); // Common difference (AP)
    const [r, setR] = useState(1.2); // Common ratio (GP)

    const sequence = useMemo(() => {
        const seq = [];
        for (let i = 0; i < n; i++) {
            let val = 0;
            if (type === 'ap') {
                val = a + i * d;
            } else {
                val = a * Math.pow(r, i);
            }
            // Cap height for visual sanity
            seq.push(Math.min(val, 20));
        }
        return seq;
    }, [n, type, a, d, r]);

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex items-center gap-4 shrink-0">
                <Button variant="ghost" onClick={() => navigate('/math')} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-display font-black text-brand-black">Algebra: Sequences & Series</h1>
                    <p className="text-sm text-gray-500 font-bold">Visualizing Arithmetic and Geometric Progressions</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card className="bg-orange-50 border-orange-200">
                        <div className="flex flex-col items-center text-center gap-4">
                            <Grid className="w-12 h-12 text-orange-500" />
                            <p className="text-sm leading-relaxed text-brand-black font-bold">
                                "Watch how terms grow! AP adds a constant, while GP multiplies by a constant."
                            </p>
                        </div>
                    </Card>

                    <Card className="flex-1 space-y-6">
                        <div>
                            <h3 className="font-black text-brand-black mb-4">Sequence Type</h3>
                            <div className="flex gap-2">
                                <Button
                                    variant={type === 'ap' ? 'primary' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setType('ap')}
                                >
                                    Arithmetic (AP)
                                </Button>
                                <Button
                                    variant={type === 'gp' ? 'primary' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setType('gp')}
                                >
                                    Geometric (GP)
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Slider
                                label="Number of Terms (n)"
                                value={n}
                                min={3}
                                max={20}
                                step={1}
                                onChange={setN}
                                color="red"
                            />
                            <Slider
                                label="First Term (a)"
                                value={a}
                                min={1}
                                max={5}
                                step={0.5}
                                onChange={setA}
                                color="red"
                            />
                            {type === 'ap' ? (
                                <Slider
                                    label="Common Difference (d)"
                                    value={d}
                                    min={0.5}
                                    max={3}
                                    step={0.5}
                                    onChange={setD}
                                    color="red"
                                />
                            ) : (
                                <Slider
                                    label="Common Ratio (r)"
                                    value={r}
                                    min={1.1}
                                    max={1.5}
                                    step={0.1}
                                    onChange={setR}
                                    color="red"
                                />
                            )}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 h-[500px] lg:h-auto rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white relative">
                    <Canvas shadows camera={{ position: [5, 10, 20], fov: 50 }}>
                        <color attach="background" args={['#f8fafc']} />
                        <ambientLight intensity={0.8} />
                        <pointLight position={[10, 20, 10]} intensity={1} castShadow />

                        <OrbitControls enablePan={true} minDistance={10} maxDistance={30} />

                        {/* Ground Plane */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                            <planeGeometry args={[50, 50]} />
                            <meshStandardMaterial color="#e2e8f0" />
                        </mesh>

                        {/* Bars */}
                        <group position={[-n / 2, 0, 0]}>
                            {sequence.map((val, i) => (
                                <Bar
                                    key={i}
                                    position={[i * 1.5, 0, 0]}
                                    height={val}
                                    color={type === 'ap' ? '#f97316' : '#ea580c'}
                                    label={val.toFixed(1)}
                                />
                            ))}
                        </group>
                    </Canvas>
                </div>
            </div>
        </div>
    );
};
