import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Atom, FlaskConical, Calculator, ArrowRight, Star, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { UltramodernButton } from '../components/ui/UltramodernButton';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    const realms = [
        {
            id: 'chemiverse',
            title: 'Chemiverse',
            description: 'Mix molecules, observe reactions, and master the elements.',
            icon: FlaskConical,
            color: 'text-accent-green',
            bg: 'bg-green-100',
            path: '/chemistry',
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

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 50
            }
        }
    };

    return (
        <div ref={containerRef} className="relative min-h-screen pb-20">
            {/* Hero Section with Parallax & Scroll Mask */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-yellow/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-green/10 rounded-full blur-3xl animate-pulse delay-700" />
                </div>

                <div className="relative z-10 text-center max-w-4xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                            <Sparkles className="w-4 h-4 text-accent-yellow fill-accent-yellow" />
                            <span className="text-sm font-black uppercase tracking-wider">Ready for Science?</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-black mb-6 text-brand-black leading-tight">
                            Welcome back, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-accent-green">Cadet!</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-500 mb-10 leading-relaxed font-medium">
                            Your daily mission awaits. Choose a realm to continue your training.
                        </p>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="flex justify-center"
                        >
                            <UltramodernButton onClick={() => navigate('/physix')}>
                                Resume Training <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </UltramodernButton>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Realms Grid with Staggered Reveal */}
            <section className="max-w-6xl mx-auto px-6 -mt-10 relative z-30">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-px flex-1 bg-black/10" />
                    <h2 className="text-2xl font-display font-black flex items-center gap-3 text-brand-black bg-surface-gray px-4">
                        <Star className="w-6 h-6 text-accent-yellow fill-accent-yellow" />
                        Select a Realm
                    </h2>
                    <div className="h-px flex-1 bg-black/10" />
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {realms.map((realm) => (
                        <motion.div key={realm.id} variants={itemVariants}>
                            <Card
                                hoverEffect
                                className="cursor-pointer group h-full flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300"
                                onClick={() => navigate(realm.path)}
                            >
                                <div>
                                    <div className="mb-6 flex justify-between items-start">
                                        <div className={`p-4 rounded-2xl ${realm.bg} ${realm.color} border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all`}>
                                            <realm.icon className="w-8 h-8" />
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-brand-black">{realm.progress}%</span>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Complete</p>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black mb-3 text-brand-black group-hover:text-brand-blue transition-colors">{realm.title}</h3>
                                    <p className="text-gray-500 mb-8 text-sm leading-relaxed font-medium">{realm.description}</p>
                                </div>
                                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden border-2 border-black/5">
                                    <motion.div
                                        className={`h-full ${realm.color.replace('text-', 'bg-')}`}
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${realm.progress}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </div>
    );
};
