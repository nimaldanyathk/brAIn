export const TOPIC_TO_ROUTE: { [key: string]: string } = {
    // Physics
    "vectors": "/physix/vectors",
    "kinematics": "/physix/motion",
    "motion": "/physix/motion",
    "newtons_laws": "/physix/newton",
    "work_energy": "/physix/energy",
    "momentum": "/physix/momentum",
    "gravitation": "/physix/gravitation",
    "optics": "/physix/optics",
    "ohms_law": "/physix/ohms-law",
    "thermodynamics": "/physix/energy", // Fallback
    "fluid_dynamics": "/physix/motion", // Fallback
    "aerodynamics": "/physix/motion", // Fallback
    "rocketry": "/physix/gravitation", // Fallback
    "relativity": "/physix/gravitation", // Fallback
    "quantum_mechanics": "/chemistry/atomic", // Fallback

    // Chemistry
    "atoms": "/chemistry/atomic",
    "periodic_table": "/chemistry/periodic",
    "bonding": "/chemistry/bonding",
    "reactions": "/chemistry/reactions",
    "organic_chem": "/chemistry/organic",

    // Math
    "algebra": "/math/algebra",
    "geometry": "/math/geometry",
    "trigonometry": "/math/complex",
    "calculus": "/math/algebra",
    "probability": "/math/probability",
    "sets": "/math/sets"
};

export interface MissionPhase {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export const startMission = (plan: MissionPhase[]) => {
    localStorage.setItem('currentMissionPlan', JSON.stringify(plan));
    localStorage.setItem('currentMissionIndex', '0');
    // Dispatch event to update trackers immediately
    window.dispatchEvent(new Event('MISSION_UPDATE'));
};

export const advanceMission = () => {
    const idx = parseInt(localStorage.getItem('currentMissionIndex') || '0');
    localStorage.setItem('currentMissionIndex', (idx + 1).toString());
    window.dispatchEvent(new Event('MISSION_UPDATE'));
};

export const getCurrentMission = () => {
    try {
        const plan = JSON.parse(localStorage.getItem('currentMissionPlan') || '[]');
        const idx = parseInt(localStorage.getItem('currentMissionIndex') || '0');
        return { plan, idx };
    } catch {
        return { plan: [], idx: 0 };
    }
};
