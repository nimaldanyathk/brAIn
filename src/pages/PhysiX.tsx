import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Lock, ArrowLeft, MoveDiagonal, Scale, Activity, Battery, Globe } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const PhysiX: React.FC = () => {
    const navigate = useNavigate();

    const experiments = [
        {
            id: 'ohms-law',
            title: "Ohm's Law",
            description: "Understand the relationship between Voltage, Current, and Resistance.",
            icon: Zap,
            locked: false,
            path: '/physix/ohms-law',
        },
        {
            id: 'vectors',
            title: "Vector Addition",
            description: "Visualize the Parallelogram Law of Vector Addition.",
            icon: MoveDiagonal,
            locked: false,
            path: '/physix/vectors',
        },
        {
            id: 'newton',
            title: "Newton's Laws",
            description: "Explore Inertia, F=ma, and Action-Reaction.",
            icon: Scale,
            locked: false,
            path: '/physix/newton',
        },
        {
            id: 'momentum',
            title: "Conservation of Momentum",
            description: "Simulate elastic collisions and momentum transfer.",
            icon: Activity,
            locked: false,
            path: '/physix/momentum',
        },
        {
            id: 'energy',
            title: "Energy & Work",
            description: "Understand Work-Energy Theorem and Conservation.",
            icon: Battery,
            locked: false,
            path: '/physix/energy',
        },
        {
            id: 'gravitation',
            title: "Gravitation",
            description: "Universal Law and Kepler's Planetary Motion.",
            icon: Globe,
            locked: false,
            path: '/physix/gravitation',
        },
        {
            id: 'optics',
            title: "Ray Optics",
            description: "Explore reflection and refraction with lasers.",
            icon: Lock,
            locked: false,
            path: '/physix/optics',
        },
        {
            id: 'motion',
            title: "Projectile Motion",
            description: "Launch objects and study their trajectory.",
            icon: Lock,
            locked: false,
            path: '/physix/motion',
        },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/')} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="text-3xl font-display font-bold text-brand-black">PhysiX Dimension</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiments.map((exp) => (
                    <Card
                        key={exp.id}
                        hoverEffect={!exp.locked}
                        className={`relative ${exp.locked ? 'opacity-50 grayscale' : 'cursor-pointer'}`}
                        onClick={() => !exp.locked && navigate(exp.path)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl text-brand-blue">
                                <exp.icon className="w-6 h-6" />
                            </div>
                            {exp.locked && <Lock className="w-5 h-5 text-gray-400" />}
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-brand-black">{exp.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{exp.description}</p>

                        {!exp.locked && (
                            <div className="mt-6 flex justify-end">
                                <span className="text-brand-blue text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Start Mission <ArrowLeft className="w-4 h-4 rotate-180" />
                                </span>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};
