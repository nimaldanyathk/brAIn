import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, PerspectiveCamera, Environment, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Crosshair, RefreshCw, Target, MousePointer2 } from 'lucide-react';

// --- Sound Utility ---
const playGunshot = () => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
};

// --- 3D Components ---

const Gun = ({
    isFiring,
    recoilDistance,
    gunMass
}: {
    isFiring: boolean;
    recoilDistance: number;
    gunMass: number;
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();

    // Visual scale based on mass (heavier = bulkier)
    const scale = 1 + (gunMass - 2) * 0.1;

    useFrame(() => {
        if (groupRef.current) {
            // Gun follows camera rotation but stays in front
            groupRef.current.position.copy(camera.position);
            groupRef.current.quaternion.copy(camera.quaternion);

            // Offset gun to bottom right
            groupRef.current.translateX(0.3);
            groupRef.current.translateY(-0.3);
            groupRef.current.translateZ(-0.5 + recoilDistance); // Apply recoil here
        }
    });

    return (
        <group ref={groupRef}>
            {/* Main Barrel */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -1]}>
                <cylinderGeometry args={[0.1 * scale, 0.15 * scale, 3, 16]} />
                <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Stock/Body */}
            <mesh position={[0, -0.2, 1]}>
                <boxGeometry args={[0.3 * scale, 0.4 * scale, 1.5]} />
                <meshStandardMaterial color="#5D4037" /> {/* Wood texture color */}
            </mesh>

            {/* Scope */}
            <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.06, 1, 16]} />
                <meshStandardMaterial color="#111" />
            </mesh>

            {/* Muzzle Flash */}
            {isFiring && (
                <pointLight position={[0, 0, -3]} intensity={5} color="orange" distance={5} decay={2} />
            )}
            {isFiring && (
                <mesh position={[0, 0, -2.8]}>
                    <sphereGeometry args={[0.2, 8, 8]} />
                    <meshBasicMaterial color="#ffaa00" transparent opacity={0.8} />
                </mesh>
            )}
        </group>
    );
};

const Bullet = ({ position, velocity }: { position: THREE.Vector3, velocity: THREE.Vector3 }) => {
    const ref = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (ref.current) {
            // Time scale for visualization (slow down bullet to make it visible)
            const timeScale = 0.1;
            ref.current.position.add(velocity.clone().multiplyScalar(delta * timeScale));
        }
    });

    return (
        <Trail
            width={0.4}
            length={8}
            color={new THREE.Color(1, 0.5, 0)}
            attenuation={(t) => t * t}
        >
            <mesh ref={ref} position={position}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial color="gold" emissive="orange" emissiveIntensity={2} toneMapped={false} />
            </mesh>
        </Trail>
    );
};

