import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, AlertCircle, TestTube, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const handleOAuthLogin = async (provider: 'google' | 'apple') => {
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

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSupabaseConfigured) {
            setError("Supabase is not configured. Please use Demo Mode.");
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage("Check your email for the confirmation link!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
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

                    <Card className="p-8 space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-brand-black">
                                {isSignUp ? "Create Account" : "Welcome Back"}
                            </h2>
                            <p className="text-gray-500 font-bold">
                                {isSignUp ? "Join the lab today" : "Sign in to access your lab"}
                            </p>
                        </div>

                        {!isSupabaseConfigured && (
                            <div className="bg-yellow-50 border-2 border-yellow-100 p-4 rounded-xl flex items-start gap-3 text-yellow-800 font-bold text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <div>
                                    <p>Supabase keys are missing.</p>
                                    <p className="font-normal mt-1">Auth is disabled. Use <strong>Demo Mode</strong> to test the app.</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border-2 border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 font-bold text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="bg-green-50 border-2 border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-600 font-bold text-sm">
                                <TestTube className="w-5 h-5 shrink-0" />
                                {message}
                            </div>
                        )}

                        {/* Email/Password Form */}
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-500 ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-bold transition-colors"
                                        placeholder="cadet@brain.app"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-500 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-bold transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full justify-center py-6 text-lg"
                                disabled={loading || !isSupabaseConfigured}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        {isSignUp ? "Sign Up" : "Sign In"} <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
                                className="text-sm font-bold text-gray-500 hover:text-black hover:underline transition-colors"
                            >
                                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t-2 border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-400 font-black tracking-wider">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleOAuthLogin('google')}
                                disabled={loading || !isSupabaseConfigured}
                                className="flex items-center justify-center gap-2 bg-white text-brand-black font-bold py-3 px-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                                Google
                            </button>

                            <button
                                onClick={() => handleOAuthLogin('apple')}
                                disabled={loading || !isSupabaseConfigured}
                                className="flex items-center justify-center gap-2 bg-black text-white font-bold py-3 px-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
                            >
                                <img src="https://www.svgrepo.com/show/445136/apple.svg" alt="Apple" className="w-5 h-5 invert" />
                                Apple
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
                            variant="secondary"
                            className="w-full justify-center bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
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
