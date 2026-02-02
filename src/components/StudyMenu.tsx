import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Rocket, Brain, ArrowRight, Target, Zap, Activity,
    Atom, Magnet, Globe, Microscope, FlaskConical, Calculator,
    Cpu, Database, Layers, Box, Anchor, Flag
} from 'lucide-react';
import { TOPIC_TO_ROUTE, startMission } from '../lib/missionControl';
import { UltramodernButton } from './ui/UltramodernButton';
import { KnowledgeGraphViz } from './KnowledgeGraphViz';
import { NoteTaker } from './NoteTaker';
import { LegacyLanding } from './LegacyLanding';

const API_URL = "http://localhost:8000/api";

interface Recommendation {
    next_topic_id: string;
    reason: string;
    difficulty_level: string;
    suggested_content_type: string;
}

// Extensive Icon Map for Dynamic AI Suggestions
const IconMap: { [key: string]: any } = {
    "Target": Target,
    "Rocket": Rocket,
    "Zap": Zap,
    "Activity": Activity,
    "Brain": Brain,
    "Atom": Atom,
    "Magnet": Magnet,
    "Globe": Globe,
    "Microscope": Microscope,
    "FlaskConical": FlaskConical,
    "Calculator": Calculator,
    "Cpu": Cpu,
    "Database": Database,
    "Layers": Layers,
    "Box": Box,
    "Anchor": Anchor,
    "Flag": Flag
};

