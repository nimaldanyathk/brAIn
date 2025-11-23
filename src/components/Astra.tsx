import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

export type AstraEmotion = 'idle' | 'happy' | 'thinking' | 'warning';
export type AstraContext = 'physics' | 'math' | 'chemistry' | 'general';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'astra';
}

interface AstraProps {
    emotion?: AstraEmotion;
    size?: 'sm' | 'md' | 'lg';
    context?: AstraContext;
}

export const Astra: React.FC<AstraProps> = ({ context = 'general' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: getGreeting(context), sender: 'astra' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Reset greeting when context changes
    useEffect(() => {
        setMessages([{ id: Date.now().toString(), text: getGreeting(context), sender: 'astra' }]);
    }, [context]);

    function getGreeting(ctx: AstraContext) {
        switch (ctx) {
            case 'physics': return "Ready to explore the laws of the universe? Ask me about forces, energy, or circuits!";
            case 'math': return "Mathematics is the language of nature. Need help with angles or equations?";
            case 'chemistry': return "Welcome to the molecular level! Ask me about atoms, bonds, or elements.";
            default: return "Hello Cadet! I'm Astra. How can I help you today?";
        }
    }

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI Response based on Context
        setTimeout(() => {
            const responseText = generateResponse(userMsg.text, context);
            const astraMsg: Message = { id: (Date.now() + 1).toString(), text: responseText, sender: 'astra' };
            setMessages(prev => [...prev, astraMsg]);
            setIsTyping(false);
        }, 1500);
    };

    function generateResponse(input: string, ctx: AstraContext): string {
        const lowerInput = input.toLowerCase();

        if (ctx === 'physics') {
            if (lowerInput.includes('ohm')) return "Ohm's Law (V = I × R) relates Voltage, Current, and Resistance.";
            if (lowerInput.includes('electron')) return "Electrons are negatively charged particles that flow to create current.";
            if (lowerInput.includes('circuit')) return "A circuit is a closed loop that allows electrons to flow.";
        }

        if (ctx === 'math') {
            if (lowerInput.includes('sine') || lowerInput.includes('sin')) return "Sine is the ratio of the opposite side to the hypotenuse (Opposite/Hypotenuse). On the unit circle, it's the Y-coordinate.";
            if (lowerInput.includes('cosine') || lowerInput.includes('cos')) return "Cosine is the ratio of the adjacent side to the hypotenuse (Adjacent/Hypotenuse). On the unit circle, it's the X-coordinate.";
            if (lowerInput.includes('angle')) return "Angles measure rotation. 360 degrees make a full circle!";
        }

        if (ctx === 'chemistry') {
            if (lowerInput.includes('water') || lowerInput.includes('h2o')) return "Water consists of one oxygen atom bonded to two hydrogen atoms. It's essential for life!";
            if (lowerInput.includes('bond')) return "Chemical bonds hold atoms together. Covalent bonds involve sharing electrons.";
            if (lowerInput.includes('atom')) return "Atoms are the building blocks of matter, made of protons, neutrons, and electrons.";
        }

        return "That's a great question! I'm still learning, but try asking about the specific concepts in this experiment.";
    }

    return (
        <>
            {/* Floating Trigger */}
            <motion.div
                className="fixed bottom-8 right-8 z-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
            >
                <button
                    className={cn(
                        "w-16 h-16 bg-brand-black text-white rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                        isOpen && "hidden"
                    )}
                    onClick={() => setIsOpen(true)}
                >
                    <div className="relative">
                        <Sparkles className="w-8 h-8 animate-pulse" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
                    </div>
                </button>
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-8 right-8 z-50 w-96 h-[500px] flex flex-col bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b-2 border-black flex items-center justify-between bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-black flex items-center justify-center text-white border-2 border-black">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-brand-black">Astra AI</h3>
                                    <p className="text-xs text-brand-blue font-bold flex items-center gap-1 uppercase tracking-wider">
                                        <span className="w-2 h-2 bg-green-400 rounded-full border border-black animate-pulse" /> Online
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "max-w-[80%] p-3 rounded-xl text-sm font-medium border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                                        msg.sender === 'user'
                                            ? "ml-auto bg-brand-blue text-white rounded-br-none"
                                            : "mr-auto bg-gray-100 text-brand-black rounded-bl-none"
                                    )}
                                >
                                    {msg.text}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="mr-auto bg-gray-100 p-3 rounded-xl rounded-bl-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-gray-50 border-t-2 border-black">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={`Ask about ${context}...`}
                                    className="flex-1 bg-white border-2 border-black rounded-xl px-4 py-2 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none transition-all"
                                />
                                <Button type="submit" variant="primary" size="sm" className="rounded-xl px-3">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
