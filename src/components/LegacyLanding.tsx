import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Globe, MessageSquare, Sparkles } from 'lucide-react';
import { UltramodernButton } from './ui/UltramodernButton';

export const LegacyLanding: React.FC = () => {
    return (
        <div className="bg-white border-t-4 border-black mt-20">
            {/* Features Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-5xl font-black text-brand-black uppercase tracking-tight">
                        Why <span className="text-brand-blue">brAIn?</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                        The world's first AI-powered learning dimension that adapts to your unique neural patterns.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Brain,
                            title: "Neural Mapping",
                            desc: "Our AI visualizes your knowledge gaps in real-time.",
                            color: "bg-purple-100 text-purple-600"
                        },
                        {
                            icon: Zap,
                            title: "Hyper-Personalized",
                            desc: "Curriculum that evolves with every quiz you take.",
                            color: "bg-yellow-100 text-yellow-600"
                        },
                        {
                            icon: Globe,
                            title: "Global Context",
                            desc: "Connect concepts across Physics, Math, and Chemistry.",
                            color: "bg-blue-100 text-blue-600"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white hover:bg-gray-50 transition-colors"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 border-2 border-black`}>
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
                            <p className="text-gray-600 font-medium leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="py-20 bg-brand-black text-white px-6 border-y-4 border-black">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <Sparkles className="w-12 h-12 text-yellow-400 mx-auto animate-pulse" />
                    <h2 className="text-4xl md:text-6xl font-black leading-tight">
                        "I finally understand Physics. It feels like a game, not a chore."
                    </h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 bg-gray-700 rounded-full border-2 border-white" />
                        <div className="text-left">
                            <div className="font-bold text-lg">Alex R.</div>
                            <div className="text-gray-400 text-sm">Student @ NIT</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 text-center bg-brand-blue relative overflow-hidden">
                <div className="relative z-10 space-y-8">
                    <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter">
                        READY TO <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                            EVOLVE?
                        </span>
                    </h2>
                    <div className="flex justify-center gap-4">
                        <UltramodernButton className="bg-white text-black hover:bg-gray-100 border-2 border-black">
                            Start Free Trial
                        </UltramodernButton>
                    </div>
                </div>
            </section>
        </div>
    );
};
