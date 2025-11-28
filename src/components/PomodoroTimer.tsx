import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, Settings, Minimize2, Maximize2, Check, Headphones } from 'lucide-react';
import { Button } from './ui/Button';

export const PomodoroTimer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'work' | 'break' | 'custom'>('work');
    const [showSettings, setShowSettings] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isCompact, setIsCompact] = useState(false);
    const [customMinutes, setCustomMinutes] = useState(25);
    const [whiteNoiseEnabled, setWhiteNoiseEnabled] = useState(false);

    // Audio refs
    const whiteNoiseRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio
    useEffect(() => {
        whiteNoiseRef.current = new Audio('https://actions.google.com/sounds/v1/ambiences/heavy_rain.ogg');
        whiteNoiseRef.current.loop = true;
        whiteNoiseRef.current.volume = 0.3;

        return () => {
            if (whiteNoiseRef.current) {
                whiteNoiseRef.current.pause();
                whiteNoiseRef.current = null;
            }
        };
    }, []);

    // Handle White Noise Playback
    useEffect(() => {
        if (whiteNoiseRef.current) {
            if (isActive && whiteNoiseEnabled) {
                whiteNoiseRef.current.play().catch(() => { });
            } else {
                whiteNoiseRef.current.pause();
            }
        }
    }, [isActive, whiteNoiseEnabled]);

    // Audio for clicks and alarm
    const playClick = () => {
        const audio = new Audio('https://actions.google.com/sounds/v1/ui/click_on_on.ogg'); // Simple click sound
        audio.volume = 0.5;
        audio.play().catch(() => { });
    };

    const playAlarm = () => {
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play().catch(() => { });
    };

    useEffect(() => {
        let interval: any = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            playAlarm();
            alert(mode === 'work' ? "Time for a break!" : "Timer Complete!");
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, mode]);

    const toggleTimer = () => {
        playClick();
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        playClick();
        setIsActive(false);
        if (mode === 'work') setTimeLeft(25 * 60);
        else if (mode === 'break') setTimeLeft(5 * 60);
        else setTimeLeft(customMinutes * 60);
    };

    const setDuration = (minutes: number, newMode: 'work' | 'break' | 'custom') => {
        playClick();
        setMode(newMode);
        setTimeLeft(minutes * 60);
        setIsActive(false);
    };

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setDuration(customMinutes, 'custom');
        setShowSettings(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-40px)]'}`}>
            <div className="flex items-start">
                {/* Toggle Tab */}
                <button
                    onClick={() => { playClick(); setIsOpen(!isOpen); }}
                    className="bg-black text-white w-10 h-32 rounded-l-xl flex items-center justify-center border-y-2 border-l-2 border-black shadow-[-4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:bg-gray-800 transition-colors"
                >
                    <div className="-rotate-90 font-black text-xs uppercase tracking-widest whitespace-nowrap flex items-center gap-2">
                        <Bell className="w-4 h-4" /> Pomodoro
                    </div>
                </button>

                {/* Main Widget */}
                <div className={`bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-bl-xl p-4 flex flex-col gap-4 transition-all duration-300 ${isCompact ? 'w-48' : 'w-72'}`}>

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <span className="font-black text-sm uppercase tracking-wider text-brand-black flex items-center gap-2">
                            Timer
                            {mode === 'custom' && <span className="text-[10px] bg-gray-100 px-1 rounded text-gray-500">Custom</span>}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => { playClick(); setWhiteNoiseEnabled(!whiteNoiseEnabled); }}
                                className={`p-1 rounded transition-colors ${whiteNoiseEnabled ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:text-black hover:bg-gray-100'}`}
                                title={whiteNoiseEnabled ? "Disable White Noise" : "Enable White Noise"}
                            >
                                <Headphones className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => { playClick(); setIsCompact(!isCompact); }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-500 hover:text-black"
                                title={isCompact ? "Expand" : "Compact"}
                            >
                                {isCompact ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                            </button>
                            <button
                                onClick={() => { playClick(); setShowSettings(!showSettings); }}
                                className={`p-1 hover:bg-gray-100 rounded transition-colors ${showSettings ? 'text-black bg-gray-100' : 'text-gray-500 hover:text-black'}`}
                                title="Settings"
                            >
                                <Settings className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    {/* Timer Display */}
                    <div className={`text-center py-2 bg-gray-50 rounded-xl border-2 border-gray-100 transition-all ${isCompact ? 'scale-90' : ''}`}>
                        <div className={`font-mono font-black tracking-tighter ${isActive ? 'text-brand-blue' : 'text-brand-black'} ${isCompact ? 'text-4xl' : 'text-6xl'}`}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-2">
                        <Button
                            size={isCompact ? "sm" : "lg"}
                            onClick={toggleTimer}
                            className={`flex-1 rounded-xl flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all ${isActive ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-green-400 hover:bg-green-500'}`}
                        >
                            {isActive ? <Pause className="w-5 h-5 text-black" /> : <Play className="w-5 h-5 text-black ml-1" />}
                        </Button>

                        <Button
                            size={isCompact ? "sm" : "lg"}
                            onClick={resetTimer}
                            className="w-12 rounded-xl flex items-center justify-center bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-y-0.5 active:shadow-none transition-all"
                        >
                            <RotateCcw className="w-5 h-5 text-black" />
                        </Button>
                    </div>

                    {/* Settings Drawer */}
                    {showSettings && (
                        <div className="pt-4 border-t-2 border-gray-100 flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in duration-200">
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => { setDuration(25, 'work'); setShowSettings(false); }}
                                    className={`py-2 text-xs font-bold border-2 rounded-lg transition-all ${mode === 'work' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'}`}
                                >
                                    25m Work
                                </button>
                                <button
                                    onClick={() => { setDuration(5, 'break'); setShowSettings(false); }}
                                    className={`py-2 text-xs font-bold border-2 rounded-lg transition-all ${mode === 'break' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'}`}
                                >
                                    5m Break
                                </button>
                            </div>

                            {/* Custom Timer Input */}
                            <form onSubmit={handleCustomSubmit} className="flex gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="120"
                                    value={customMinutes}
                                    onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 0)}
                                    className="w-full px-2 py-1 text-xs font-bold border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black"
                                    placeholder="Min"
                                />
                                <button
                                    type="submit"
                                    className="px-3 bg-brand-black text-white rounded-lg border-2 border-black hover:bg-gray-800 transition-colors"
                                >
                                    <Check className="w-3 h-3" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