export const StudyMenu: React.FC<{ onStartTopic: (topic: string) => void }> = ({ onStartTopic }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [rec, setRec] = useState<Recommendation | null>(null);
    const [loading, setLoading] = useState(true);
    const [studyPlan, setStudyPlan] = useState<any[]>([]);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [dueItems, setDueItems] = useState<any[]>([]);
    const [showDurationPicker, setShowDurationPicker] = useState(false);

    // Start Session Logic: Triggers the global Pomodoro Timer
    const handleStartMission = (duration: number) => {
        setShowDurationPicker(false);

        // 1. Determine Active Topic & Persist Mission
        let activeTopic = "general";

        if (studyPlan.length > 0) {
            // Activate Mission Tracker
            startMission(studyPlan);
            activeTopic = studyPlan[0].id; // Default to first step
        } else if (rec?.next_topic_id) {
            activeTopic = rec.next_topic_id;
        }

        // 2. Persist Context for Global Quiz
        localStorage.setItem('brain_active_topic', activeTopic);

        // 3. Start Pomodoro
        // We use a custom event that PomodoroTimer.tsx listens to.
        window.dispatchEvent(new CustomEvent('BRAIN_START_SESSION', {
            detail: { duration: duration }
        }));

        // 4. Navigate to Topic
        if (activeTopic && activeTopic !== "general") {
            const route = TOPIC_TO_ROUTE[activeTopic];
            if (route) {
                navigate(route);
            } else {
                // Fallback for unknown routes
                navigate(`/learning-express?topic=${activeTopic}`);
            }
        }
    };

    // Mission logic moved to centralized controller

    const handleTopicClick = (topicId: string) => {
        const route = TOPIC_TO_ROUTE[topicId];
        if (route) {
            // If clicking a single topic, perform a "mini mission"
            // We don't have a plan object here, but we can generate a temporary one
            // Or just navigate. The user asked for mission tracking from the Engagement Map.
            // Let's assume this is just for simple navigation for now unless it comes from the map.
            navigate(route);
        } else {
            console.warn(`No route found for topic: ${topicId}. Redirecting to generic view.`);
            navigate(`/learning-express?topic=${topicId}`);
        }
    };

    // ... inside the component where Search is handled ...
    // When "Init" is clicked and plan is generated:

    const engageMission = () => {
        if (studyPlan.length > 0) {
            startMission(studyPlan); // Save to local storage

            // Navigate to first step
            const firstStep = studyPlan[0];
            const route = TOPIC_TO_ROUTE[firstStep.id];
            if (route) {
                navigate(route);
            } else {
                alert(`Mission path for ${firstStep.title} is currently charted to an unknown sector.`);
            }
        }
    };

    // Manual Search Trigger
    const executeSearch = async () => {
        if (searchQuery.length < 2) return;

        setLoading(true);
        setIsGeneratingPlan(true);
        setSearchResults([]); // Clear previous

        const studentId = localStorage.getItem('student_id') || 'demo_student_123';

        try {
            // 1. Search Topics
            const res = await fetch(`${API_URL}/search?q=${searchQuery}&student_id=${studentId}`);
            const data = await res.json();
            setSearchResults(data);

            // 2. Generate Plan (Always try to generate plan on manual submit)
            const planRes = await fetch(`${API_URL}/generate-plan?goal=${searchQuery}`);
            const planData = await planRes.json();
            setStudyPlan(planData);

            if (planData.length > 0) {
                setRec({
                    next_topic_id: planData[0].id,
                    reason: `COMMAND OVERRIDE: Objective "${searchQuery}" accepted. Engaging tactical learning path.`,
                    difficulty_level: "Adaptive",
                    suggested_content_type: "Module"
                });
            }
        } catch (e) {
            console.error("Search/Plan failed", e);
        } finally {
            setIsGeneratingPlan(false);
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            executeSearch();
        }
    };

    // Effect: Fetch Due Items (Only on mount, no auto-search)
    useEffect(() => {
        const fetchDueItems = async () => {
            const studentId = localStorage.getItem('student_id') || 'demo_student_123';
            try {
                const res = await fetch(`${API_URL}/search?q=&student_id=${studentId}`);
                const data = await res.json();
                const due = data.filter((item: any) => item.is_due).slice(0, 3);
                setDueItems(due);
                setLoading(false);
            } catch (e) {
                console.error("Failed to fetch due items", e);
                setLoading(false);
            }
        };
        fetchDueItems();
    }, []);

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {/* Cinematic Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: studyPlan.length > 0 ? [0, 0.5, 0] : 0 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-none fixed inset-0 bg-yellow-400 z-50 mix-blend-overlay"
            />

            <div className="space-y-8 p-6">
                {/* Header with Search */}
                <div className="flex flex-col items-center justify-center space-y-6 py-8">
                    <div className="text-center space-y-2">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-brand-black text-white text-sm font-bold uppercase tracking-wider mb-2">
                            Neural Interface v2.0
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight leading-none">
                            What will you <span className="text-brand-blue underline decoration-4 decoration-yellow-400 underline-offset-4">master</span>?
                        </h1>
                        <p className="text-xl text-gray-500 font-medium max-w-xl mx-auto">
                            The Architect is ready. Input your learning objective.
                        </p>
                    </div>

                    <div className="w-full max-w-2xl relative">
                        <div className="relative">
                            <input
                                className="w-full text-xl font-bold p-6 pr-32 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                                placeholder="Type a goal (e.g. 'I want to build rockets')..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />

                            <button
                                onClick={executeSearch}
                                disabled={isGeneratingPlan || searchQuery.length < 2}
                                className="absolute right-3 top-3 bottom-3 px-6 bg-brand-black text-white font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {isGeneratingPlan ? <Activity className="w-4 h-4 animate-spin" /> : "Init"} <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-4 bg-white border-2 border-black rounded-xl shadow-lg z-50 overflow-hidden">
                                {searchResults.map((result) => (
                                    <div
                                        key={result.id}
                                        onClick={() => handleTopicClick(result.id)}
                                        className="p-4 hover:bg-yellow-50 border-b border-gray-100 cursor-pointer flex justify-between items-center"
                                    >
                                        <div>
                                            <h4 className="font-bold text-lg">{result.name}</h4>
                                            <p className="text-xs text-gray-500">{result.description}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-brand-black" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column (2/3) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Mission Directive Card - Dynamically updates with AI Plan */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-brand-blue text-white p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Rocket className="w-32 h-32" />
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-2xl font-black mb-6 uppercase tracking-wider flex items-center justify-between border-b-2 border-white/20 pb-4">
                                    <span>{studyPlan.length > 0 ? "Tactical Engagement Map" : "Mission Briefing"}</span>
                                    {isGeneratingPlan && <span className="text-xs text-white animate-pulse bg-white/20 px-2 py-1 rounded">CALCULATING...</span>}
                                </h2>

                                {loading && isGeneratingPlan ? (
                                    <div className="space-y-4">
                                        <div className="h-16 animate-pulse bg-white/20 rounded-xl" />
                                        <div className="h-16 animate-pulse bg-white/10 rounded-xl" />
                                        <div className="h-16 animate-pulse bg-white/5 rounded-xl" />
                                    </div>
                                ) : (
                                    <>
                                        {/* State A: Vertical Tactical Roadmap */}
                                        {studyPlan.length > 0 ? (
                                            <div className="space-y-0 relative">
                                                {/* Connecting Line */}
                                                <div className="absolute left-6 top-8 bottom-8 w-1 bg-white/30 -z-0" />

                                                {studyPlan.map((step, i) => {
                                                    const IconComponent = IconMap[step.icon] || Brain;
                                                    return (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ x: -20, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group relative z-10"
                                                            onClick={() => handleTopicClick(step.id)}
                                                        >
                                                            {/* Icon Badge */}
                                                            <div className="shrink-0 w-12 h-12 rounded-xl border-2 border-white bg-brand-blue flex items-center justify-center font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:bg-yellow-400 group-hover:text-black group-hover:border-black transition-all">
                                                                <IconComponent className="w-6 h-6" />
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex-1">
                                                                <h4 className="font-bold text-lg leading-tight group-hover:text-yellow-400 transition-colors">
                                                                    {step.title || step.name}
                                                                </h4>
                                                                <p className="text-sm text-blue-100 opacity-80 group-hover:opacity-100">
                                                                    {step.description}
                                                                </p>
                                                            </div>

                                                            {/* Action Arrow */}
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center">
                                                                <ArrowRight className="w-5 h-5 text-yellow-400" />
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            /* State B: Default Message */
                                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
                                                    <Target className="w-10 h-10 text-white/50" />
                                                </div>
                                                <p className="text-blue-100 text-lg font-medium max-w-sm">
                                                    {rec?.reason || "Awaiting Orders. Input your learning objective above to generate a tactical plan."}
                                                </p>
                                            </div>
                                        )}

                                        {/* Footer Actions */}
                                        {studyPlan.length > 0 && (
                                            <div className="flex items-center justify-between border-t border-white/20 pt-6 mt-6">
                                                <div className="flex gap-2 text-xs font-bold uppercase text-blue-200">
                                                    <span className="bg-white/10 px-2 py-1 rounded">Difficulty: {rec?.difficulty_level || "Adaptive"}</span>
                                                    <span className="bg-white/10 px-2 py-1 rounded">{studyPlan.length} Phases</span>
                                                </div>

                                                <UltramodernButton
                                                    onClick={() => setShowDurationPicker(true)}
                                                    className="bg-yellow-400 text-black border-black hover:bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] py-2 px-6 overflow-hidden max-w-xs truncate"
                                                >
                                                    Engage: {studyPlan[0]?.name || "Mission"} <Zap className="w-4 h-4 ml-2 fill-current inline-block" />
                                                </UltramodernButton>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>

                        <div>
                            <h3 className="text-xl font-black text-brand-black mb-4 flex items-center gap-2">
                                <Brain className="w-6 h-6" /> Knowledge Network
                            </h3>
                            <KnowledgeGraphViz highlightNodes={studyPlan.map(s => s.id)} />
                        </div>
                    </div>

                    {/* Right Column (1/3) */}
                    <div className="space-y-6">
                        {/* SRS Memory Upgrades */}
                        {dueItems.length > 0 && (
                            <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-500 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] animate-pulse">
                                <h3 className="font-black text-lg mb-2 text-red-600 flex items-center gap-2">
                                    🧠 Memory Degrading
                                </h3>
                                <p className="text-xs text-red-800 mb-4 font-bold">Review these immediately to retain mastery.</p>
                                <div className="space-y-2">
                                    {dueItems.map((item) => (
                                        <div key={item.id}
                                            onClick={() => handleTopicClick(item.id)}
                                            className="flex justify-between items-center bg-white p-2 rounded border border-red-200 cursor-pointer hover:bg-red-100"
                                        >
                                            <span className="font-bold text-sm text-red-900">{item.name}</span>
                                            <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full font-bold">DUE</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <NoteTaker topicId={rec?.next_topic_id || "general"} />
                    </div>
                </div>
            </div>

            {/* Legacy Landing Page Section */}
            <LegacyLanding />

            {/* Duration Picker Modal */}
            {showDurationPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full text-center space-y-6">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-brand-blue rounded-full">
                                <Rocket className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black uppercase">Initialize Session</h2>
                        <p className="text-gray-600 font-medium">How long will you focus on this objective?</p>

                        <div className="grid grid-cols-3 gap-3">
                            {[1].map((mins) => ( // Demo: 1 min for testing
                                <button
                                    key={mins}
                                    onClick={() => handleStartMission(mins)}
                                    className="p-4 rounded-xl border-2 border-gray-200 hover:border-black hover:bg-yellow-100 transition-all font-bold text-xl"
                                >
                                    {mins}m
                                    <span className="block text-xs text-gray-400 font-normal">Express</span>
                                </button>
                            ))}
                            <button
                                onClick={() => handleStartMission(25)}
                                className="p-4 rounded-xl border-2 border-gray-200 hover:border-black hover:bg-yellow-100 transition-all font-bold text-xl"
                            >
                                25m
                                <span className="block text-xs text-gray-400 font-normal">Standard</span>
                            </button>
                            <button
                                onClick={() => handleStartMission(45)}
                                className="p-4 rounded-xl border-2 border-gray-200 hover:border-black hover:bg-yellow-100 transition-all font-bold text-xl"
                            >
                                45m
                                <span className="block text-xs text-gray-400 font-normal">Deep</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowDurationPicker(false)}
                            className="text-gray-400 font-bold hover:text-black mt-4"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
