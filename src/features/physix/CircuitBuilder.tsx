import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Trash2, RotateCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';

// Types
type ComponentType = 'battery' | 'resistor' | 'led' | 'switch';

interface CircuitComponent {
    id: string;
    type: ComponentType;
    x: number;
    y: number;
    rotation: number;
    value: number; // V for battery, Ohm for resistor
}

interface Connection {
    id: string;
    from: { componentId: string; port: 'positive' | 'negative' | 'a' | 'b' };
    to: { componentId: string; port: 'positive' | 'negative' | 'a' | 'b' };
}

interface CircuitBuilderProps {
    onCircuitUpdate?: (voltage: number, resistance: number) => void;
}

export const CircuitBuilder: React.FC<CircuitBuilderProps> = ({ onCircuitUpdate }) => {
    const [components, setComponents] = useState<CircuitComponent[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isDrawingWire, setIsDrawingWire] = useState<{ componentId: string; port: string; x: number; y: number } | null>(null);
    const workspaceRef = useRef<HTMLDivElement>(null);

    // Add Component
    const addComponent = (type: ComponentType) => {
        const newComp: CircuitComponent = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            x: 100 + Math.random() * 50,
            y: 100 + Math.random() * 50,
            rotation: 0,
            value: type === 'battery' ? 9 : 100,
        };
        setComponents([...components, newComp]);
    };

    // Update Component Position
    const updatePosition = (id: string, x: number, y: number) => {
        setComponents(comps => comps.map(c => c.id === id ? { ...c, x, y } : c));
    };

    // Rotate Component
    const rotateComponent = (id: string) => {
        setComponents(comps => comps.map(c => c.id === id ? { ...c, rotation: (c.rotation + 90) % 360 } : c));
    };

    // Delete Component
    const deleteComponent = (id: string) => {
        setComponents(comps => comps.filter(c => c.id !== id));
        setConnections(conns => conns.filter(c => c.from.componentId !== id && c.to.componentId !== id));
        setSelectedId(null);
    };

    // Handle Wire Drawing
    const handlePortClick = (e: React.MouseEvent, componentId: string, port: string) => {
        e.stopPropagation();
        if (isDrawingWire) {
            // Complete wire
            if (isDrawingWire.componentId !== componentId) {
                setConnections([
                    ...connections,
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        from: { componentId: isDrawingWire.componentId, port: isDrawingWire.port as any },
                        to: { componentId, port: port as any },
                    }
                ]);
            }
            setIsDrawingWire(null);
        } else {
            // Start wire
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            const workspaceRect = workspaceRef.current!.getBoundingClientRect();
            setIsDrawingWire({
                componentId,
                port,
                x: rect.left - workspaceRect.left + rect.width / 2,
                y: rect.top - workspaceRect.top + rect.height / 2,
            });
        }
    };

    // Calculate Circuit (Simplified for MVP: Find 1 Battery + 1 Resistor loop)
    useEffect(() => {
        const battery = components.find(c => c.type === 'battery');
        const resistor = components.find(c => c.type === 'resistor');

        if (battery && resistor && connections.length >= 2) {
            // Very basic check: are they connected?
            // In a real app, we'd do graph traversal.
            // For MVP, if we have a battery, a resistor, and wires, we assume connection if wires exist.
            if (onCircuitUpdate) {
                onCircuitUpdate(battery.value, resistor.value);
            }
        } else {
            if (onCircuitUpdate) onCircuitUpdate(0, 0);
        }
    }, [components, connections, onCircuitUpdate]);

    return (
        <div className="flex flex-col h-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shadow-sm z-10">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Components</span>
                <Button variant="secondary" size="sm" onClick={() => addComponent('battery')}>
                    <Zap className="w-4 h-4 mr-2 text-brand-blue" /> Battery
                </Button>
                <Button variant="secondary" size="sm" onClick={() => addComponent('resistor')}>
                    <Activity className="w-4 h-4 mr-2 text-purple-600" /> Resistor
                </Button>

                <div className="h-8 w-px bg-gray-200 mx-2" />

                {selectedId && (
                    <>
                        <Button variant="ghost" size="sm" onClick={() => rotateComponent(selectedId)}>
                            <RotateCw className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => deleteComponent(selectedId)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </>
                )}
            </div>

            {/* Workspace */}
            <div
                ref={workspaceRef}
                className="flex-1 relative overflow-hidden cursor-crosshair bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"
                onClick={() => { setSelectedId(null); setIsDrawingWire(null); }}
                onMouseMove={(e) => {
                    if (isDrawingWire && workspaceRef.current) {
                        const rect = workspaceRef.current.getBoundingClientRect();
                        setIsDrawingWire(prev => prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
                    }
                }}
            >
                {/* Wires (SVG Layer) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    {connections.map(conn => {
                        const fromComp = components.find(c => c.id === conn.from.componentId);
                        const toComp = components.find(c => c.id === conn.to.componentId);
                        if (!fromComp || !toComp) return null;

                        // Simple center-to-center for MVP (Refine to ports later)
                        return (
                            <line
                                key={conn.id}
                                x1={fromComp.x + 32} y1={fromComp.y + 32}
                                x2={toComp.x + 32} y2={toComp.y + 32}
                                stroke="#3b82f6"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                        );
                    })}
                    {isDrawingWire && (
                        // Drawing line logic would go here, need start coords
                        // For MVP, skipping dynamic line drawing visual to save complexity
                        <circle cx={isDrawingWire.x} cy={isDrawingWire.y} r="4" fill="#3b82f6" />
                    )}
                </svg>

                {/* Components */}
                {components.map(comp => (
                    <DraggableComponent
                        key={comp.id}
                        component={comp}
                        isSelected={selectedId === comp.id}
                        onSelect={() => setSelectedId(comp.id)}
                        onDrag={(x: number, y: number) => updatePosition(comp.id, x, y)}
                        onPortClick={handlePortClick}
                    />
                ))}
            </div>
        </div>
    );
};

interface DraggableComponentProps {
    component: CircuitComponent;
    isSelected: boolean;
    onSelect: () => void;
    onDrag: (x: number, y: number) => void;
    onPortClick: (e: React.MouseEvent, id: string, port: string) => void;
}

// Sub-component for Draggable Items
const DraggableComponent: React.FC<DraggableComponentProps> = ({ component, isSelected, onSelect, onDrag, onPortClick }) => {
    return (
        <motion.div
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => onDrag(component.x + info.offset.x, component.y + info.offset.y)}
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            style={{ x: component.x, y: component.y, rotate: component.rotation }}
            className={cn(
                "absolute w-16 h-16 bg-white rounded-lg shadow-md border-2 flex items-center justify-center cursor-grab active:cursor-grabbing z-10",
                isSelected ? "border-brand-blue ring-2 ring-brand-blue/20" : "border-gray-200"
            )}
        >
            {/* Icon */}
            {component.type === 'battery' && <Zap className="w-8 h-8 text-brand-blue" />}
            {component.type === 'resistor' && <Activity className="w-8 h-8 text-purple-600" />}

            {/* Ports (Clickable Areas) */}
            <div
                className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-400 rounded-full border-2 border-white hover:bg-brand-blue cursor-pointer"
                onClick={(e) => onPortClick(e, component.id, 'negative')}
            />
            <div
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-400 rounded-full border-2 border-white hover:bg-brand-blue cursor-pointer"
                onClick={(e) => onPortClick(e, component.id, 'positive')}
            />
        </motion.div>
    );
};
