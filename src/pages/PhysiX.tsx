import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Lock, ArrowLeft, MoveDiagonal, Scale, Activity, Battery, Globe } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { QuizInterface } from '../components/QuizInterface';

export const PhysiX: React.FC = () => {
    const navigate = useNavigate();
    const [showPopQuiz, setShowPopQuiz] = useState(false);

    // Simulate "Adaptive Check" trigger
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopQuiz(true);
        }, 8000); // 8 seconds for demo
        return () => clearTimeout(timer);
    }, []);

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
        <div className="max-w-5xl mx-auto space-y-8 relative">
            {/* Pop Quiz Overlay */}
            {showPopQuiz && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl">
                        <div className="bg-yellow-400 p-4 border-b-4 border-black flex justify-between items-center">
                            <h2 className="text-xl font-black uppercase flex items-center gap-2">
                                ⚠️ Field Check: Gravitation
                            </h2>
                            <button
                                onClick={() => setShowPopQuiz(false)}
                                className="font-bold hover:underline"
                            >
                                Close
                            </button>
                        </div>
                        <div className="p-1">
                            {/* Reusing QuizInterface but mocking a specific question */}
                            <QuizInterface
                                topicId="gravitation"
                                onComplete={() => {
                                    alert(`Field Check Complete! Efficiency verified.`);
                                    setShowPopQuiz(false);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

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