const TargetBoard = ({ isHit, holes }: { isHit: boolean, holes: THREE.Vector3[] }) => {
    const ref = useRef<THREE.Group>(null);
    const boardRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (ref.current) {
            if (isHit) {
                // Wobble effect when hit
                ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 20) * 0.2;
            } else {
                ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0, 0.1);
            }
        }
    });

    return (
        <group ref={ref} position={[0, 0, -20]}>
            {/* Stand */}
            <mesh position={[0, -2, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
                <meshStandardMaterial color="#666" />
            </mesh>

            {/* Board */}
            <mesh ref={boardRef} position={[0, 0.5, 0]}>
                <boxGeometry args={[2, 2, 0.1]} />
                <meshStandardMaterial color="#fff" />

                {/* Bullet Holes */}
                {holes.map((pos, i) => (
                    <mesh key={i} position={[pos.x, pos.y, 0.06]} rotation={[0, 0, Math.random() * Math.PI]}>
                        <circleGeometry args={[0.05, 16]} />
                        <meshBasicMaterial color="black" depthTest={false} polygonOffset polygonOffsetFactor={-1} />
                    </mesh>
                ))}
            </mesh>

            {/* Rings */}
            <mesh position={[0, 0.5, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.8, 0.8, 0.01, 32]} />
                <meshBasicMaterial color="red" />
            </mesh>
            <mesh position={[0, 0.5, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.6, 0.6, 0.01, 32]} />
                <meshBasicMaterial color="white" />
            </mesh>
            <mesh position={[0, 0.5, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.01, 32]} />
                <meshBasicMaterial color="red" />
            </mesh>
            <mesh position={[0, 0.5, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 0.01, 32]} />
                <meshBasicMaterial color="white" />
            </mesh>
        </group>
    );
};

const Scene = ({
    gunMass,
    bulletMass,
    muzzleVelocity,
    onHit,
    holes,
    setHoles,
    isLocked,
    setIsLocked
}: {
    gunMass: number;
    bulletMass: number;
    muzzleVelocity: number;
    onHit: () => void;
    holes: THREE.Vector3[];
    setHoles: React.Dispatch<React.SetStateAction<THREE.Vector3[]>>;
    isLocked: boolean;
    setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [bullets, setBullets] = useState<{ id: number; pos: THREE.Vector3; vel: THREE.Vector3 }[]>([]);
    const [recoilZ, setRecoilZ] = useState(0);
    const [isFiring, setIsFiring] = useState(false);
    const [targetHit, setTargetHit] = useState(false);
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);

    // Sync lock state with controls
    useEffect(() => {
        if (isLocked && controlsRef.current) {
            controlsRef.current.lock();
        }
    }, [isLocked]);

    // Handle Click to Fire
    useEffect(() => {
        const handleMouseDown = () => {
            if (document.pointerLockElement) {
                setIsFiring(true);
                playGunshot();

                // Calculate Recoil Velocity
                const recoilVel = (bulletMass * muzzleVelocity) / gunMass;
                setRecoilZ(Math.min(recoilVel * 0.5, 1.5));

                // Get firing direction from camera
                const direction = new THREE.Vector3();
                camera.getWorldDirection(direction);

                // Spawn Bullet at gun muzzle position (approximate)
                const spawnPos = camera.position.clone().add(direction.clone().multiplyScalar(1)); // Start slightly in front

                const newBullet = {
                    id: Date.now(),
                    pos: spawnPos,
                    vel: direction.multiplyScalar(muzzleVelocity)
                };
                setBullets(prev => [...prev, newBullet]);

                setTimeout(() => setIsFiring(false), 100);
            }
        };

        window.addEventListener('mousedown', handleMouseDown);
        return () => window.removeEventListener('mousedown', handleMouseDown);
    }, [gunMass, bulletMass, muzzleVelocity, camera]);

    // Physics Loop
    useFrame((_, delta) => {
        // Cleanup old bullets
        setBullets(prev => prev.filter(b => Date.now() - b.id < 5000));

        // Recover Recoil
        setRecoilZ(prev => THREE.MathUtils.lerp(prev, 0, delta * 5));
    });

    // Precise Collision Check
    useFrame(() => {
        bullets.forEach(b => {
            // Calculate current position based on time alive
            const timeAlive = (Date.now() - b.id) / 1000;
            const timeScale = 0.1; // Match the visual speed
            const prevPos = b.pos.clone().add(b.vel.clone().multiplyScalar((timeAlive - 0.016) * timeScale));
            const currentPos = b.pos.clone().add(b.vel.clone().multiplyScalar(timeAlive * timeScale));

            // Check if bullet crossed the target plane (z = -20)
            if (prevPos.z > -20 && currentPos.z <= -20) {
                // Calculate exact intersection point
                // P = P_prev + t * (P_curr - P_prev)
                // z = -20 => -20 = P_prev.z + t * (P_curr.z - P_prev.z)
                // t = (-20 - P_prev.z) / (P_curr.z - P_prev.z)
                const t = (-20 - prevPos.z) / (currentPos.z - prevPos.z);
                const intersection = prevPos.clone().lerp(currentPos, t);

                // Check bounds of target board (2x2 centered at 0,0.5)
                // x: [-1, 1], y: [-0.5, 1.5]
                if (Math.abs(intersection.x) < 1 && Math.abs(intersection.y - 0.5) < 1) {
                    if (!targetHit) {
                        setTargetHit(true);
                        onHit();
                        // Add hole relative to board center (0, 0.5, -20)
                        setHoles(prev => [...prev, new THREE.Vector3(intersection.x, intersection.y - 0.5, 0)]);
                        setTimeout(() => setTargetHit(false), 500);
                    }
                }
            }
        });
    });

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 1.6, 5]} fov={60} />
            <PointerLockControls
                ref={controlsRef}
                selector="#game-start-overlay" // Only lock when this specific element is clicked (we will manually trigger it anyway)
                onUnlock={() => setIsLocked(false)}
            />
            <Environment preset="sunset" />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            <Gun isFiring={isFiring} recoilDistance={recoilZ} gunMass={gunMass} />

            {bullets.map(b => (
                <Bullet key={b.id} position={b.pos} velocity={b.vel} />
            ))}

            <TargetBoard isHit={targetHit} holes={holes} />

            {/* Ground */}
            <gridHelper args={[100, 100]} position={[0, 0, 0]} />
        </>
    );
};

