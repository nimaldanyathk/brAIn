import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Target } from 'lucide-react';
import { getCurrentMission, TOPIC_TO_ROUTE, advanceMission, type MissionPhase } from '../lib/missionControl';

export const MissionTracker: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mission, setMission] = useState<{ plan: MissionPhase[], idx: number } | null>(null);

    const updateMission = () => {
        const m = getCurrentMission();
        // Only set if valid plan exists
        if (m.plan && m.plan.length > 0 && m.idx < m.plan.length) {
            setMission(m);
        } else {
            setMission(null);
        }
    };

    useEffect(() => {
        updateMission();
        window.addEventListener('MISSION_UPDATE', updateMission);
        return () => window.removeEventListener('MISSION_UPDATE', updateMission);
    }, []);

    if (!mission) return null;

    const currentPhase = mission.plan[mission.idx];
    const nextPhase = mission.plan[mission.idx + 1];

    // Determine expected route
    const expectedRoute = TOPIC_TO_ROUTE[currentPhase.id];
    const isOnTrack = location.pathname === expectedRoute;

    const handleNext = () => {
        advanceMission();
        if (nextPhase) {
            const nextRoute = TOPIC_TO_ROUTE[nextPhase.id];
            if (nextRoute) navigate(nextRoute);
        } else {
            // Mission Complete
            localStorage.removeItem('currentMissionPlan');
            localStorage.removeItem('currentMissionIndex');
            navigate('/'); // Back to HQ
            alert("Mission Accomplished! Data synced.");
        }
    };

    // If not on track and distinct from StudyMenu (which is usually /study or /), show "Return to Mission"
    // But StudyMenu is /, so check if we are actually inside a topic or just browsing.
    // If not isOnTrack, we display a "Resume Mission" button

    const isCompleted = mission.idx >= mission.plan.length;

    if (isCompleted) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 animate-in slide-in-from-bottom-10 fade-in duration-500">
            {/* Tracker Card */}
            <div className={`p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 transition-all ${isOnTrack ? 'bg-white' : 'bg-yellow-100'}`}>

                <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                        Mission Objective {mission.idx + 1}/{mission.plan.length}
                    </span>
                    <span className="text-lg font-bold flex items-center gap-2">
                        {isOnTrack ? (
                            <Target className="w-5 h-5 text-brand-blue" />
                        ) : (
                            <span className="text-xl">⚠️</span>
                        )}
                        {currentPhase.title}
                    </span>
                    {!isOnTrack && expectedRoute && (
                        <span className="text-xs text-red-500 font-bold">Signal Lost. Return to coordinates.</span>
                    )}
                </div>

                {isOnTrack ? (
                    <button
                        onClick={handleNext}
                        className="bg-brand-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold border-2 border-transparent hover:border-black transition-all flex items-center gap-2"
                    >
                        {nextPhase ? "Initialize Next Phase" : "Complete Mission"} <ArrowRight className="w-4 h-4" />
                    </button>
                ) : expectedRoute ? (
                    <button
                        onClick={() => navigate(expectedRoute)}
                        className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-lg font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all"
                    >
                        Resume <Target className="w-4 h-4 inline ml-1" />
                    </button>
                ) : null}
            </div>
        </div>
    );
};
