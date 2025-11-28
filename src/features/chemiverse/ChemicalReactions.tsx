import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FlaskConical, Activity, Zap, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { CollisionLab } from './components/reactions/CollisionLab';
import { EnergyProfile } from './components/reactions/EnergyProfile';
import { RedoxArena } from './components/reactions/RedoxArena';

export const ChemicalReactions = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'collision' | 'energy' | 'redox' | 'ai'>('collision');

    return (
        <div className='h-full flex flex-col bg-white text-gray-900 font-sans overflow-hidden'>
            {/* Header */}
            <div className='absolute top-6 left-6 z-20 flex items-center gap-4'>
                <Button variant='ghost' onClick={() => navigate('/chemistry')} className='px-2 text-gray-700 hover:bg-gray-100'>
                    <ArrowLeft className='w-8 h-8' />
                </Button>
                <div>
                    <h1 className='text-4xl font-black text-gray-900'>CHEMICAL REACTIONS</h1>
                    <div className='flex items-center gap-4 mt-1'>
                        <p className='text-gray-500 font-bold text-sm uppercase tracking-widest'>
                            Interactive Lab
                        </p>
                        {/* Tab Switcher */}
                        <div className='flex bg-gray-100 rounded-lg p-1 gap-1'>
                            <button 
                                onClick={() => setActiveTab('collision')}
                                className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all
                                    ${activeTab === 'collision' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}
                                `}
                            >
                                <div className='flex items-center gap-1'>
                                    <FlaskConical className='w-3 h-3' /> Collision
                                </div>
                            </button>
                            <button 
                                onClick={() => setActiveTab('energy')}
                                className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all
                                    ${activeTab === 'energy' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}
                                `}
                            >
                                <div className='flex items-center gap-1'>
                                    <Activity className='w-3 h-3' /> Energy
                                </div>
                            </button>
                            <button 
                                onClick={() => setActiveTab('redox')}
                                className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all
                                    ${activeTab === 'redox' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}
                                `}
                            >
                                <div className='flex items-center gap-1'>
                                    <Zap className='w-3 h-3' /> Redox
                                </div>
                            </button>
                            <button 
                                onClick={() => setActiveTab('ai')}
                                className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all
                                    ${activeTab === 'ai' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}
                                `}
                            >
                                <div className='flex items-center gap-1'>
                                    <Sparkles className='w-3 h-3' /> AI Tutor
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className='flex-1 relative h-full pt-24'>
                {activeTab === 'collision' && <CollisionLab />}
                {activeTab === 'energy' && <EnergyProfile />}
                {activeTab === 'redox' && <RedoxArena />}
                {activeTab === 'ai' && (
                    <div className='flex items-center justify-center h-full text-gray-400 font-bold uppercase tracking-widest'>
                        AI Tutor Coming Soon
                    </div>
                )}
            </div>
        </div>
    );
};