// --- Main Component ---

export const RecoilSimulation: React.FC = () => {
    const [gunMass, setGunMass] = useState(5); // kg
    const [bulletMass, setBulletMass] = useState(0.05); // kg
    const [muzzleVelocity, setMuzzleVelocity] = useState(400); // m/s
    const [score, setScore] = useState(0);
    const [holes, setHoles] = useState<THREE.Vector3[]>([]);
    const [isLocked, setIsLocked] = useState(false);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* 3D Viewport */}
            <div className="lg:col-span-2 relative bg-black rounded-2xl overflow-hidden border-4 border-gray-800 shadow-2xl group">
                <Canvas>
                    <Scene
                        gunMass={gunMass}
                        bulletMass={bulletMass}
                        muzzleVelocity={muzzleVelocity}
                        onHit={() => setScore(s => s + 1)}
                        holes={holes}
                        setHoles={setHoles}
                        isLocked={isLocked}
                        setIsLocked={setIsLocked}
                    />
                </Canvas>

                {/* HUD Overlay */}
                <div className="absolute top-4 left-4 pointer-events-none">
                    <div className="bg-black/50 text-green-400 p-2 rounded font-mono text-sm border border-green-500/30 backdrop-blur-sm">
                        <div>SCORE: {score}</div>
                        <div>STATUS: {isLocked ? 'ARMED' : 'STANDBY'}</div>
                    </div>
                </div>

                {/* Crosshair */}
                {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                        <Crosshair className="w-8 h-8 text-white" />
                    </div>
                )}

                {/* Instructions Overlay */}
                {isLocked && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none text-white/50 text-xs font-mono">
                        CLICK TO FIRE • ESC TO EXIT
                    </div>
                )}

                {/* Click to Start Overlay */}
                {!isLocked && (
                    <div
                        id="game-start-overlay"
                        onClick={() => setIsLocked(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 cursor-pointer hover:bg-black/50 transition-colors"
                    >
                        <div className="text-white font-bold flex items-center gap-2 animate-pulse">
                            <MousePointer2 className="w-6 h-6" />
                            CLICK TO START SIMULATION
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="space-y-6">
                <Card className="p-6 bg-gray-900 text-white border-gray-700">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-green-400">
                        <Target className="w-5 h-5" />
                        Ballistics Computer
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                                Gun Mass (kg)
                                <span className="text-white font-mono">{gunMass} kg</span>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                step="0.5"
                                value={gunMass}
                                onChange={(e) => setGunMass(Number(e.target.value))}
                                className="w-full accent-green-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                                Bullet Mass (kg)
                                <span className="text-white font-mono">{bulletMass} kg</span>
                            </label>
                            <input
                                type="range"
                                min="0.01"
                                max="0.5"
                                step="0.01"
                                value={bulletMass}
                                onChange={(e) => setBulletMass(Number(e.target.value))}
                                className="w-full accent-green-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                                Muzzle Velocity (m/s)
                                <span className="text-white font-mono">{muzzleVelocity} m/s</span>
                            </label>
                            <input
                                type="range"
                                min="100"
                                max="1000"
                                step="10"
                                value={muzzleVelocity}
                                onChange={(e) => setMuzzleVelocity(Number(e.target.value))}
                                className="w-full accent-green-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-black/40 rounded-lg border border-gray-700 font-mono">
                        <div className="text-xs text-gray-500 mb-1">CALCULATED RECOIL</div>
                        <div className="text-2xl font-bold text-red-400">
                            {((bulletMass * muzzleVelocity) / gunMass).toFixed(2)} m/s
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            v_gun = (m_bullet × v_bullet) / m_gun
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full mt-6 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                        onClick={() => {
                            setScore(0);
                            setHoles([]);
                        }}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset System
                    </Button>
                </Card>
            </div>
        </div>
    );
};
