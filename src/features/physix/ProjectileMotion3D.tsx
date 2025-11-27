import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Grid } from '@react-three/drei';
import * as THREE from 'three';

interface ProjectileMotion3DProps {
    initialVelocity: number;
    angle: number; // in degrees
    initialHeight?: number; // in meters
    isLaunching: boolean;
    onUpdate: (data: { time: number; x: number; y: number }) => void;
}

const GRAVITY = 9.81;

const Human = ({ height }: { height: number }) => {
    return (
        <group position={[0, 0, 0]}>
            {/* Body */}
            <mesh position={[0, height / 2, 0]}>
                <cylinderGeometry args={[0.2, 0.2, height, 32]} />
                <meshStandardMaterial color="#4b5563" />
            </mesh>
            {/* Head */}
            <mesh position={[0, height + 0.2, 0]}>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial color="#fca5a5" />
            </mesh>
            {/* Arm (Simple) */}
            <mesh position={[0.3, height - 0.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <cylinderGeometry args={[0.08, 0.08, 0.6, 32]} />
                <meshStandardMaterial color="#fca5a5" />
            </mesh>
        </group>
    );
};

const OrigamiPlane = ({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation}>
            {/* Main Body - White Paper */}
            <mesh rotation={[0, 0, 0]}>
                <coneGeometry args={[0.5, 2, 4]} />
                <meshStandardMaterial color="#f5f5f5" side={THREE.DoubleSide} />
            </mesh>
            {/* Wings/Folds details could be added here with more geometry or textures */}
            <mesh position={[0, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.2, 0.5, 4]} />
                <meshStandardMaterial color="#e5e5e5" />
            </mesh>
        </group>
    );
};

const TrajectoryLine = ({ points }: { points: THREE.Vector3[] }) => {
    if (points.length < 2) return null;
    return (
        <Line
            points={points}
            color="#3b82f6"
            lineWidth={3}
            dashed={false}
        />
    );
};

const SceneContent = ({ initialVelocity, angle, initialHeight = 1.6, isLaunching, onUpdate }: ProjectileMotion3DProps) => {
    const planeRef = useRef<THREE.Group>(null);
    const [time, setTime] = useState(0);
    const [trajectoryPoints, setTrajectoryPoints] = useState<THREE.Vector3[]>([new THREE.Vector3(0, initialHeight, 0)]);
    const [landed, setLanded] = useState(false);

    // Reset state when not launching
    useEffect(() => {
        if (!isLaunching) {
            setTime(0);
            setTrajectoryPoints([new THREE.Vector3(0, initialHeight, 0)]);
            setLanded(false);
            if (planeRef.current) {
                planeRef.current.position.set(0, initialHeight, 0);
                // Reset rotation to match launch angle
                planeRef.current.rotation.set(0, 0, (angle * Math.PI) / 180);
            }
        }
    }, [isLaunching, angle, initialHeight]);

    useFrame((_, delta) => {
        if (isLaunching && !landed) {
            // Physics simulation
            // We use a fixed time step or accumulated time for consistency, 
            // but for simple viz, incrementing time is okay.
            // Using a slightly faster simulation speed for better UX
            const simSpeed = 2.0;
            const newTime = time + delta * simSpeed;

            const rad = (angle * Math.PI) / 180;
            const vx = initialVelocity * Math.cos(rad);
            const vy = initialVelocity * Math.sin(rad);

            const x = vx * newTime;
            const y = initialHeight + (vy * newTime) - (0.5 * GRAVITY * Math.pow(newTime, 2));

            if (y <= 0 && newTime > 0.1) {
                // Landed
                setLanded(true);
                const finalX = x; // Approximate
                if (planeRef.current) {
                    planeRef.current.position.set(finalX, 0, 0);
                    planeRef.current.rotation.set(0, 0, 0); // Flat on ground
                }
                onUpdate({ time: newTime, x: finalX, y: 0 });
            } else {
                setTime(newTime);
                if (planeRef.current) {
                    planeRef.current.position.set(x, Math.max(0, y), 0);
                    // Point the plane along the velocity vector
                    const currentVy = vy - GRAVITY * newTime;
                    const rotationAngle = Math.atan2(currentVy, vx);
                    planeRef.current.rotation.set(0, 0, rotationAngle - Math.PI / 2); // Adjust for cone orientation
                    // Actually cone points up (Y), so we need to rotate it to point along velocity
                    // Cone default is pointing up Y. 
                    // We want it to point towards +X initially if angle is 0.
                    // So rotate -90 deg (-PI/2) around Z to point X.
                    // Then add the flight angle.
                    planeRef.current.rotation.z = rotationAngle - (Math.PI / 2);
                }

                // Update trajectory
                if (time % 0.1 < 0.05) { // Optimization: don't save every frame
                    setTrajectoryPoints(prev => [...prev, new THREE.Vector3(x, Math.max(0, y), 0)]);
                }
                onUpdate({ time: newTime, x, y: Math.max(0, y) });
            }
        } else if (!isLaunching) {
            // Preview orientation
            if (planeRef.current) {
                const rad = (angle * Math.PI) / 180;
                planeRef.current.rotation.z = rad - (Math.PI / 2);
            }
        }
    });

    return (
        <>
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <directionalLight position={[-5, 5, 5]} intensity={0.5} />

            {/* Ground */}
            <Grid position={[0, -0.01, 0]} args={[50, 50]} cellSize={1} cellThickness={1} sectionSize={5} sectionThickness={1.5} fadeDistance={30} sectionColor="#9ca3af" cellColor="#e5e7eb" />

            {/* Launch Platform / Human */}
            <Human height={initialHeight} />

            {/* The Plane */}
            <OrigamiPlane position={[0, initialHeight, 0]} rotation={[0, 0, 0]} />
            <group ref={planeRef}>
                <OrigamiPlane position={[0, 0, 0]} rotation={[0, 0, 0]} />
            </group>

            {/* Trajectory */}
            <TrajectoryLine points={trajectoryPoints} />

            <OrbitControls
                enablePan={true}
                enableZoom={true}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.8}
                target={[10, 5, 0]} // Look slightly ahead
            />
        </>
    );
};

export const ProjectileMotion3D: React.FC<ProjectileMotion3DProps> = (props) => {
    return (
        <div className="w-full h-full min-h-[500px] bg-gradient-to-b from-blue-50 to-white rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Canvas camera={{ position: [0, 5, 15], fov: 50 }}>
                <SceneContent {...props} />
            </Canvas>
        </div>
    );
};
