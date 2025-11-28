import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Atom, Calculator, FlaskConical, Star, BookOpen, Users, Trophy, Train } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { UltramodernButton } from '../components/ui/UltramodernButton';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

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
        {
            id: 'learning-express',
            title: 'Learning Express',
            description: 'All aboard! Solve puzzles to keep the train moving.',
            icon: Train,
            color: 'text-red-500',
            bg: 'bg-red-100',
            path: '/learning-express',
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

    // Scroll Mask Effect & Parallax
    const maskOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const maskY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);
    const treePathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

    return (
        <div ref={containerRef} className="relative min-h-[200vh] pb-20 overflow-hidden">
            {/* Live White-Themed Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-surface-gray">
                {/* Subtle Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Floating Geometric Shapes */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute border-2 border-brand-blue/10 rounded-xl"
                        style={{
                            width: Math.random() * 40 + 20,
                            height: Math.random() * 40 + 20,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            borderRadius: Math.random() > 0.5 ? "50%" : "12px",
                        }}
                        animate={{
                            y: [0, -40, 0],
                            x: [0, Math.random() * 30 - 15, 0],
                            rotate: [0, 360],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 15,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            {/* Continuous Birch Tree Visual */}
            <div className="absolute top-0 right-0 w-64 pointer-events-none z-0 hidden md:block" style={{ height: '300vh' }}>
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 3000">
                    {/* Birch Trunk - White with Dark Patches */}
                    <defs>
                        <pattern id="birchBark" x="0" y="0" width="20" height="40" patternUnits="userSpaceOnUse">
                            <rect width="20" height="40" fill="#f3f4f6" />
                            <path d="M0 10 Q 5 12, 10 10 T 20 10" stroke="#374151" strokeWidth="1" fill="none" opacity="0.3" />
                            <path d="M5 25 Q 10 28, 15 25" stroke="#374151" strokeWidth="1" fill="none" opacity="0.3" />
                            <path d="M0 35 Q 8 38, 12 35" stroke="#374151" strokeWidth="1" fill="none" opacity="0.3" />
                        </pattern>
                    </defs>
                    
                    {/* Main Trunk */}
                    <motion.path
                        d="M 200 800 Q 160 1000, 180 1400 T 170 2000 T 190 2800"
                        stroke="url(#birchBark)"
                        strokeWidth="24"
                        fill="none"
                        style={{ pathLength: treePathLength }}
                    />
                    {/* Trunk Border for definition */}
                    <motion.path
                        d="M 200 800 Q 160 1000, 180 1400 T 170 2000 T 190 2800"
                        stroke="#d1d5db"
                        strokeWidth="26"
                        fill="none"
                        style={{ pathLength: treePathLength }}
                        strokeLinecap="round"
                        className="-z-10"
                    />
                    
                    {/* Branch connection point */}
                    <circle cx="200" cy="800" r="12" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
                </svg>
            </div>

            {/* Hero Section with Parallax & Scroll Mask */}
            <section className="relative h-[100vh] flex items-center justify-center sticky top-0">
                {/* Background Gradients */}
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-yellow/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-green/10 rounded-full blur-3xl animate-pulse delay-700" />
                </div>

                <motion.div 
                    className="relative z-10 text-center max-w-4xl px-6"
                    style={{ opacity: maskOpacity, y: maskY }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 hover:scale-105 transition-transform cursor-default">
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
                </motion.div>
            </section>

            {/* Content Sections for Scrolling */}
            <div className="relative z-20 bg-white/80 backdrop-blur-sm pt-20 pb-40 border-t-2 border-black/5">
                
                {/* Realms Grid */}
                <section className="max-w-6xl mx-auto px-6 mb-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px flex-1 bg-black/10" />
                        <h2 className="text-2xl font-display font-black flex items-center gap-3 text-brand-black bg-surface-gray px-4 rounded-xl border-2 border-black/5">
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

                {/* Features Section */}
                <section className="max-w-6xl mx-auto px-6 mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-display font-black mb-6">Learn by Doing</h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Forget boring textbooks. Dive into interactive simulations where you control the laws of physics, mix volatile chemicals, and solve math problems that actually make sense.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { icon: BookOpen, text: "Interactive 3D Labs" },
                                    { icon: Users, text: "Collaborative Challenges" },
                                    { icon: Trophy, text: "Gamified Progress Tracking" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        <item.icon className="w-6 h-6 text-brand-blue" />
                                        <span className="font-bold">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative h-96 bg-gray-100 rounded-3xl border-2 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_70%)]" />
                            {/* Placeholder for feature visual */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-gray-400 font-black text-2xl uppercase tracking-widest opacity-20">Simulation Preview</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
