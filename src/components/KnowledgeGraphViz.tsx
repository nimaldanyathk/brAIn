import React, { useEffect, useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, useNodesState, useEdgesState, type Node, type Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';

const API_URL = "http://localhost:8000/api";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export const KnowledgeGraphViz: React.FC<{ highlightNodes?: string[] }> = ({ highlightNodes = [] }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [loading, setLoading] = useState(false);

    const fetchGraph = useCallback(async () => {
        setLoading(true);
        try {
            const studentId = localStorage.getItem('student_id') || 'demo_student_123';
            const res = await fetch(`${API_URL}/graph/${studentId}`);
            const data = await res.json();

            if (!data || !data.nodes) {
                console.error("Invalid graph data received", data);
                return;
            }

            // Highlighting Logic
            const isHighlighting = highlightNodes.length > 0;

            const layoutNodes = data.nodes.map((node: any, index: number) => {
                const isHighlighted = !isHighlighting || highlightNodes.includes(node.id);

                return {
                    ...node,
                    position: {
                        x: (index % 3) * 200 + 50,
                        y: Math.floor(index / 3) * 150 + 50
                    },
                    style: {
                        ...node.style,
                        opacity: isHighlighted ? 1 : 0.2,
                        filter: isHighlighted ? 'none' : 'grayscale(100%)',
                        border: isHighlighted ? node.style.border : '1px border #ccc',
                        transition: 'all 0.5s ease'
                    }
                };
            });

            const layoutEdges = data.edges.map((edge: any) => {
                const isHighlighted = !isHighlighting || (highlightNodes.includes(edge.source) && highlightNodes.includes(edge.target));
                return {
                    ...edge,
                    animated: isHighlighted,
                    style: {
                        ...edge.style,
                        opacity: isHighlighted ? 1 : 0.1,
                        stroke: isHighlighted ? edge.style.stroke : '#ccc'
                    }
                };
            });

            setNodes(layoutNodes);
            setEdges(layoutEdges);
        } catch (error) {
            console.error("Failed to fetch graph", error);
        } finally {
            setLoading(false);
        }
    }, [highlightNodes, setNodes, setEdges]);

    useEffect(() => {
        fetchGraph();
    }, [fetchGraph]);

    return (
        <div className="h-[500px] w-full border-2 border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden transition-all duration-500">
            {highlightNodes.length > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-yellow-300 px-3 py-1 text-xs font-black uppercase border border-black animate-pulse">
                    ⚠️ Mission Focus Active
                </div>
            )}

            <div className="absolute top-4 right-4 z-10">
                <Button size="sm" variant="ghost" onClick={fetchGraph} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
            >
                <Background color="#aaa" gap={16} />
                <Controls />
            </ReactFlow>
        </div>
    );
};
