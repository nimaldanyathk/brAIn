import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Brain, Atom, Calculator, FlaskConical, LogOut, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { AITutorOwl } from '../components/AITutorOwl';

export const Layout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check for Demo Session
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
                {/* Logo */}
                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="w-10 h-10 bg-brand-black rounded-lg flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-display font-black tracking-tight group-hover:text-brand-blue transition-colors">brAIn</span>
                </div>

                {/* Navigation Links */}
                                {/* Navigation Links */}
                
                {/* Navigation Links */}
                
                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-1">
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

                {/* User Profile */}
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

            {/* Main Content Area */}
            <main className={`flex-1 relative p-6 scroll-smooth ${isHome ? '' : 'overflow-y-auto'}`}>
                <div className="h-full w-full max-w-7xl mx-auto flex flex-col">
                    <Outlet />
                </div>
            </main>

            
            {/* Footer */}
            <footer className="bg-white border-t-2 border-black py-8 px-6 shrink-0 z-40">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-black rounded-lg flex items-center justify-center border-2 border-black">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-black text-xl">brAIn</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6">
                        {['About Us', 'How It Works', 'Teacher Mode', 'Community', 'Support'].map((item) => (
                            <button
                                key={item}
                                className="text-sm font-bold text-gray-500 hover:text-brand-black transition-colors"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                    <div className="text-xs font-medium text-gray-400">
                        © 2025 brAIn Education. All rights reserved.
                    </div>
                </div>
            </footer>
            
            {/* Global AI Assistant */}
            <AITutorOwl context={getContext(location.pathname)} />
        </div>
    );
};

function getContext(path: string): 'physics' | 'math' | 'chemistry' | 'general' {
    if (path.includes('physix')) return 'physics';
    if (path.includes('math')) return 'math';
    if (path.includes('chemistry') || path.includes('chemiverse')) return 'chemistry';
    return 'general';
}







