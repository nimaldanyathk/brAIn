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
            path: '/chemistry/atomic',
        },
        {
            id: 'periodic',
            title: "Periodic Table",
            description: "Interactive 3D periodic table with trends.",
            icon: Layers,
            path: '/chemistry/periodic',
        },
        {
            id: 'bonding',
            title: "Chemical Bonding",
            description: "VSEPR theory and molecular geometry.",
            icon: Hexagon,
            path: '/chemistry/bonding',
        },
        {
            id: 'states',
            title: "States of Matter",
            description: "Particle simulations of solids, liquids, and gases.",
            icon: Snowflake,
            path: '/chemistry/states',
        },
        {
            id: 'reactions',
            title: "Chemical Reactions",
            description: "Visualize reaction mechanisms and energy curves.",
            icon: Zap,
            path: '/chemistry/reactions',
        },
        {
            id: 'combustion',
            title: "Combustion & Flame",
            description: "Study flame structure and combustion reactions.",
            icon: Flame,
            path: '/chemistry/combustion',
        },
        {
            id: 'crystals',
            title: "Crystal Structures",
            description: "Explore FCC, BCC, and HCP unit cells.",
            icon: Component,
            path: '/chemistry/crystals',
        },
        {
            id: 'electro',
            title: "Electrochemistry",
            description: "Galvanic cells and electrolysis simulations.",
            icon: Zap,
            path: '/chemistry/electro',
        },
        {
            id: 'organic',
            title: "Organic Molecules",
            description: "Stereochemistry and functional groups.",
            icon: Hexagon,
            path: '/chemistry/organic',
        },
        {
            id: 'polymers',
            title: "Polymers",
            description: "Macromolecules and polymerization chains.",
            icon: Dna,
            path: '/chemistry/polymers',
        },
        {
            id: 'environmental',
            title: "Environmental Chemistry",
            description: "Atmospheric layers and pollution simulations.",
            icon: Globe,
            path: '/chemistry/environmental',
        },
        {
            id: 'molecules',
            title: "Molecular Lab",
            description: "Original 3D molecule viewer.",
            icon: FlaskConical,
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
                            <div className="p-3 bg-green-50 rounded-xl text-green-600">
                                <mod.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-brand-black">{mod.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{mod.description}</p>

                        <div className="mt-6 flex justify-end">
                            <span className="text-green-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                Enter Module <ArrowLeft className="w-4 h-4 rotate-180" />
                            </span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
