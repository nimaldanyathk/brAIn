import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowLeft, Atom, Info } from 'lucide-react';
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
    const { color } = useMemo(() => {
        let c = new THREE.Color(`#${element.cpkHex}`);

        if (trend === 'radius' && element.atomic_radius) {
            c.setHSL(0.6 - (element.atomic_radius / 300) * 0.6, 1, 0.5); // Blue (small) to Red (large)
        } else if (trend === 'electronegativity' && element.electronegativity) {
            c.setHSL((element.electronegativity / 4) * 0.3, 1, 0.5); // Red (low) to Green (high)
        }

        return { color: c };
    }, [element, trend]);

    useFrame((state) => {
        if (mesh.current) {
            // Hover animation
            const targetScale = hovered ? 1.2 : 1;
            mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

            // Gentle float
            if (!hovered) {
                mesh.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2 + position[0]) * 0.05;
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
            <mesh>
                <boxGeometry args={[0.9, 0.9, 0.1]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.2}
                    roughness={0.5}
                />
            </mesh>

            {/* Border/Rim */}
            <mesh>
                <boxGeometry args={[0.92, 0.92, 0.08]} />
                <meshBasicMaterial color="#000000" wireframe />
            </mesh>

            {/* Symbol Text */}
            <Text
                position={[0, 0.1, 0.06]}
                fontSize={0.35}
                color="black"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
            >
                {element.symbol}
            </Text>

            {/* Atomic Number */}
            <Text
                position={[-0.35, 0.35, 0.06]}
                fontSize={0.12}
                color="#333"
                anchorX="left"
                anchorY="top"
            >
                {element.number}
            </Text>

            {/* Name (Small) */}
            <Text
                position={[0, -0.25, 0.06]}
                fontSize={0.08}
                color="#444"
                anchorX="center"
                anchorY="middle"
                maxWidth={0.8}
            >
                {element.name}
            </Text>
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
        <div className="h-full w-full bg-white text-brand-black relative overflow-hidden font-sans">

            {/* Header */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/chemistry')} className="px-2">
                    <ArrowLeft className="w-8 h-8" />
                </Button>
                <div>
                    <h1 className="text-4xl font-display font-black text-brand-black">
                        PERIODIC TABLE
                    </h1>
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                        <Atom className="w-4 h-4" /> Interactive 3D Visualization
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute top-6 right-6 z-20 flex gap-2">
                <div className="bg-white p-1 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex gap-2">
                    <button
                        onClick={() => setTrend('standard')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${trend === 'standard' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
                    >
                        Standard
                    </button>
                    <button
                        onClick={() => setTrend('radius')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${trend === 'radius' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
                    >
                        Atomic Radius
                    </button>
                    <button
                        onClick={() => setTrend('electronegativity')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${trend === 'electronegativity' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
                    >
                        Electronegativity
                    </button>
                </div>
            </div>

            {/* Mini Atom Preview (Bottom Right) */}
            {hoveredElement && (
                <div className="absolute bottom-6 right-6 z-20 w-80 h-80 pointer-events-none">
                    <Card className="w-full h-full bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
                        <div className="absolute top-4 left-5 z-10">
                            <div className="text-5xl font-black text-brand-black mb-1">{hoveredElement.symbol}</div>
                            <div className="text-xl font-bold text-blue-600">{hoveredElement.name}</div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">{hoveredElement.category}</div>
                        </div>

                        <div className="absolute bottom-4 left-5 z-10 space-y-1">
                            <div className="text-xs text-gray-500 font-bold">Atomic Mass: <span className="text-brand-black font-mono">{hoveredElement.mass}</span></div>
                            <div className="text-xs text-gray-500 font-bold">Config: <span className="text-brand-black font-mono">{hoveredElement.electron_configuration}</span></div>
                        </div>

                        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                            <ambientLight intensity={1} />
                            <pointLight position={[10, 10, 10]} />
                            <Nucleus protons={hoveredElement.number} neutrons={Math.round(hoveredElement.mass - hoveredElement.number)} color={`#${hoveredElement.cpkHex}`} />
                            <group rotation={[0, 0, Math.PI / 6]}>
                                {hoveredElement.shells.map((count, i) => (
                                    <ElectronShell key={i} radius={1.5 + i * 0.8} electrons={count} speed={1 / (i + 1)} />
                                ))}
                            </group>
                        </Canvas>
                    </Card>
                </div>
            )}

            {/* Tooltip for Instructions */}
            <div className="absolute bottom-6 left-6 z-20 max-w-xs text-gray-500 text-xs font-medium bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 mb-2 text-brand-black font-bold">
                    <Info className="w-4 h-4" /> Navigation
                </div>
                <p>• Left Click + Drag to Rotate</p>
                <p>• Right Click + Drag to Pan</p>
                <p>• Scroll to Zoom</p>
                <p>• Click Element to Inspect</p>
            </div>

            {/* Main 3D Scene */}
            <Canvas camera={{ position: [0, 0, 24], fov: 45 }}>
                <Environment preset="city" />
                <color attach="background" args={['#ffffff']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 30]} intensity={1} />
                <pointLight position={[-10, -10, 30]} intensity={0.5} />

                <group position={[-9, 5, 0]}> {/* Centered manually based on table width */}
                    {ELEMENTS.map((el) => {
                        // Calculate 3D position (Vertical Layout)
                        // X = Group (1-18)
                        // Y = -Period (1-7)
                        let x = (el.group - 1) * 1.1;
                        let y = -(el.period - 1) * 1.1;
                        let z = 0;

                        // Offset for Lanthanides/Actinides (f-block)
                        if (el.block === 'f') {
                            // Place them below the main table
                            // Period 6 (Lanthanides) -> visually Row 9 (gap of 1 row)
                            // Period 7 (Actinides) -> visually Row 10
                            const fRow = el.period === 6 ? 8.5 : 9.6;
                            y = -fRow * 1.1;

                            // Center them roughly under the main block
                            // They correspond to group 3 gap.
                            // Start them from x = 2 (Group 3 position) onwards
                            const offset = (el.number >= 57 && el.number <= 71) ? (el.number - 57) : (el.number - 89);
                            x = (2 + offset) * 1.1 + (1.1 * 1); // Shift slightly right to center better
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
                    minDistance={5}
                    maxDistance={100}
                    target={[0, 0, 0]}
                />
            </Canvas>
        </div>
    );
};
