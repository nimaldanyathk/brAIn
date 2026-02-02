import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Brain, Atom, Calculator, FlaskConical, LogOut, User, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { AITutorOwl } from '../components/AITutorOwl';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { QuizInterface } from '../components/QuizInterface';
import { MissionTracker } from '../components/MissionTracker';

export const Layout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<any>(null);
    const [showGlobalQuiz, setShowGlobalQuiz] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
    const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

    const FALLBACK_QUESTIONS = [
        {
            id: 1,
            text: "What is the primary force governing planetary orbits?",
            options: ["Magnetism", "Gravitation", "Strong Nuclear Force", "Friction"],
            correctAnswer: 1,
            explanation: "Gravity is the universal force of attraction acting between all matter."
        },
        {
            id: 2,
            text: "Newton's Second Law is represented by which formula?",
            options: ["E=mc²", "F=ma", "a² + b² = c²", "V=IR"],
            correctAnswer: 1,
            explanation: "Force equals mass times acceleration (F=ma)."
        },
        {
            id: 3,
            text: "Which particle carries a negative charge?",
            options: ["Proton", "Neutron", "Electron", "Photon"],
            correctAnswer: 2,
            explanation: "Electrons are negatively charged subatomic particles."
        }
    ];

    // Global Quiz Trigger
    useEffect(() => {
        const handleSessionComplete = async () => {
            setShowGlobalQuiz(true);
            setIsLoadingQuiz(true);

            const topic = localStorage.getItem('brain_active_topic') || 'general';
            const studentId = localStorage.getItem('student_id') || 'demo_student_123';

            try {
                // Determine API URL (handle dev vs prod if needed, assuming localhost for now)
                const res = await fetch(`http://localhost:8000/api/generate-quiz?topic=${topic}&student_id=${studentId}`);
                const data = await res.json();

                if (Array.isArray(data) && data.length > 0) {
                    setQuizQuestions(data);
                } else {
                    setQuizQuestions(FALLBACK_QUESTIONS);
                }
            } catch (e) {
                console.error("Quiz fetch failed", e);
                setQuizQuestions(FALLBACK_QUESTIONS);
            } finally {
                setIsLoadingQuiz(false);
            }
        };

        window.addEventListener('BRAIN_SESSION_COMPLETE', handleSessionComplete);
        return () => window.removeEventListener('BRAIN_SESSION_COMPLETE', handleSessionComplete);
    }, []);

    // Auth & Demo Session Check
    useEffect(() => {
        const demoSession = localStorage.getItem('demo_session');
        if (demoSession) {
            setUser({
                user_metadata: {
                    full_name: 'Demo Cadet',
                    avatar_url: null
                },
                email: 'demo@brain.app'
            });
            return;
        }

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        localStorage.removeItem('demo_session');
        await supabase.auth.signOut();
        navigate('/login');
    };

    const isHome = location.pathname === '/';

    return (
        <div className={`flex flex-col bg-surface-gray font-sans text-brand-black selection:bg-brand-blue selection:text-white ${isHome ? 'min-h-screen' : 'h-screen overflow-hidden'}`}>
            {/* Top Navigation Bar */}
            <header className="h-16 bg-white border-b-2 border-black flex items-center justify-between px-6 shrink-0 z-50">
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="w-10 h-10 bg-brand-black rounded-lg flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-display font-black tracking-tight group-hover:text-brand-blue transition-colors">brAIn</span>
                </div>

                <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                    <NavLink
                        to="/physix"
                        className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg font-bold border-2 transition-all text-sm ${isActive ? 'bg-blue-100 border-black text-brand-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent text-gray-500 hover:text-brand-black hover:bg-gray-100'}`}
                    >
                        <Atom className="w-4 h-4" /> PhysiX
                    </NavLink>
                    <NavLink
                        to="/math"
                        className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg font-bold border-2 transition-all text-sm ${isActive ? 'bg-yellow-100 border-black text-brand-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent text-gray-500 hover:text-brand-black hover:bg-gray-100'}`}
                    >
                        <Calculator className="w-4 h-4" /> Math
                    </NavLink>
                    <NavLink
                        to="/chemistry"
                        className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg font-bold border-2 transition-all text-sm ${isActive ? 'bg-green-100 border-black text-brand-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent text-gray-500 hover:text-brand-black hover:bg-gray-100'}`}
                    >
                        <FlaskConical className="w-4 h-4" /> Chemistry
                    </NavLink>
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {user.user_metadata.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-lg border-2 border-black" />
                            ) : (
                                <div className="w-8 h-8 bg-brand-blue rounded-lg border-2 border-black flex items-center justify-center text-white">
                                    <User className="w-4 h-4" />
                                </div>
                            )}
                            <span className="text-sm font-bold hidden sm:block">{user.user_metadata.full_name || user.email?.split('@')[0]}</span>
                            <button
                                onClick={handleSignOut}
                                className="ml-2 p-1 hover:bg-red-100 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <Button size="sm" onClick={() => navigate('/login')}>
                            Sign In
                        </Button>
                    )}
                </div>
            </header>

            <main className={`flex-1 relative p-6 scroll-smooth ${isHome ? '' : 'overflow-y-auto'}`}>
                <div className="h-full w-full max-w-7xl mx-auto flex flex-col">
                    <Outlet context={{ user }} />
                </div>
            </main>

            {/* Global AI Assistant */}
            <AITutorOwl context={getContext(location.pathname)} />

            {/* Global Pomodoro Timer */}
            <PomodoroTimer />

            {/* Tactical Mission Tracker */}
            <MissionTracker />

            {/* Global Quiz Overlay */}
            {showGlobalQuiz && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl relative">
                        <button
                            onClick={() => setShowGlobalQuiz(false)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="bg-brand-blue p-6 text-white flex flex-col items-center justify-center text-center">
                            <Brain className="w-12 h-12 mb-3 animate-bounce" />
                            <h2 className="text-2xl font-black uppercase tracking-wider">Session Complete!</h2>
                            <p className="text-blue-100">
                                {isLoadingQuiz ? "Generating tactical verification..." : "Let's verify what you just learned."}
                            </p>
                        </div>

                        <div className="p-2 h-[500px] overflow-y-auto relative">
                            {isLoadingQuiz ? (
                                <div className="flex flex-col items-center justify-center h-full space-y-4">
                                    <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
                                    <p className="font-bold text-gray-400">Consulting Neural Core...</p>
                                </div>
                            ) : (
                                <QuizInterface
                                    questions={quizQuestions}
                                    onClose={() => setShowGlobalQuiz(false)}
                                    onComplete={() => {
                                        alert("Verification Complete. Data synced to Neural Core.");
                                        setShowGlobalQuiz(false);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function getContext(path: string): 'physics' | 'math' | 'chemistry' | 'general' {
    if (path.includes('physix')) return 'physics';
    if (path.includes('math')) return 'math';
    if (path.includes('chemistry') || path.includes('chemiverse')) return 'chemistry';
    return 'general';
}
