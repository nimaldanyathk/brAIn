import React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { Trophy, Flame, Zap, Award } from 'lucide-react';
import { Badge3D, type BadgeType } from '../components/Badge3D';
import { UltramodernButton } from '../components/ui/UltramodernButton';
import { useNavigate } from 'react-router-dom';

// Mock Data (Replace with Supabase later)
const USER_STATS = {
    name: "Cadet",
    level: 5,
    xp: 2450,
    nextLevelXp: 3000,
    streak: 12,
    quizzesAced: 8
};

const BADGES = [
    { id: 1, type: 'medal' as BadgeType, label: 'First Steps', color: '#fbbf24', locked: false, description: 'Completed your first simulation.' },
    { id: 2, type: 'star' as BadgeType, label: 'Math Whiz', color: '#60a5fa', locked: false, description: 'Solved 10 math problems.' },
    { id: 3, type: 'shield' as BadgeType, label: 'Lab Safety', color: '#34d399', locked: false, description: 'Completed safety training.' },
    { id: 4, type: 'medal' as BadgeType, label: 'Master', color: '#f472b6', locked: true, description: 'Reach Level 10.' },
    { id: 5, type: 'star' as BadgeType, label: 'Streak', color: '#a78bfa', locked: true, description: 'Maintain a 30-day streak.' },
    { id: 6, type: 'shield' as BadgeType, label: 'Invincible', color: '#f87171', locked: true, description: 'Ace 5 quizzes in a row.' },
];

export const Profile: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-surface-gray pt-24 pb-20 px-6">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center gap-8"
                >
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-brand-blue border-4 border-black flex items-center justify-center text-5xl">
                            👨‍🚀
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-accent-yellow text-brand-black font-black px-3 py-1 rounded-full border-2 border-black">
                            Lvl {USER_STATS.level}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <h1 className="text-4xl font-display font-black text-brand-black">{USER_STATS.name}</h1>

                        {/* XP Bar */}
                        <div className="w-full max-w-md bg-gray-200 h-6 rounded-full border-2 border-black overflow-hidden relative group">
                            <div
                                className="h-full bg-accent-green transition-all duration-1000 ease-out"
                                style={{ width: `${(USER_STATS.xp / USER_STATS.nextLevelXp) * 100}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black/50 group-hover:text-black transition-colors">
                                {USER_STATS.xp} / {USER_STATS.nextLevelXp} XP
                            </span>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-4">
                        <div className="text-center p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
                            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                            <div className="text-2xl font-black text-brand-black">{USER_STATS.streak}</div>
                            <div className="text-xs font-bold text-orange-400 uppercase">Day Streak</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                            <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            <div className="text-2xl font-black text-brand-black">{USER_STATS.quizzesAced}</div>
                            <div className="text-xs font-bold text-blue-400 uppercase">Quizzes Aced</div>
                        </div>
                    </div>
                </motion.div>

                {/* Trophy Case */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <Trophy className="w-8 h-8 text-accent-yellow fill-accent-yellow" />
                        <h2 className="text-3xl font-display font-black text-brand-black">Trophy Case</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {BADGES.map((badge, index) => (
                            <motion.div
                                key={badge.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative h-64 bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden group ${badge.locked ? 'opacity-75 grayscale' : ''}`}
                            >
                                <div className="absolute top-4 left-4 z-10">
                                    <h3 className="font-black text-lg text-brand-black">{badge.label}</h3>
                                    <p className="text-xs text-gray-500 font-medium max-w-[150px]">{badge.description}</p>
                                </div>

                                {badge.locked && (
                                    <div className="absolute top-4 right-4 z-10 bg-gray-200 p-1 rounded-full">
                                        <Award className="w-4 h-4 text-gray-500" />
                                    </div>
                                )}

                                <div className="absolute inset-0 top-8">
                                    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                                        <ambientLight intensity={0.7} />
                                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                                        <pointLight position={[-10, -10, -10]} />
                                        <Badge3D
                                            type={badge.type}
                                            color={badge.color}
                                            isLocked={badge.locked}
                                        />
                                        <Environment preset="city" />
                                        <ContactShadows position={[0, -1.4, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
                                    </Canvas>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-center">
                    <UltramodernButton onClick={() => navigate('/')}>
                        Back to Lab
                    </UltramodernButton>
                </div>

            </div>
        </div>
    );
};
