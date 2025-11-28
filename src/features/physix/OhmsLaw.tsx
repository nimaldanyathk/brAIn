import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Info, Sliders, Box } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Slider } from '../../components/ui/Slider';

import { CircuitBuilder } from './CircuitBuilder';
import { Experiment3D } from './Experiment3D';

export const OhmsLaw: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<'guided' | 'sandbox'>('guided');

    // Guided Mode State
    const [voltage, setVoltage] = useState(10);
    const [resistance, setResistance] = useState(100);
    const [current, setCurrent] = useState(0.1);

    // Sandbox Mode State
    const [sbVoltage, setSbVoltage] = useState(0);
    const [sbResistance, setSbResistance] = useState(0);
    const [sbCurrent, setSbCurrent] = useState(0);

    // Astra State
    const [astraMessage, setAstraMessage] = useState("Welcome to the lab! Choose a mode to start.");

    // Guided Mode Logic
    useEffect(() => {
        if (mode === 'guided') {
            const i = voltage / resistance;
            setCurrent(parseFloat(i.toFixed(3)));
            updateAstra(i);
        }
    }, [voltage, resistance, mode]);

    // Sandbox Mode Logic
    const handleCircuitUpdate = (v: number, r: number) => {
        setSbVoltage(v);
        setSbResistance(r);
        if (v > 0 && r > 0) {
            const i = v / r;
            setSbCurrent(parseFloat(i.toFixed(3)));
            updateAstra(i);
        } else {
            setSbCurrent(0);
            setAstraMessage("Drag components to build a circuit!");
        }
    };

    const updateAstra = (i: number) => {
        if (i > 0.15) {
            setAstraMessage("High current! Watch out for overheating!");
        } else if (i > 0.05) {
            setAstraMessage("Excellent flow! The circuit is working perfectly.");
        } else {
            setAstraMessage("Adjust the parameters to see how Current changes.");
        }
    };

    const activeCurrent = mode === 'guided' ? current : sbCurrent;
    const activeVoltage = mode === 'guided' ? voltage : sbVoltage;
    const activeResistance = mode === 'guided' ? resistance : sbResistance;

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/physix')} className="px-2">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-display font-black text-brand-black">Ohm's Law</h1>
                        <p className="text-sm text-gray-500 font-bold">Voltage = Current Ã— Resistance</p>
                    </div>
                </div>

                {/* Mode Switcher */}
                <div className="flex bg-white p-1 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <button
                        onClick={() => setMode('guided')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'guided' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
                    >
                        <Sliders className="w-4 h-4" /> Guided
                    </button>
                    <button
                        onClick={() => setMode('sandbox')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'sandbox' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
                    >
                        <Box className="w-4 h-4" /> Sandbox
                    </button>
                </div>

                {/* Stats Panel */}
                <div className="hidden md:flex items-center gap-6 px-6 py-2 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div>
                        <span className="text-xs text-gray-500 font-black uppercase">Voltage</span>
                        <p className="text-xl font-mono font-black text-brand-blue">{activeVoltage}V</p>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 font-black uppercase">Resistance</span>
                        <p className="text-xl font-mono font-black text-purple-600">{activeResistance}Î©</p>
                    </div>
                    <div className="w-0.5 h-8 bg-gray-200" />
                    <div>
                        <span className="text-xs text-gray-500 font-black uppercase">Current</span>
                        <p className="text-xl font-mono font-black text-green-600">{(activeCurrent * 1000).toFixed(1)}mA</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                {/* Left Panel: Astra & Info */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card className="bg-blue-50 border-blue-200">
                        <div className="flex flex-col items-center text-center gap-4">
                            
                            <p className="text-sm leading-relaxed text-brand-black font-bold">{astraMessage}</p>
                        </div>
                    </Card>

                    <Card className="flex-1">
                        <h2 className="text-lg font-black text-brand-black flex items-center gap-2 mb-4">
                            <Info className="w-5 h-5 text-brand-blue" />
                            {mode === 'guided' ? 'Mission Brief' : 'Builder Guide'}
                        </h2>
                        {mode === 'guided' ? (
                            <div className="space-y-6">
                                <p className="text-sm text-gray-600 font-medium">Adjust the sliders to see how Voltage and Resistance affect the flow of electrons in 3D.</p>
                                <Slider label="Voltage (V)" value={voltage} min={1} max={20} unit="V" color="blue" onChange={setVoltage} />
                                <Slider label="Resistance (Î©)" value={resistance} min={10} max={500} step={10} unit="Î©" color="purple" onChange={setResistance} />
                            </div>
                        ) : (
                            <ul className="space-y-3 text-sm text-gray-600 font-medium list-disc list-inside">
                                <li>Drag components from the toolbar.</li>
                                <li>Connect ports to create a loop.</li>
                                <li>Build your own custom circuit!</li>
                            </ul>
                        )}
                    </Card>
                </div>

                {/* Right Panel: Workspace */}
                <div className="lg:col-span-3 h-[500px] lg:h-auto relative">
                    <AnimatePresence mode="wait">
                        {mode === 'guided' ? (
                            <motion.div
                                key="guided"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full"
                            >
                                <Experiment3D voltage={voltage} resistance={resistance} current={current} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="sandbox"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full"
                            >
                                <CircuitBuilder onCircuitUpdate={handleCircuitUpdate} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

