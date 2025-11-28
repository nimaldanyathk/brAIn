import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, Environment, SoftShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Play, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Game Constants ---
const TRAIN_SPEED = 2;

// --- Types ---
type Question = {
    id: number;
    text: string;
    options: string[];
    correctAnswer: string;
};

const QUESTIONS: Question[] = [
    { id: 1, text: "2 + 2", options: ["3", "4", "5"], correctAnswer: "4" },
    { id: 2, text: "Red + Blue", options: ["Green", "Purple", "Orange"], correctAnswer: "Purple" },
    { id: 3, text: "5 - 2", options: ["3", "2", "7"], correctAnswer: "3" },
    { id: 4, text: "Cat says", options: ["Woof", "Meow", "Moo"], correctAnswer: "Meow" },
    { id: 5, text: "3 x 3", options: ["6", "9", "12"], correctAnswer: "9" },
    { id: 6, text: "Sun is", options: ["Cold", "Hot", "Wet"], correctAnswer: "Hot" },
];

export const LearningExpress: React.FC = () => {
    const navigate = useNavigate();
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
    const [score, setScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isGapFilled, setIsGapFilled] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false);

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setCurrentQuestionIndex(0);
        setIsGapFilled(false);
        setShowQuestion(false);
    };

    const handleAnswer = (option: string) => {
        if (option === QUESTIONS[currentQuestionIndex].correctAnswer) {
            setIsGapFilled(true);
            setScore(s => s + 100);
            setShowQuestion(false);
        } else {
            // Shake effect or sound?
        }
    };

    const handleGapPassed = () => {
        setIsGapFilled(false);
        setCurrentQuestionIndex(prev => (prev + 1) % QUESTIONS.length);
    };

    return (
        <div className="w-full h-screen bg-[#f0e6d2] relative overflow-hidden font-sans select-none">
            {/* UI Overlay */}
            <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <Button variant="ghost" onClick={() => navigate('/')} className="bg-white/80 backdrop-blur hover:bg-white shadow-sm rounded-full text-amber-800">
                        <ArrowLeft className="w-6 h-6 mr-2" />
                        <span className="font-bold">Back to Playroom</span>
                    </Button>
                </div>
                <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg border-2 border-amber-200">
                    <div className="text-amber-800 font-bold text-xl">Score: {score}</div>
                </div>
            </div>

            {/* 3D Scene */}
            <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
                <OrthographicCamera makeDefault position={[20, 20, 20]} zoom={40} near={-50} far={200} />
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 20, 5]}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-bias={-0.0001}
                />
                <SoftShadows size={10} samples={10} focus={0} />

                <ToyTrainScene
                    gameState={gameState}
                    setGameState={setGameState}
                    isGapFilled={isGapFilled}
                    setShowQuestion={setShowQuestion}
                    onGapPassed={handleGapPassed}
                />
            </Canvas>

            {/* Start Screen */}
            {gameState === 'start' && (
                <div className="absolute inset-0 flex items-center justify-center bg-amber-900/20 backdrop-blur-sm z-20">
                    <Card className="p-10 max-w-md w-full text-center border-4 border-amber-400 shadow-2xl bg-[#fff9f0] rounded-[2rem]">
                        <div className="text-6xl mb-4">🚂</div>
                        <h1 className="text-4xl font-black text-amber-800 mb-2 font-serif">TrAIn</h1>
                        <p className="text-amber-700 mb-8 text-lg">Help the little train find its way!</p>
                        <Button onClick={startGame} className="w-full text-xl py-6 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all">
                            <Play className="w-6 h-6 mr-2 fill-current" />
                            Start Playing
                        </Button>
                    </Card>
                </div>
            )}

            {/* Game Over Screen */}
            {gameState === 'gameover' && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 backdrop-blur-sm z-20">
                    <Card className="p-10 max-w-md w-full text-center border-4 border-red-400 shadow-2xl bg-[#fff9f0] rounded-[2rem]">
                        <div className="text-6xl mb-4">💥</div>
                        <h2 className="text-3xl font-black text-red-600 mb-2">Oh no!</h2>
                        <p className="text-amber-700 mb-6">The track was broken!</p>
                        <Button onClick={() => window.location.reload()} className="w-full text-xl py-6 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 transition-all">
                            <RefreshCw className="w-6 h-6 mr-2" />
                            Try Again
                        </Button>
                    </Card>
                </div>
            )}

            {/* Question Bubble */}
            {gameState === 'playing' && showQuestion && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 animate-pop-in">
                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl border-4 border-blue-400 relative max-w-lg w-full">
                        {/* Triangle pointer */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-b-4 border-r-4 border-blue-400 transform rotate-45"></div>

                        <div className="text-center">
                            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2">Missing Piece!</h3>
                            <div className="text-4xl font-black text-blue-600 mb-6 font-mono">{QUESTIONS[currentQuestionIndex].text} = ?</div>

                            <div className="flex gap-4 justify-center">
                                {QUESTIONS[currentQuestionIndex].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(option)}
                                        className="w-20 h-20 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-2xl border-b-4 border-amber-300 active:border-b-0 active:translate-y-1 transition-all shadow-sm"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ToyTrainScene = ({
    gameState,
    setGameState,
    isGapFilled,
    setShowQuestion,
    onGapPassed
}: any) => {
    const trainRef = useRef<THREE.Group>(null);
    const [progress, setProgress] = useState(0);
    const lastProgress = useRef(0);

    // Create a winding closed loop path
    const curve = useMemo(() => {
        const points = [];
        // Create a figure-8 or complex loop
        for (let i = 0; i < 100; i++) {
            const t = (i / 100) * Math.PI * 2;
            const x = Math.sin(t) * 20 + Math.sin(t * 3) * 5; // Winding x
            const z = Math.cos(t) * 15 + Math.cos(t * 2) * 5; // Winding z
            points.push(new THREE.Vector3(x, 0, z));
        }
        return new THREE.CatmullRomCurve3(points, true); // true = closed loop
    }, []);

    useFrame((state, delta) => {
        if (gameState === 'playing' && trainRef.current) {
            // Move train
            const speed = TRAIN_SPEED * 0.02 * delta;
            const newProgress = (progress + speed) % 1;

            // Get position on curve
            const position = curve.getPointAt(newProgress);
            const tangent = curve.getTangentAt(newProgress);

            // Look ahead for gaps
            const lookAheadDist = 0.05; // ~5% of track ahead
            const futureProgress = (newProgress + lookAheadDist) % 1;

            // Simple gap logic: Gaps are at specific progress intervals (e.g., 0.2, 0.4, 0.6, 0.8)
            const gapSize = 0.02;
            const gaps = [0.2, 0.4, 0.6, 0.8];
            let approachingGap = false;
            let inGap = false;

            for (const gap of gaps) {
                // Check if we are approaching a gap
                if (newProgress < gap && futureProgress >= gap) {
                    approachingGap = true;
                }
                // Check if we are IN a gap
                if (newProgress >= gap && newProgress < gap + gapSize) {
                    inGap = true;
                }

                // Check if we just passed a gap
                const gapEnd = gap + gapSize;
                // Handle wrap-around logic if needed, but for simple increasing progress:
                if (lastProgress.current < gapEnd && newProgress >= gapEnd) {
                    onGapPassed();
                }
            }

            if (approachingGap && !isGapFilled) {
                setShowQuestion(true);
            }

            if (inGap && !isGapFilled) {
                // Fall / Fail
                trainRef.current.position.y -= delta * 15; // Faster fall
                trainRef.current.rotation.x += delta * 2;
                trainRef.current.rotation.z += delta * 1;
                if (trainRef.current.position.y < -5) {
                    setGameState('gameover');
                }
            } else {
                // Normal movement
                setProgress(newProgress);
                lastProgress.current = newProgress;

                // Add elevation offset (+5 for track height, +0.2 for wheel offset)
                const elevatedPos = position.clone();
                elevatedPos.y += 5;
                trainRef.current.position.copy(elevatedPos);

                // Orient train to track
                const lookAtPos = elevatedPos.clone().add(tangent);
                trainRef.current.lookAt(lookAtPos);
            }

            // Camera follow (Smooth isometric follow)
            const camTarget = position.clone().add(new THREE.Vector3(20, 20, 20));
            state.camera.position.lerp(camTarget, delta * 2);
            state.camera.lookAt(position);
        }
    });

    return (
        <group>
            {/* Water Environment */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial color="#0ea5e9" metalness={0.8} roughness={0.2} />
            </mesh>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            {/* Track */}
            <WoodenTrack curve={curve} isGapFilled={isGapFilled} />

            {/* Train Engine */}
            <group ref={trainRef} position={[0, 0.2, 0]}>
                <ToyTrainModel />
            </group>

            {/* Bogie 1 (Blue) */}
            <TrainBogie curve={curve} progress={progress} offset={0.015} color="#3b82f6" />

            {/* Bogie 2 (Green) */}
            <TrainBogie curve={curve} progress={progress} offset={0.03} color="#22c55e" />

            {/* Scenery (Islands/Rocks) */}
            <ToyBlock position={[15, -1, 5]} color="#22c55e" scale={[5, 2, 5]} />
            <ToyBlock position={[-15, -1, -8]} color="#22c55e" scale={[4, 3, 4]} />
        </group>
    );
};

const TrainBogie = ({ curve, progress, offset, color }: any) => {
    const bogieRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (bogieRef.current) {
            // Calculate position with offset (handle wrap-around)
            let bogieProgress = progress - offset;
            if (bogieProgress < 0) bogieProgress += 1;

            const position = curve.getPointAt(bogieProgress);
            const tangent = curve.getTangentAt(bogieProgress);

            // Elevate
            position.y += 5;
            bogieRef.current.position.copy(position);

            // Orient
            const lookAtPos = position.clone().add(tangent);
            bogieRef.current.lookAt(lookAtPos);
        }
    });

    return (
        <group ref={bogieRef}>
            <ToyTrainCar color={color} />
        </group>
    );
};

const WoodenTrack = ({ curve, isGapFilled }: { curve: THREE.CatmullRomCurve3, isGapFilled: boolean }) => {
    // Generate track segments along the curve
    const segments = 200;
    const trackPieces = [];
    const gaps = [0.2, 0.4, 0.6, 0.8];
    const gapSize = 0.02;

    for (let i = 0; i < segments; i++) {
        const t = i / segments;
        const pos = curve.getPointAt(t);
        // Elevate track
        pos.y += 5;

        const tangent = curve.getTangentAt(t);
        const rotation = new THREE.Euler(0, Math.atan2(tangent.x, tangent.z), 0);

        // Check if this segment is part of a gap
        let isGap = false;
        for (const gap of gaps) {
            if (t >= gap && t < gap + gapSize) {
                isGap = true;
                break;
            }
        }

        if (!isGap) {
            trackPieces.push(
                <group key={i}>
                    <WoodenTrackPiece position={pos} rotation={rotation} />
                    {/* Pillar every 10 segments */}
                    {i % 10 === 0 && (
                        <mesh position={[pos.x, 2.5, pos.z]} castShadow receiveShadow>
                            <cylinderGeometry args={[0.5, 0.6, 5]} />
                            <meshStandardMaterial color="#a87f56" />
                        </mesh>
                    )}
                </group>
            );
        } else if (isGap && isGapFilled) {
            // Render "Ghost" or "Filled" piece
            trackPieces.push(
                <group key={i}>
                    <WoodenTrackPiece position={pos} rotation={rotation} isNew={true} />
                    {i % 10 === 0 && (
                        <mesh position={[pos.x, 2.5, pos.z]} castShadow receiveShadow>
                            <cylinderGeometry args={[0.5, 0.6, 5]} />
                            <meshStandardMaterial color="#a87f56" />
                        </mesh>
                    )}
                </group>
            );
        }
    }

    return <group>{trackPieces}</group>;
};

const WoodenTrackPiece = ({ position, rotation, isNew = false }: any) => (
    <group position={position} rotation={rotation}>
        {/* Main Plank - Scaled Up */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 0.3, 1.2]} />
            <meshStandardMaterial color={isNew ? "#86efac" : "#d4a373"} />
        </mesh>
        {/* Grooves */}
        <mesh position={[0.6, 0.16, 0]}>
            <boxGeometry args={[0.15, 0.05, 1.2]} />
            <meshStandardMaterial color="#a87f56" />
        </mesh>
        <mesh position={[-0.6, 0.16, 0]}>
            <boxGeometry args={[0.15, 0.05, 1.2]} />
            <meshStandardMaterial color="#a87f56" />
        </mesh>
    </group>
);

