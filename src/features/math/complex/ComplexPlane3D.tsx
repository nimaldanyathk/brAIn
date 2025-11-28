import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Line, Grid } from '@react-three/drei';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Slider } from '../../../components/ui/Slider';
import { ArrowLeft, Infinity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComplexVector = ({ real, imag, color, label }: { real: number, imag: number, color: string, label: string }) => {
    const endPoint: [number, number, number] = [real, imag, 0];

    return (
        <group>
            {/* Vector Line */}
            <Line points={[[0, 0, 0], endPoint]} color={color} lineWidth={3} />

            {/* Vector Head */}
            <mesh position={endPoint}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Projection Lines */}
            <Line points={[[real, 0, 0], endPoint]} color={color} lineWidth={1} dashed dashScale={2} opacity={0.5} transparent />
            <Line points={[[0, imag, 0], endPoint]} color={color} lineWidth={1} dashed dashScale={2} opacity={0.5} transparent />

            {/* Label */}
            <Text position={[real + 0.2, imag + 0.2, 0]} fontSize={0.3} color={color}>
                {label}
            </Text>
        </group>
    );
};

export const ComplexPlane3D: React.FC = () => {
    const navigate = useNavigate();
    const [real, setReal] = useState(3);
    const [imag, setImag] = useState(2);
    const [showConjugate, setShowConjugate] = useState(false);

    // Calculate modulus and argument
    const modulus = Math.sqrt(real * real + imag * imag).toFixed(2);
    const argument = (Math.atan2(imag, real) * 180 / Math.PI).toFixed(1);

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex items-center gap-4 shrink-0">
                <Button variant="ghost" onClick={() => navigate('/math')} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-display font-black text-brand-black">Complex Numbers</h1>
                    <p className="text-sm text-gray-500 font-bold">The Argand Plane & Modulus-Argument Form</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card className="bg-purple-50 border-purple-200">
                        <div className="flex flex-col items-center text-center gap-4">
                            <Infinity className="w-12 h-12 text-purple-500" />
                            <p className="text-sm leading-relaxed text-brand-black font-bold">
                                "A complex number z = a + bi lives on the Argand Plane. The Real part is X, Imaginary part is Y."
                            </p>
                        </div>
                    </Card>

                    <Card className="flex-1 space-y-6">
                        <div>
                            <h3 className="font-black text-brand-black mb-4">Controls</h3>
                            <div className="space-y-4">
                                <Slider
                                    label="Real Part (a)"
                                    value={real}
                                    min={-5}
                                    max={5}
                                    step={0.1}
                                    onChange={setReal}
                                    color="red"
                                />
                                <Slider
                                    label="Imaginary Part (b)"
                                    value={imag}
                                    min={-5}
                                    max={5}
                                    step={0.1}
                                    onChange={setImag}
                                    color="blue"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Button
                                variant={showConjugate ? 'primary' : 'outline'}
                                className="w-full justify-between"
                                onClick={() => setShowConjugate(!showConjugate)}
                            >
                                Show Conjugate (z̄)
                            </Button>
                        </div>

                        <div className="bg-gray-100 p-4 rounded-xl space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Modulus (|z|):</span>
                                <span className="font-mono font-bold">{modulus}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Argument (θ):</span>
                                <span className="font-mono font-bold">{argument}°</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 h-[500px] lg:h-auto rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white relative">
                    <Canvas shadows camera={{ position: [5, 5, 10], fov: 50 }}>
                        <color attach="background" args={['#f8fafc']} />
                        <ambientLight intensity={0.8} />
                        <pointLight position={[10, 10, 10]} intensity={1} />

                        <OrbitControls enablePan={true} minDistance={5} maxDistance={20} />

                        {/* Grid */}
                        <Grid infiniteGrid fadeDistance={30} sectionColor="#cbd5e1" cellColor="#e2e8f0" />

                        {/* Axes */}
                        <group>
                            <Line points={[[-10, 0, 0], [10, 0, 0]]} color="black" lineWidth={2} />
                            <Text position={[10.5, 0, 0]} fontSize={0.5} color="black">Re</Text>

                            <Line points={[[0, -10, 0], [0, 10, 0]]} color="black" lineWidth={2} />
                            <Text position={[0, 10.5, 0]} fontSize={0.5} color="black">Im</Text>
                        </group>

                        {/* Complex Vector Z */}
                        <ComplexVector
                            real={real}
                            imag={imag}
                            color="#7c3aed"
                            label={`z = ${real} + ${imag}i`}
                        />

                        {/* Conjugate Vector */}
                        {showConjugate && (
                            <ComplexVector
                                real={real}
                                imag={-imag}
                                color="#9333ea"
                                label={`z̄ = ${real} - ${imag}i`}
                            />
                        )}

                        {/* Angle Arc (Argument) */}
                        {/* Simplified visual for angle */}
                        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                            {/* We could use a partial torus or ring here, but for simplicity let's stick to vectors for now */}
                        </mesh>

                    </Canvas>

                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full border border-gray-200 text-xs font-bold text-gray-500">
                        Drag to Rotate • Scroll to Zoom
                    </div>
                </div>
            </div>
        </div>
    );
};
