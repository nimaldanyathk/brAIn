import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ELEMENTS } from './utils/elements';
import type { ElementData } from './utils/elements';
import { Nucleus, ElectronShell } from './components/AtomParts';

// --- Sub-components ---

const ElementTile = ({ 
    element, 
    position, 
    trend, 
    onHover,
    onClick
}: { 
    element: ElementData, 
    position: [number, number, number], 
    trend: 'standard' | 'radius' | 'electronegativity',
    onHover: (e: ElementData | null) => void,
    onClick: (e: ElementData) => void
}) => {
    const [hovered, setHovered] = useState(false);
    const mesh = useRef<THREE.Group>(null);

    // Calculate visual properties based on trend
    const { color, height } = useMemo(() => {
        let c = new THREE.Color(`#${element.cpkHex}`);
        let h = 0.5;

        if (trend === 'radius' && element.atomic_radius) {
            h = element.atomic_radius / 50; // Scale factor
            c.setHSL(0.6 - (element.atomic_radius / 300) * 0.6, 1, 0.5); // Blue (small) to Red (large)
        } else if (trend === 'electronegativity' && element.electronegativity) {
            h = element.electronegativity * 1.5;
            c.setHSL((element.electronegativity / 4) * 0.3, 1, 0.5); // Red (low) to Green (high)
        }

        return { color: c, height: h };
    }, [element, trend]);

    useFrame((state) => {
        if (mesh.current) {
            // Hover animation
            const targetY = position[1] + (hovered ? 1 : 0);
            mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, targetY, 0.1);
            
            // Gentle float
            if (!hovered) {
                mesh.current.position.y += Math.sin(state.clock.getElapsedTime() * 2 + position[0]) * 0.002;
            }
        }
    });

    return (
        <group 
            ref={mesh} 
            position={position}
            onPointerOver={(e) => { 
                e.stopPropagation(); 
                setHovered(true); 
                onHover(element);
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => { 
                setHovered(false); 
                onHover(null); 
                document.body.style.cursor = 'auto';
            }}
            onClick={(e) => { e.stopPropagation(); onClick(element); }}
        >
            {/* Main Tile Body */}
            <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[0.9, height, 0.9]} />
                <meshStandardMaterial 
                    color={color} 
                    opacity={0.9} 
                    transparent 
                    metalness={0.2} 
                    roughness={0.1} 
                />
            </mesh>

                        {/* Symbol Text */}
            <Text 
                position={[0, height + 0.1, 0.2]} 
                fontSize={0.3} 
                color="black" 
                anchorX="center" 
                anchorY="bottom"
                fontWeight="bold"
            >
                {element.symbol}
            </Text>
            
            {/* Atomic Number */}
            <Text 
                position={[-0.35, height + 0.1, -0.35]} 
                fontSize={0.15} 
                color="#444" 
                anchorX="left" 
                anchorY="bottom"
            >
                {element.number}
            </Text>

            {/* Tooltip (Only on Hover) */}
            {hovered && (
                <Html position={[0, height + 1, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-blue-100 w-48 text-left pointer-events-none select-none">
                        <div className="text-2xl font-black text-gray-900 mb-1">{element.symbol}</div>
                        <div className="text-sm font-bold text-blue-600 mb-2">{element.name}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div>Z: <span className="font-mono font-bold">{element.number}</span></div>
                            <div>Mass: <span className="font-mono font-bold">{element.mass}</span></div>
                            {element.atomic_radius && <div>Radius: <span className="font-mono font-bold">{element.atomic_radius}pm</span></div>}
                            {element.electronegativity && <div>EN: <span className="font-mono font-bold">{element.electronegativity}</span></div>}
                        </div>
                        <div className="mt-2 text-[10px] font-mono bg-gray-100 p-1 rounded text-gray-500">
                            {element.electron_configuration}
                        </div>
                        <div className="mt-2 text-[10px] text-blue-400 font-bold uppercase tracking-wider text-center">
                            Click to Inspect
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
};

// --- Main Component ---

export const PeriodicTable = () => {
    const navigate = useNavigate();
    const [trend, setTrend] = useState<'standard' | 'radius' | 'electronegativity'>('standard');
    const [hoveredElement, setHoveredElement] = useState<ElementData | null>(null);

    const handleElementClick = (element: ElementData) => {
        navigate(`/chemistry/atomic?Z=${element.number}`);
    };

    return (
        <div className="h-full w-full bg-white text-gray-900 relative overflow-hidden font-sans">
            
            {/* Header */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/chemistry')} className="px-2 text-gray-700 hover:bg-gray-100">
                    <ArrowLeft className="w-8 h-8" />
                </Button>
                <div>
                    <h1 className="text-4xl font-black text-gray-900">
                        PERIODIC TABLE
                    </h1>
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">
                        Interactive 3D Visualization
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute top-6 right-6 z-20 flex gap-2">
                <Card className="bg-white/90 backdrop-blur-md p-2 flex gap-2 shadow-lg border-gray-200">
                    <Button 
                        variant={trend === 'standard' ? 'primary' : 'ghost'} 
                        onClick={() => setTrend('standard')}
                        className="text-xs font-bold"
                    >
                        Standard
                    </Button>
                    <Button 
                        variant={trend === 'radius' ? 'primary' : 'ghost'} 
                        onClick={() => setTrend('radius')}
                        className="text-xs font-bold"
                    >
                        Atomic Radius
                    </Button>
                    <Button 
                        variant={trend === 'electronegativity' ? 'primary' : 'ghost'} 
                        onClick={() => setTrend('electronegativity')}
                        className="text-xs font-bold"
                    >
                        Electronegativity
                    </Button>
                </Card>
            </div>

            {/* Mini Atom Preview (Bottom Right) */}
            {hoveredElement && (
                <div className="absolute bottom-6 right-6 z-20 w-64 h-64 pointer-events-none">
                    <Card className="w-full h-full bg-white/90 backdrop-blur-md border-gray-200 shadow-2xl overflow-hidden relative">
                        <div className="absolute top-3 left-4 z-10">
                            <div className="text-3xl font-black text-gray-900">{hoveredElement.symbol}</div>
                            <div className="text-xs font-bold text-blue-500 uppercase">{hoveredElement.category}</div>
                        </div>
                        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                            <ambientLight intensity={1} />
                            <pointLight position={[10, 10, 10]} />
                            <Nucleus protons={hoveredElement.number} neutrons={Math.round(hoveredElement.mass - hoveredElement.number)} color={`#${hoveredElement.cpkHex}`} />
                            <group rotation={[0, 0, Math.PI/6]}>
                                {hoveredElement.shells.map((count, i) => (
                                    <ElectronShell key={i} radius={1.5 + i * 0.8} electrons={count} speed={1/(i+1)} />
                                ))}
                            </group>
                        </Canvas>
                    </Card>
                </div>
            )}

                        {/* Main 3D Scene */}
            <Canvas camera={{ position: [0, 15, 25], fov: 45 }}>
                <color attach="background" args={['#ffffff']} />
                <ambientLight intensity={0.8} />
                <pointLight position={[20, 30, 20]} intensity={1.2} />
                <pointLight position={[-20, 10, -20]} intensity={0.5} />
                <group position={[-9, 0, 0]}> {/* Center the table roughly */}
                    {ELEMENTS.map((el) => {
                        // Calculate 3D position (Flat Layout)
                        let x = el.group * 1.1;
                        let z = el.period * 1.1;
                        let y = 0;

                        // Offset for Lanthanides/Actinides (f-block)
                        if (el.block === 'f') {
                            y = -3; // Drop them down slightly
                            z += 2.5; // Push them forward/separate
                            x = (el.number >= 57 && el.number <= 71) ? (el.number - 57) + 3 : (el.number - 89) + 3; 
                        }

                        return (
                            <ElementTile 
                                key={el.number} 
                                element={el} 
                                position={[x, y, z]} 
                                trend={trend}
                                onHover={setHoveredElement}
                                onClick={handleElementClick}
                            />
                        );
                    })}
                </group>

                <OrbitControls 
                    enablePan={true} 
                    enableZoom={true}
                    maxPolarAngle={Math.PI / 2.2} 
                    minDistance={2}
                    maxDistance={60}
                    target={[9, 0, 4]} 
                />
            </Canvas>
        </div>
    );
};




