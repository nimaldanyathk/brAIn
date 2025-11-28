import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ArrowLeft, Info, ChevronRight, ChevronLeft, Settings } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
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
        <div className="h-full w-full bg-white text-gray-900 relative overflow-hidden font-sans">
            
            {/* Header */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/chemistry')} className="px-2 text-gray-700 hover:bg-gray-100">
                    <ArrowLeft className="w-8 h-8" />
                </Button>
                <div>
                    <h1 className="text-4xl font-black text-gray-900">
                        ATOMIC LAB
                    </h1>
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">
                        Advanced Simulation
                    </p>
                </div>
            </div>

            {/* Main Controls (Bottom) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-3xl px-4">
                <Card className="bg-white/90 backdrop-blur-xl border-gray-200 shadow-xl p-8">
                    <div className="flex flex-col gap-8">
                        {/* Element Selector */}
                        <div className="flex items-center justify-between gap-6">
                            <Button variant="ghost" onClick={prevElement} disabled={atomicNumber <= 1} className="text-gray-600 hover:bg-gray-100">
                                <ChevronLeft className="w-10 h-10" />
                            </Button>
                            
                            <div className="text-center">
                                <div className="text-7xl font-black text-gray-900 mb-2">{element.symbol}</div>
                                <div className="text-2xl font-bold text-blue-600">{element.name}</div>
                            </div>

                            <Button variant="ghost" onClick={nextElement} disabled={atomicNumber >= 118} className="text-gray-600 hover:bg-gray-100">
                                <ChevronRight className="w-10 h-10" />
                            </Button>
                        </div>

                        {/* Slider */}
                        <div className="px-4">
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
                    </div>
                </Card>
            </div>

            {/* Info Panel (Right) */}
            <div className="absolute top-24 right-6 z-20 w-80 flex flex-col gap-6">
                <Card className="bg-white/90 backdrop-blur-xl border-gray-200 shadow-xl p-6">
                    <h3 className="text-base font-bold text-blue-600 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Info className="w-5 h-5" /> Data Analysis
                    </h3>
                    <div className="space-y-5">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <span className="text-gray-500 text-base font-medium">Atomic Mass</span>
                            <span className="font-mono font-bold text-2xl text-gray-900">{element.mass} u</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <span className="text-gray-500 text-base font-medium">Protons</span>
                            <span className="font-mono font-bold text-xl text-red-500">{element.number}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <span className="text-gray-500 text-base font-medium">Neutrons</span>
                            <span className="font-mono font-bold text-xl text-gray-500">{Math.round(element.mass - element.number)}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <span className="text-gray-500 text-base font-medium">Electrons</span>
                            <span className="font-mono font-bold text-xl text-blue-500">{element.number}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 text-base font-medium block mb-2">Electron Config</span>
                            <div className="font-mono text-sm bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-900 font-bold">
                                {element.electron_configuration}
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="bg-white/90 backdrop-blur-xl border-gray-200 shadow-xl p-6">
                    <h3 className="text-base font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5" /> View Model
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {['bohr', 'quantum', 'rutherford'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setViewMode(m as any)}
                                className={`py-3 rounded-lg text-xs font-bold uppercase transition-all border-2 ${
                                    viewMode === m 
                                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                                    : 'border-transparent hover:bg-gray-50 text-gray-500'
                                }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </Card>
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
