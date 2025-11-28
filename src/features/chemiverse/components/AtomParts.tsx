import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Trail } from '@react-three/drei';
import * as THREE from 'three';

// --- Visual Components ---

export const Nucleus = ({ protons, neutrons, color }: { protons: number, neutrons: number, color: string }) => {
  const group = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    const p = [];
    const radius = Math.pow(protons + neutrons, 1/3) * 0.15;
    
    for (let i = 0; i < protons; i++) {
      const phi = Math.acos(-1 + (2 * i) / protons);
      const theta = Math.sqrt(protons * Math.PI) * phi;
      p.push({ 
        type: 'proton', 
        pos: new THREE.Vector3(
          radius * Math.cos(theta) * Math.sin(phi) + (Math.random()-0.5)*0.1,
          radius * Math.sin(theta) * Math.sin(phi) + (Math.random()-0.5)*0.1,
          radius * Math.cos(phi) + (Math.random()-0.5)*0.1
        ) 
      });
    }
    for (let i = 0; i < neutrons; i++) {
        const phi = Math.acos(-1 + (2 * i) / neutrons);
        const theta = Math.sqrt(neutrons * Math.PI) * phi;
        p.push({ 
          type: 'neutron', 
          pos: new THREE.Vector3(
            radius * Math.cos(theta) * Math.sin(phi) + (Math.random()-0.5)*0.1,
            radius * Math.sin(theta) * Math.sin(phi) + (Math.random()-0.5)*0.1,
            radius * Math.cos(phi) + (Math.random()-0.5)*0.1
          ) 
        });
      }
    return p;
  }, [protons, neutrons]);

  useFrame((state) => {
    if (group.current) {
        group.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.05;
        group.current.rotation.y = Math.cos(state.clock.getElapsedTime() * 0.8) * 0.05;
    }
  });

  return (
    <group ref={group}>
      {particles.map((particle, i) => (
        <Sphere key={i} position={particle.pos} args={[0.12, 16, 16]}>
          <meshStandardMaterial 
            color={particle.type === 'proton' ? '#ef4444' : '#9ca3af'} 
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      ))}
      <pointLight intensity={1} distance={3} color='#ef4444' />
      <mesh>
        <sphereGeometry args={[Math.pow(protons+neutrons, 1/3)*0.2 + 0.2, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

export const ElectronShell = ({ radius, electrons, speed }: { radius: number, electrons: number, speed: number }) => {
    return (
        <group>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
                <meshBasicMaterial color="#3b82f6" opacity={0.3} transparent side={THREE.DoubleSide} />
            </mesh>
            
            {Array.from({ length: electrons }).map((_, i) => {
                const offset = (i / electrons) * Math.PI * 2;
                return <Electron key={i} radius={radius} speed={speed} offset={offset} />;
            })}
        </group>
    );
};

export const Electron = ({ radius, speed, offset }: { radius: number, speed: number, offset: number }) => {
    const ref = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if (ref.current) {
            const t = state.clock.getElapsedTime() * speed + offset;
            ref.current.position.x = Math.cos(t) * radius;
            ref.current.position.z = Math.sin(t) * radius;
        }
    });

    return (
        <group ref={ref}>
            <Sphere args={[0.08, 16, 16]}>
                <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={1} />
            </Sphere>
            <Trail width={0.5} length={4} color="#3b82f6" attenuation={(t) => t * t} />
        </group>
    );
};

export const QuantumOrbital = ({ type, count }: { type: string, count: number }) => {
    const points = useMemo(() => {
        const pts = [];
        const numPoints = 1500 * count;
        
        for (let i = 0; i < numPoints; i++) {
            let x=0, y=0, z=0;
            if (type.includes('s')) {
                const r = Math.random() * 2 + 0.5;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                x = r * Math.sin(phi) * Math.cos(theta);
                y = r * Math.sin(phi) * Math.sin(theta);
                z = r * Math.cos(phi);
            } else if (type.includes('p')) {
                const r = Math.random() * 3 + 0.5;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                if (Math.random() > Math.abs(Math.cos(phi))) continue;
                x = r * Math.sin(phi) * Math.cos(theta);
                y = r * Math.sin(phi) * Math.sin(theta);
                z = r * Math.cos(phi);
            }
            pts.push(x, y, z);
        }
        return new Float32Array(pts);
    }, [type, count]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[points, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.03} color={type.includes('s') ? '#9333ea' : '#2563eb'} transparent opacity={0.4} sizeAttenuation blending={THREE.NormalBlending} />
        </points>
    );
};
