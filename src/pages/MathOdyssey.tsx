import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    Dices,
    Sigma,
    GitGraph,
    Infinity,
    Grid,
    Box,
    ArrowLeft,
    Coins,
    Layers
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Slider } from '../components/ui/Slider';

// Trigonometry Module Component
const TrigonometryModule = () => {
    const [angle, setAngle] = useState(45);

    const radians = (angle * Math.PI) / 180;
    const x = Math.cos(radians);
    const y = Math.sin(radians);

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex items-center gap-4 shrink-0">
                <Button variant="ghost" onClick={() => window.location.reload()} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-display font-black text-brand-black">Trigonometry</h1>
                    <p className="text-sm text-gray-500 font-bold">The Unit Circle</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card className="bg-blue-50 border-blue-200">
                        <div className="flex flex-col items-center text-center gap-4">
                            <TrendingUp className="w-12 h-12 text-blue-500" />
                            <p className="text-sm leading-relaxed text-brand-black font-bold">
                                "The unit circle relates angles to coordinates. Cosine is x, Sine is y."
                            </p>
                        </div>
                    </Card>

                    <Card className="flex-1 space-y-6">
                        <div>
                            <h3 className="font-black text-brand-black mb-4">Controls</h3>
                            <Slider
                                label="Angle (degrees)"
                                value={angle}
                                min={0}
                                max={360}
                                step={1}
                                onChange={setAngle}
                                color="blue"
                            />
                        </div>

                        <div className="bg-gray-100 p-4 rounded-xl space-y-2 border-2 border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-bold">Angle (rad):</span>
                                <span className="font-mono font-black text-brand-black">{radians.toFixed(2)}π</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-bold">Cos(θ):</span>
                                <span className="font-mono font-black text-blue-600">{x.toFixed(3)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-bold">Sin(θ):</span>
                                <span className="font-mono font-black text-red-600">{y.toFixed(3)}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 h-[500px] lg:h-auto rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white relative flex items-center justify-center p-8">
                    {/* SVG Visualization */}
                    <svg viewBox="0 0 400 300" className="w-full h-full">
                        {/* Grid */}
                        <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {/* Axes */}
                        <line x1="20" y1="150" x2="380" y2="150" stroke="#94a3b8" strokeWidth="2" />
                        <line x1="200" y1="20" x2="200" y2="280" stroke="#94a3b8" strokeWidth="2" />

                        {/* Unit Circle (Radius 100px) */}
                        <circle cx="200" cy="150" r="100" fill="none" stroke="#cbd5e1" strokeWidth="2" />

                        {/* Angle Arc */}
                        <path
                            d={`M 230 150 A 30 30 0 ${angle > 180 ? 1 : 0} 0 ${200 + 30 * Math.cos(-radians)} ${150 + 30 * Math.sin(-radians)}`}
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2"
                        />

                        {/* Triangle Lines */}
                        <line x1="200" y1="150" x2={200 + x * 100} y2={150} stroke="#2563eb" strokeWidth="3" /> {/* Cos */}
                        <line x1={200 + x * 100} y1={150} x2={200 + x * 100} y2={150 - y * 100} stroke="#dc2626" strokeWidth="3" /> {/* Sin */}
                        <line x1="200" y1="150" x2={200 + x * 100} y2={150 - y * 100} stroke="#000" strokeWidth="2" /> {/* Hypotenuse */}

                        {/* Point */}
                        <circle cx={200 + x * 100} cy={150 - y * 100} r="6" fill="#000" />

                        {/* Labels */}
                        <text x={200 + x * 50} y={170} textAnchor="middle" fill="#2563eb" fontWeight="bold">cos</text>
                        <text x={200 + x * 100 + 10} y={150 - y * 50} fill="#dc2626" fontWeight="bold">sin</text>
                    </svg>
                </div>
            </div>
        </div>
    );
};

interface Topic {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    bg: string;
    path?: string;
    action?: () => void;
    disabled?: boolean;
}

