import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Atom, FlaskConical, Calculator, ArrowRight, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
    const navigate = useNavigate();

    const realms = [
        {
            id: 'chemiverse',
            title: 'Chemiverse',
            description: 'Mix molecules, observe reactions, and master the elements.',
            icon: FlaskConical,
            color: 'text-accent-green',
            bg: 'bg-green-100',
            path: '/chemiverse',
            progress: 30,
        },
        {
            id: 'physix',
            title: 'PhysiX Dimension',
            description: 'Explore forces, energy, and the laws of the universe.',
            icon: Atom,
            color: 'text-brand-blue',
            bg: 'bg-blue-100',
            path: '/physix',
            progress: 15,
        },
        {
            id: 'math',
            title: 'Math Odyssey',
            description: 'Visualize equations and solve cosmic puzzles.',
            icon: Calculator,
            color: 'text-accent-yellow',
            bg: 'bg-yellow-100',
            path: '/math',
            progress: 0,
        },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-16">
            {/* Hero Section */}
            <section className="relative pt-8">
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-brand-black">
                    Welcome back, <span className="text-brand-blue">Cadet!</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mb-8 leading-relaxed">
                    Your daily mission awaits. Choose a realm to continue your training or review your recent discoveries.
                </p>
                <div className="flex gap-4">
                    <Button onClick={() => navigate('/physix')} variant="primary" size="lg">
                        Resume Training <ArrowRight className="inline ml-2 w-5 h-5" />
                    </Button>
                </div>
            </section>

            {/* Realms Grid */}
            <section>
                <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3 text-brand-black">
                    <Star className="w-6 h-6 text-accent-yellow fill-accent-yellow" />
                    Select a Realm
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {realms.map((realm) => (
                        <Card
                            key={realm.id}
                            hoverEffect
                            className="cursor-pointer group"
                            onClick={() => navigate(realm.path)}
                        >
                            <div className="mb-6 flex justify-between items-start">
                                <div className={`p-4 rounded-2xl ${realm.bg} ${realm.color}`}>
                                    <realm.icon className="w-8 h-8" />
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-bold text-brand-black">{realm.progress}%</span>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Complete</p>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-brand-black">{realm.title}</h3>
                            <p className="text-gray-500 mb-6 text-sm leading-relaxed">{realm.description}</p>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${realm.color.replace('text-', 'bg-')}`}
                                    style={{ width: `${realm.progress}%` }}
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};
