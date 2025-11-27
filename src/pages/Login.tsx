import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, AlertCircle, TestTube } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (provider: 'google' | 'apple') => {
        if (!isSupabaseConfigured) {
            setError("Supabase is not configured. Please use Demo Mode.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/`,
                },
            });

            if (error) throw error;
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
            setLoading(false);
        }
    };

    const handleDemoLogin = () => {
        setLoading(true);
        // Simulate a delay for realism
        setTimeout(() => {
            localStorage.setItem('demo_session', 'true');
            navigate('/');
        }, 800);
    };

    return (
        <div className="min-h-screen bg-surface-gray flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6"
                >
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-brand-black rounded-xl flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <Brain className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-display font-black text-brand-black tracking-tight">brAIn</h1>
                    </div>

                    <Card className="p-8 space-y-8">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-brand-black">Welcome Back</h2>
                            <p className="text-gray-500 font-bold">Sign in to access your lab</p>
                        </div>

                        {!isSupabaseConfigured && (
                            <div className="bg-yellow-50 border-2 border-yellow-100 p-4 rounded-xl flex items-start gap-3 text-yellow-800 font-bold text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <div>
                                    <p>Supabase keys are missing.</p>
                                    <p className="font-normal mt-1">OAuth is disabled. Use <strong>Demo Mode</strong> to test the app.</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border-2 border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 font-bold text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <button
                                onClick={() => handleLogin('google')}
                                disabled={loading || !isSupabaseConfigured}
                                className="w-full flex items-center justify-center gap-3 bg-white text-brand-black font-black py-4 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
                                Sign in with Google
                            </button>

                            <button
                                onClick={() => handleLogin('apple')}
                                disabled={loading || !isSupabaseConfigured}
                                className="w-full flex items-center justify-center gap-3 bg-black text-white font-black py-4 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
                            >
                                <img src="https://www.svgrepo.com/show/445136/apple.svg" alt="Apple" className="w-6 h-6 invert" />
                                Sign in with Apple
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t-2 border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-400 font-black tracking-wider">Or for testing</span>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            className="w-full justify-center bg-blue-600 text-white hover:bg-blue-700"
                            onClick={handleDemoLogin}
                            disabled={loading}
                        >
                            <TestTube className="w-4 h-4 mr-2" />
                            Simulate Demo User
                        </Button>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};
