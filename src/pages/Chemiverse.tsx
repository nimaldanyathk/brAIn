import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Atom, FlaskConical, Layers, Zap, Flame, Snowflake, Dna, Hexagon, Component, Globe } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Chemiverse: React.FC = () => {
    const navigate = useNavigate();

    const modules = [
        {
            id: 'atomic',
            title: "Atomic Structure",
            description: "Explore Bohr and Quantum models of the atom.",
            icon: Atom,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            path: '/chemistry/atomic',
        },
        {
            id: 'periodic',
            title: "Periodic Table",
            description: "Interactive 3D periodic table with trends.",
            icon: Layers,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            path: '/chemistry/periodic',
        },
        {
            id: 'bonding',
            title: "Chemical Bonding",
            description: "VSEPR theory and molecular geometry.",
            icon: Hexagon,
            color: 'text-pink-600',
            bg: 'bg-pink-50',
            path: '/chemistry/bonding',
        },
        {
            id: 'states',
            title: "States of Matter",
            description: "Particle simulations of solids, liquids, and gases.",
            icon: Snowflake,
            color: 'text-cyan-600',
            bg: 'bg-cyan-50',
            path: '/chemistry/states',
        },
        {
            id: 'reactions',
            title: "Chemical Reactions",
            description: "Visualize reaction mechanisms and energy curves.",
            icon: Zap,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
            path: '/chemistry/reactions',
        },
        {
            id: 'combustion',
            title: "Combustion & Flame",
            description: "Study flame structure and combustion reactions.",
            icon: Flame,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            path: '/chemistry/combustion',
        },
        {
            id: 'crystals',
            title: "Crystal Structures",
            description: "Explore FCC, BCC, and HCP unit cells.",
            icon: Component,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            path: '/chemistry/crystals',
        },
        {
            id: 'electro',
            title: "Electrochemistry",
            description: "Galvanic cells and electrolysis simulations.",
            icon: Zap,
            color: 'text-lime-600',
            bg: 'bg-lime-50',
            path: '/chemistry/electro',
        },
        {
            id: 'organic',
            title: "Organic Molecules",
            description: "Stereochemistry and functional groups.",
            icon: Hexagon,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            path: '/chemistry/organic',
        },
        {
            id: 'polymers',
            title: "Polymers",
            description: "Macromolecules and polymerization chains.",
            icon: Dna,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            path: '/chemistry/polymers',
        },
        {
            id: 'environmental',
            title: "Environmental Chemistry",
            description: "Atmospheric layers and pollution simulations.",
            icon: Globe,
            color: 'text-teal-600',
            bg: 'bg-teal-50',
            path: '/chemistry/environmental',
        },
        {
            id: 'molecules',
            title: "Molecular Lab",
            description: "Original 3D molecule viewer.",
            icon: FlaskConical,
            color: 'text-green-600',
            bg: 'bg-green-50',
            path: '/chemistry/molecules',
        },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/')} className="px-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="text-3xl font-display font-bold text-brand-black">Chemiverse</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((mod) => (
                    <Card
                        key={mod.id}
                        hoverEffect={true}
                        className="cursor-pointer"
                        onClick={() => navigate(mod.path)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${mod.bg} ${mod.color}`}>
                                <mod.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-brand-black">{mod.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{mod.description}</p>

                        <div className="mt-6 flex justify-end">
                            <span className={`${mod.color} text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all`}>
                                Enter Module <ArrowLeft className="w-4 h-4 rotate-180" />
                            </span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
