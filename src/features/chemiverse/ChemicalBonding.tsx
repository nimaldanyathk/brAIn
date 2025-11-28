import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shapes, Atom, FlaskConical, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';

import { VSEPR } from './components/bonding/VSEPR';
import { Hybridization } from './components/bonding/Hybridization';
import { MoleculeViewer } from './MoleculeViewer';
import { AITutor } from './components/bonding/AITutor';

export const ChemicalBonding = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'vsepr' | 'hybridization' | 'molecules' | 'ai'>('vsepr');

    return (
        <div className="h-full flex flex-col bg-white text-gray-900 font-sans overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/chemistry')} className="px-2 text-gray-700 hover:bg-gray-100">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">CHEMICAL BONDING</h1>
                        <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">
                            Advanced Interactive Module
                        </p>
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('vsepr')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'vsepr' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Shapes className="w-4 h-4" /> VSEPR
                    </button>
                    <button
                        onClick={() => setActiveTab('hybridization')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'hybridization' 
                            ? 'bg-white text-purple-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Atom className="w-4 h-4" /> Hybridization
                    </button>
                    <button
                        onClick={() => setActiveTab('molecules')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'molecules' 
                            ? 'bg-white text-green-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <FlaskConical className="w-4 h-4" /> Molecules
                    </button>
                    <button
                        onClick={() => setActiveTab('ai')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'ai' 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Sparkles className="w-4 h-4" /> AI Tutor
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 min-h-0 overflow-hidden">
                {activeTab === 'vsepr' && <VSEPR />}
                {activeTab === 'hybridization' && <Hybridization />}
                {activeTab === 'molecules' && <MoleculeViewer />}
                {activeTab === 'ai' && <AITutor />}
            </div>
        </div>
    );
};