export const MathOdyssey: React.FC = () => {
    const navigate = useNavigate();
    const [activeModule, setActiveModule] = useState<'hub' | 'trig'>('hub');
    const [activeTab, setActiveTab] = useState<'class11' | 'class12'>('class11');

    const topics: { [key: string]: Topic[] } = {
        class11: [
            {
                id: 'sets',
                title: 'Sets & Venn Diagrams',
                description: 'Visualize set operations with 3D intersecting spheres.',
                icon: Layers,
                color: 'text-indigo-600',
                bg: 'bg-indigo-100',
                path: '/math/sets',
                disabled: false
            },
            {
                id: 'relations',
                title: 'Relations & Functions',
                description: 'Map domains to ranges with interactive draggable curves.',
                icon: GitGraph,
                color: 'text-cyan-600',
                bg: 'bg-cyan-100',
                path: '/math/relations',
                disabled: false
            },
            {
                id: 'trig',
                title: 'Trigonometric Functions',
                description: 'Master the Unit Circle and rotating 3D graphs.',
                icon: TrendingUp,
                color: 'text-blue-600',
                bg: 'bg-blue-100',
                action: () => setActiveModule('trig'),
                disabled: false
            },
            {
                id: 'complex',
                title: 'Complex Numbers',
                description: 'Explore the Argand plane with animated 3D visuals.',
                icon: Infinity,
                color: 'text-purple-600',
                bg: 'bg-purple-100',
                path: '/math/complex',
                disabled: false
            },
            {
                id: 'algebra',
                title: 'Algebra',
                description: 'Sequences, series, and inequalities with dynamic sliders.',
                icon: Grid,
                color: 'text-orange-600',
                bg: 'bg-orange-100',
                path: '/math/algebra',
                disabled: false
            },
            {
                id: 'geometry',
                title: 'Coordinate Geometry',
                description: 'Rotate and slice 3D conics: parabolas, ellipses, hyperbolas.',
                icon: Box,
                color: 'text-emerald-600',
                bg: 'bg-emerald-100',
                path: '/math/geometry',
                disabled: false
            }
        ],
        class12: [
            {
                id: 'calculus',
                title: 'Calculus',
                description: 'Visualize limits, derivatives, and integrals in real-time.',
                icon: Sigma,
                color: 'text-rose-600',
                bg: 'bg-rose-100',
                disabled: true
            },
            {
                id: 'matrices',
                title: 'Matrices & Determinants',
                description: 'Transform 3D grids and understand linear maps.',
                icon: Grid,
                color: 'text-violet-600',
                bg: 'bg-violet-100',
                disabled: true
            },
            {
                id: 'vectors',
                title: 'Vectors & 3D Geometry',
                description: 'Perform dot/cross products and visualize planes.',
                icon: ArrowLeft,
                color: 'text-sky-600',
                bg: 'bg-sky-100',
                disabled: true
            },
            {
                id: 'linear',
                title: 'Linear Programming',
                description: 'Optimize objective functions in a 3D feasible region.',
                icon: TrendingUp,
                color: 'text-lime-600',
                bg: 'bg-lime-100',
                disabled: true
            },
            {
                id: 'probability',
                title: 'Probability Lab',
                description: 'Roll dice and visualize probability distributions in 3D.',
                icon: Dices,
                color: 'text-pink-600',
                bg: 'bg-pink-100',
                path: '/math/probability',
                disabled: false
            },
            {
                id: 'coins',
                title: 'Coin Toss Sim',
                description: 'Flip coins and explore sample spaces.',
                icon: Coins,
                color: 'text-yellow-600',
                bg: 'bg-yellow-100',
                path: '/math/probability/coins',
                disabled: false
            },
        ]
    };

    if (activeModule === 'hub') {
        return (
            <div className="h-full flex flex-col gap-6">
                <div className="flex items-center gap-4 shrink-0">
                    <Button variant="ghost" onClick={() => navigate('/')} className="px-2">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-display font-black text-brand-black">Math Odyssey</h1>
                        <p className="text-sm text-gray-500 font-bold">Explore the Universe of Mathematics</p>
                    </div>
                </div>

                <div className="flex space-x-1 bg-white p-1 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-fit">
                    <button
                        onClick={() => setActiveTab('class11')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'class11'
                            ? 'bg-black text-white'
                            : 'text-gray-500 hover:text-black'
                            }`}
                    >
                        Class 11
                    </button>
                    <button
                        onClick={() => setActiveTab('class12')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'class12'
                            ? 'bg-black text-white'
                            : 'text-gray-500 hover:text-black'
                            }`}
                    >
                        Class 12
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topics[activeTab].map((topic) => (
                        <Card
                            key={topic.id}
                            hoverEffect={!topic.disabled}
                            className={`relative ${topic.disabled ? 'opacity-50 grayscale' : 'cursor-pointer'}`}
                            onClick={() => {
                                if (!topic.disabled) {
                                    if (topic.action) topic.action();
                                    else if (topic.path) navigate(topic.path);
                                }
                            }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${topic.bg} ${topic.color}`}>
                                    <topic.icon className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-brand-black">{topic.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{topic.description}</p>

                            {!topic.disabled && (
                                <div className="mt-6 flex justify-end">
                                    <span className={`${topic.color} text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all`}>
                                        Explore <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </span>
                                </div>
                            )}

                            {topic.disabled && (
                                <div className="absolute top-4 right-4 px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-500 border border-gray-200">
                                    Coming Soon
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return <TrigonometryModule />;
};
