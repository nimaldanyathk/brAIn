import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Atom, FlaskConical, Calculator, Home, User, Menu } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: FlaskConical, label: 'Chemiverse', path: '/chemiverse', color: 'text-green-600' },
        { icon: Atom, label: 'PhysiX', path: '/physix', color: 'text-blue-600' },
        { icon: Calculator, label: 'Math Odyssey', path: '/math', color: 'text-yellow-600' },
    ];

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden bg-white">
            {/* Top Navigation Bar - Tactile */}
            <header className="h-20 bg-white border-b-2 border-black flex items-center justify-between px-8 z-30">
                <div className="flex items-center gap-12">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                            B
                        </div>
                        <span className="text-2xl font-display font-black text-black tracking-tight hidden md:block">
                            brAIn
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-bold border-2",
                                    location.pathname === item.path
                                        ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
                                        : "bg-white text-gray-500 border-transparent hover:border-gray-200 hover:text-black"
                                )}
                            >
                                <item.icon className={cn("w-4 h-4", location.pathname === item.path ? "text-white" : "text-gray-400")} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4 pl-6 border-l-2 border-gray-100">
                        <div className="text-right">
                            <p className="text-sm font-black leading-none">Cadet Alex</p>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Lvl 5 Explorer</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-black flex items-center justify-center">
                            <User className="w-5 h-5 text-black" />
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="md:hidden">
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden bg-gray-50">
                <div className="h-full overflow-y-auto p-6 md:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
};