const ToyTrainCar = ({ color }: { color: string }) => (
    <group scale={[1.1, 1.1, 1.1]}>
        {/* Car Body */}
        <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[1, 0.8, 1.6]} />
            <meshStandardMaterial color={color} />
        </mesh>
        {/* Cargo/Top */}
        <mesh position={[0, 1, 0]} castShadow>
            <boxGeometry args={[0.8, 0.4, 1.4]} />
            <meshStandardMaterial color={color} />
        </mesh>
        {/* Wheels */}
        {[0.5, -0.5].map((z, i) => (
            <group key={i} position={[0, 0.3, z]}>
                <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.2]} />
                    <meshStandardMaterial color="#1e293b" />
                </mesh>
                <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.2]} />
                    <meshStandardMaterial color="#1e293b" />
                </mesh>
            </group>
        ))}
    </group>
);

const ToyTrainModel = () => (
    <group scale={[1.2, 1.2, 1.2]}>
        {/* Engine Body */}
        <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[1, 1, 1.8]} />
            <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Cabin */}
        <mesh position={[0, 1.2, -0.4]} castShadow>
            <boxGeometry args={[1.1, 0.8, 0.8]} />
            <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 1.65, -0.4]} castShadow>
            <boxGeometry args={[1.2, 0.1, 1]} />
            <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Chimney */}
        <mesh position={[0, 1.2, 0.5]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.6]} />
            <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Wheels */}
        {[0.6, -0.6].map((z, i) => (
            <group key={i} position={[0, 0.3, z]}>
                <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.2]} />
                    <meshStandardMaterial color="#1e293b" />
                </mesh>
                <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.2]} />
                    <meshStandardMaterial color="#1e293b" />
                </mesh>
            </group>
        ))}
    </group>
);

const ToyBlock = ({ position, color, scale = [1, 1, 1] }: { position: [number, number, number], color: string, scale?: [number, number, number] }) => (
    <mesh position={position} scale={scale} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
    </mesh>
);
