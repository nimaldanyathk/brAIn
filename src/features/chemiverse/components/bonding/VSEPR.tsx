import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Card } from '../../../../components/ui/Card';

const SHAPES = {
    linear: { name: 'Linear', bonds: 2, angle: '180°', color: '#ef4444' },
    trigonalPlanar: { name: 'Trigonal Planar', bonds: 3, angle: '120°', color: '#f97316' },
    tetrahedral: { name: 'Tetrahedral', bonds: 4, angle: '109.5°', color: '#eab308' },
    trigonalBipyramidal: { name: 'Trigonal Bipyramidal', bonds: 5, angle: '90°, 120°', color: '#22c55e' },
    octahedral: { name: 'Octahedral', bonds: 6, angle: '90°', color: '#3b82f6' },
};

const Atom = ({ position, color, size = 0.5 }: { position: [number, number, number], color: string, size?: number }) => (
    <mesh position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
    </mesh>
);

const Bond = ({ start, end }: { start: [number, number, number], end: [number, number, number] }) => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const mid = startVec.clone().add(endVec).multiplyScalar(0.5);
    const length = startVec.distanceTo(endVec);
    const direction = endVec.clone().sub(startVec).normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

    return (
        <mesh position={mid} quaternion={quaternion}>
            <cylinderGeometry args={[0.08, 0.08, length, 16]} />
            <meshStandardMaterial color="#cbd5e1" />
        </mesh>
    );
};

const VSEPRScene = ({ shape }: { shape: keyof typeof SHAPES }) => {
    const group = useRef<THREE.Group>(null);

    useFrame(() => {
        if (group.current) {
            group.current.rotation.y += 0.005;
        }
    });

    const getPositions = (type: keyof typeof SHAPES) => {
        const pos: [number, number, number][] = [];
        const r = 2;
        
        if (type === 'linear') {
            pos.push([r, 0, 0], [-r, 0, 0]);
        } else if (type === 'trigonalPlanar') {
            for(let i=0; i<3; i++) {
                const angle = (i * 2 * Math.PI) / 3;
                pos.push([r * Math.cos(angle), r * Math.sin(angle), 0]);
            }
        } else if (type === 'tetrahedral') {
            // Vertices of a tetrahedron
            pos.push([r, r, r]);
            pos.push([-r, -r, r]);
            pos.push([-r, r, -r]);
            pos.push([r, -r, -r]);
            // Normalize to radius r
            pos.forEach((p, i) => {
                const vec = new THREE.Vector3(...p).normalize().multiplyScalar(r);
                pos[i] = [vec.x, vec.y, vec.z];
            });
        } else if (type === 'trigonalBipyramidal') {
            // Equatorial
            for(let i=0; i<3; i++) {
                const angle = (i * 2 * Math.PI) / 3;
                pos.push([r * Math.cos(angle), 0, r * Math.sin(angle)]);
            }
            // Axial
            pos.push([0, r, 0], [0, -r, 0]);
        } else if (type === 'octahedral') {
            pos.push([r, 0, 0], [-r, 0, 0]);
            pos.push([0, r, 0], [0, -r, 0]);
            pos.push([0, 0, r], [0, 0, -r]);
        }
        return pos;
    };

    const positions = getPositions(shape);
    const data = SHAPES[shape];

    return (
        <group ref={group}>
            {/* Central Atom */}
            <Atom position={[0, 0, 0]} color={data.color} size={0.7} />
            
            {/* Bonded Atoms & Bonds */}
            {positions.map((pos, i) => (
                <group key={i}>
                    <Atom position={pos} color="#94a3b8" size={0.4} />
                    <Bond start={[0, 0, 0]} end={pos} />
                </group>
            ))}

            {/* Angle Indicators (Simplified) */}
             <Html position={[0, -2.5, 0]} center>
                <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                    <span className="text-xs font-bold text-gray-600">Bond Angle: {data.angle}</span>
                </div>
            </Html>
        </group>
    );
};

export const VSEPR = () => {
    const [activeShape, setActiveShape] = useState<keyof typeof SHAPES>('tetrahedral');

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="lg:col-span-1 flex flex-col gap-4">
                <Card className="p-4 bg-white border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-gray-900">VSEPR Geometry</h3>
                    <div className="flex flex-col gap-2">
                        {(Object.entries(SHAPES) as [keyof typeof SHAPES, typeof SHAPES['linear']][]).map(([key, data]) => (
                            <button
                                key={key}
                                onClick={() => setActiveShape(key)}
                                className={`p-3 rounded-lg text-left transition-all border ${
                                    activeShape === key
                                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                                    : 'bg-white border-gray-100 hover:bg-gray-50 text-gray-600'
                                }`}
                            >
                                <div className="font-bold text-sm">{data.name}</div>
                                <div className="text-xs opacity-70">{data.bonds} Bonding Pairs</div>
                            </button>
                        ))}
                    </div>
                </Card>
                
                <Card className="p-4 bg-blue-50 border-blue-100">
                    <h4 className="font-bold text-blue-800 text-sm mb-2">Theory</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        Valence Shell Electron Pair Repulsion (VSEPR) theory predicts the geometry of individual molecules from the number of electron pairs surrounding their central atoms.
                    </p>
                </Card>
            </div>

            {/* 3D View */}
            <div className="lg:col-span-2 h-[400px] lg:h-auto relative">
                <Card className="h-full p-0 overflow-hidden border-gray-200 shadow-md bg-gray-50">
                    <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
                        <ambientLight intensity={0.6} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} />
                        <VSEPRScene shape={activeShape} />
                        <OrbitControls enableZoom={true} />
                    </Canvas>
                </Card>
            </div>
        </div>
    );
};

