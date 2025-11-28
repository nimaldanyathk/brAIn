import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ArrowLeft, Info, ChevronRight, ChevronLeft, Atom } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Slider } from '../../components/ui/Slider';
import { getElement, getOrbitals } from './utils/elements';
import { Nucleus, ElectronShell, QuantumOrbital } from './components/AtomParts';

export const AtomicStructure = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialZ = parseInt(searchParams.get('Z') || '1');
    const [atomicNumber, setAtomicNumber] = useState(initialZ);
    const [viewMode, setViewMode] = useState<'bohr' | 'quantum' | 'rutherford'>('bohr');

    const element = getElement(atomicNumber);
    const orbitals = useMemo(() => getOrbitals(element), [element]);

    const nextElement = () => setAtomicNumber(prev => Math.min(prev + 1, 118));
    const prevElement = () => setAtomicNumber(prev => Math.max(prev - 1, 1));

    return (
        <div className="h-full w-full bg-white text-brand-black relative overflow-hidden font-sans">

            {/* Header */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/chemistry')} className="px-2">
                    <ArrowLeft className="w-8 h-8" />
                </Button>
                <div>
                    <h1 className="text-4xl font-display font-black text-brand-black">
                        ATOMIC LAB
                    </h1>
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                        <Atom className="w-4 h-4" /> Advanced Simulation
                    </p>
                </div>
            </div>

            {/* Main Controls (Left Sidebar) - Neo-Brutalist */}
            <div className="absolute top-24 left-6 z-20 w-80 flex flex-col gap-6">
                <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl p-6 flex flex-col gap-6">
                    {/* Element Selector */}
                    <div className="flex items-center justify-between gap-4">
                        <Button variant="ghost" onClick={prevElement} disabled={atomicNumber <= 1} className="text-gray-500 hover:text-black p-1">
                            <ChevronLeft className="w-8 h-8" />
                        </Button>

                        <div className="text-center">
                            <div className="text-5xl font-black text-brand-black mb-1">{element.symbol}</div>
                            <div className="text-lg font-bold text-blue-600 truncate max-w-[120px]">{element.name}</div>
                        </div>

                        <Button variant="ghost" onClick={nextElement} disabled={atomicNumber >= 118} className="text-gray-500 hover:text-black p-1">
                            <ChevronRight className="w-8 h-8" />
                        </Button>
                    </div>

                    {/* Slider */}
                    <div className="px-2">
                        <Slider
                            label="Atomic Number (Z)"
                            value={atomicNumber}
                            onChange={setAtomicNumber}
                            min={1}
                            max={118}
                            step={1}
                            color="blue"
                        />
                    </div>

                    {/* View Mode Switcher (Vertical) */}
                    <div className="flex flex-col gap-2 border-t-2 border-gray-100 pt-4">
                        {['bohr', 'quantum', 'rutherford'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setViewMode(m as any)}
                                className={`w-full py-2 rounded-lg text-xs font-bold uppercase transition-all border-2 ${viewMode === m
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
                                    }`}
                            >
                                {m} Model
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Info Panel (Right) - Neo-Brutalist */}
            <div className="absolute top-24 right-6 z-20 w-72 flex flex-col gap-4">
                <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl p-5">
                    <h3 className="text-sm font-black text-brand-black uppercase tracking-wider mb-4 flex items-center gap-2 border-b-2 border-gray-100 pb-2">
                        <Info className="w-4 h-4" /> Data Analysis
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-xs font-bold uppercase">Mass</span>
                            <span className="font-mono font-black text-lg text-brand-black">{element.mass} u</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-xs font-bold uppercase">Protons</span>
                            <span className="font-mono font-black text-lg text-red-500">{element.number}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-xs font-bold uppercase">Neutrons</span>
                            <span className="font-mono font-black text-lg text-gray-500">{Math.round(element.mass - element.number)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-xs font-bold uppercase">Electrons</span>
                            <span className="font-mono font-black text-lg text-blue-500">{element.number}</span>
                        </div>
                        <div className="pt-2 border-t-2 border-gray-100 mt-2">
                            <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Config</span>
                            <div className="font-mono text-xs bg-gray-100 p-2 rounded border border-gray-200 text-brand-black font-bold">
                                {element.electron_configuration}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3D Scene */}
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
                <color attach="background" args={['#ffffff']} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />

                <group>
                    <Nucleus
                        protons={element.number}
                        neutrons={Math.round(element.mass - element.number)}
                        color={`#${element.cpkHex}`}
                    />

                    {viewMode === 'bohr' && (
                        <group>
                            {element.shells.map((count, i) => (
                                <ElectronShell
                                    key={i}
                                    radius={2 + i * 1.2}
                                    electrons={count}
                                    speed={1 / (i + 1)}
                                />
                            ))}
                        </group>
                    )}

                    {viewMode === 'rutherford' && (
                        <group>
                            {Array.from({ length: element.number }).map((_, i) => (
                                <group key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                                    <ElectronShell radius={3 + Math.random()} electrons={1} speed={2} />
                                </group>
                            ))}
                        </group>
                    )}

                    {viewMode === 'quantum' && (
                        <group>
                            {orbitals.map((orb, i) => (
                                <QuantumOrbital key={i} type={orb.type} count={orb.count} />
                            ))}
                        </group>
                    )}
                </group>

                <OrbitControls enablePan={false} maxDistance={20} minDistance={5} />
            </Canvas>
        </div>
    );
};
