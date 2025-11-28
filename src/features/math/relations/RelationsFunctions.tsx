import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { ArrowLeft, GitGraph } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// A component representing a mapping arrow
const MappingArrow = ({ start, end, color }: { start: [number, number, number], end: [number, number, number], color: string }) => {
    return (
        <Line
            points={[start, end]}
            color={color}
            lineWidth={2}
            dashed={false}
        />
    );
};

// Draggable Point in Domain
const DomainPoint = ({ position, label, color, onChange }: { position: [number, number, number], label: string, color: string, onChange: (newPos: [number, number, number]) => void }) => {
    const [hovered, setHovered] = useState(false);
    const ref = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (ref.current) {
            // Simple hover effect
            const scale = hovered ? 1.5 : 1;
            ref.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
        }
    });

    return (
        <group position={position}>
            <Sphere
                ref={ref}
                args={[0.3, 32, 32]}
                onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
                // Simple drag implementation (for full drag we'd use useGesture or similar, but simplified here for demo)
                onClick={() => {
                    // In a real app, we'd implement full drag logic. 
                    // For this demo, let's just randomize position slightly to simulate "interaction"
                    // or toggle a state.
                    // A better approach for "Draggable" without complex libs:
                    // We can't easily do full 3D drag without more setup.
                    // Let's make it "Click to Randomize Input" for now to demonstrate mapping changes.
                    onChange([position[0], position[1] + (Math.random() - 0.5) * 2, position[2]]);
                }}
            >
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </Sphere>
            <Text position={[0, 0.5, 0]} fontSize={0.3} color="black">
                {label}
            </Text>
        </group>
    );
};

export const RelationsFunctions: React.FC = () => {
    const navigate = useNavigate();

    // State for domain points (x values)
    const [domainPoints, setDomainPoints] = useState<[number, number, number][]>([
        [-3, 2, 0],
        [-3, 0, 0],
        [-3, -2, 0]
    ]);

    // Function type
    const [funcType, setFuncType] = useState<'one-to-one' | 'many-to-one'>('one-to-one');

    // Calculate range points based on function type
    const rangePoints = useMemo(() => {
        if (funcType === 'one-to-one') {
            // f(x) = x (linear mapping for visual simplicity)
            return domainPoints.map(p => [3, p[1], 0] as [number, number, number]);
        } else {
            // f(x) = |x| (absolute value-ish, mapping to positive)
            return domainPoints.map(p => [3, Math.abs(p[1]), 0] as [number, number, number]);
        }
    }, [domainPoints, funcType]);

    const updatePoint = (index: number, newPos: [number, number, number]) => {
        const newPoints = [...domainPoints];
        // Constrain movement to Y axis for simplicity
        newPoints[index] = [-3, Math.max(-4, Math.min(4, newPos[1])), 0];
        setDomainPoints(newPoints);
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex items-center gap-4 shrink-0">
                <Button variant="ghost" onClick={() => navigate('/math')} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-display font-black text-brand-black">Relations & Functions</h1>
                    <p className="text-sm text-gray-500 font-bold">Mapping Domains to Ranges</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card className="bg-cyan-50 border-cyan-200">
                        <div className="flex flex-col items-center text-center gap-4">
                            <GitGraph className="w-12 h-12 text-cyan-500" />
                            <p className="text-sm leading-relaxed text-brand-black font-bold">
                                "A function relates an input to an output. Visualize how inputs (Domain) map to outputs (Range)."
                            </p>
                        </div>
                    </Card>

                    <Card className="flex-1 space-y-6">
                        <div>
                            <h3 className="font-black text-brand-black mb-4">Function Type</h3>
                            <div className="space-y-2">
                                <Button
                                    variant={funcType === 'one-to-one' ? 'primary' : 'outline'}
                                    className="w-full justify-between"
                                    onClick={() => setFuncType('one-to-one')}
                                >
                                    One-to-One (Linear)
                                </Button>
                                <Button
                                    variant={funcType === 'many-to-one' ? 'primary' : 'outline'}
                                    className="w-full justify-between"
                                    onClick={() => setFuncType('many-to-one')}
                                >
                                    Many-to-One (Absolute)
                                </Button>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800">
                            <strong>Interaction:</strong> Click on the Domain points (Left) to randomize their position and see the mapping update!
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 h-[500px] lg:h-auto rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white relative">
                    <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
                        <color attach="background" args={['#f8fafc']} />
                        <ambientLight intensity={0.8} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <Environment preset="city" />

                        <group position={[0, 0, 0]}>
                            {/* Domain Set Visual */}
                            <Text position={[-3, 4, 0]} fontSize={0.5} color="#0891b2" anchorX="center">Domain (X)</Text>
                            <Line points={[[-3, 3.5, 0], [-3, -3.5, 0]]} color="#0891b2" lineWidth={4} transparent opacity={0.3} />

                            {/* Range Set Visual */}
                            <Text position={[3, 4, 0]} fontSize={0.5} color="#0891b2" anchorX="center">Range (Y)</Text>
                            <Line points={[[3, 3.5, 0], [3, -3.5, 0]]} color="#0891b2" lineWidth={4} transparent opacity={0.3} />

                            {/* Points and Mappings */}
                            {domainPoints.map((pos, i) => (
                                <React.Fragment key={i}>
                                    <DomainPoint
                                        position={pos}
                                        label={`x${i + 1}`}
                                        color="#ef4444"
                                        onChange={(newPos) => updatePoint(i, newPos)}
                                    />
                                    <MappingArrow
                                        start={pos}
                                        end={rangePoints[i]}
                                        color="#64748b"
                                    />
                                    <mesh position={rangePoints[i]}>
                                        <sphereGeometry args={[0.2, 32, 32]} />
                                        <meshStandardMaterial color="#3b82f6" />
                                    </mesh>
                                    <Text position={[rangePoints[i][0] + 0.5, rangePoints[i][1], 0]} fontSize={0.3} color="black">
                                        {`y${i + 1}`}
                                    </Text>
                                </React.Fragment>
                            ))}
                        </group>

                        <OrbitControls enablePan={false} minDistance={5} maxDistance={15} />
                    </Canvas>
                </div>
            </div>
        </div>
    );
};
