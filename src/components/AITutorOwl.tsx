import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { X, Send, Book } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export type AITutorOwlEmotion = 'idle' | 'happy' | 'thinking' | 'warning';
export type AITutorOwlContext = 'physics' | 'math' | 'chemistry' | 'general';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'astra';
    isError?: boolean;
}

interface AITutorOwlProps {
    emotion?: AITutorOwlEmotion;
    size?: 'sm' | 'md' | 'lg';
    context?: AITutorOwlContext;
}

// --- Mascot Owl Character (Duolingo Style) ---
const OwlAvatar = ({ onClick, isOpen }: { onClick: () => void, isOpen: boolean }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    const controls = useAnimation();

    // Blinking Logic
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 200);
        }, 3000 + Math.random() * 2000); // Random blink interval
        return () => clearInterval(blinkInterval);
    }, []);

    // Entrance Animation
    useEffect(() => {
        controls.start({
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 70,
                damping: 12,
                delay: 0.5
            }
        });
    }, [controls]);

    return (
        <motion.div
            className="fixed bottom-8 right-8 z-50 cursor-pointer"
            initial={{ x: 200, y: 50, opacity: 0, scale: 0.5 }}
            animate={controls}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ display: isOpen ? 'none' : 'block' }}
        >
            {/* Breathing Animation */}
            <motion.div
                animate={{ scaleY: [1, 1.03, 1], y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
                <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Shadow */}
                    <ellipse cx="70" cy="130" rx="40" ry="6" fill="black" fillOpacity="0.2" />

                    {/* Feet */}
                    <path d="M55 125 L 45 135 L 65 135 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M85 125 L 75 135 L 95 135 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />

                    {/* Body - Plump Pear Shape */}
                    <path
                        d="M35 120 C 15 120, 10 70, 30 50 C 40 40, 100 40, 110 50 C 130 70, 125 120, 105 120 C 90 120, 50 120, 35 120 Z"
                        fill="#3b82f6"
                        stroke="#1d4ed8"
                        strokeWidth="3"
                    />

                    {/* Belly Patch */}
                    <path
                        d="M45 115 C 35 115, 30 80, 45 65 C 55 55, 85 55, 95 65 C 110 80, 105 115, 95 115 Z"
                        fill="#bfdbfe"
                    />

                    {/* Head - Integrated with Body but defined by features */}

                    {/* Eyes - Large and Expressive */}
                    <g transform="translate(0, -5)">
                        {/* Left Eye */}
                        <circle cx="50" cy="55" r="16" fill="white" stroke="#1d4ed8" strokeWidth="2" />
                        <motion.circle
                            cx="52"
                            cy="55"
                            r="6"
                            fill="#1e3a8a"
                            animate={isHovered ? { scaleY: 0.8, scaleX: 1.1 } : { scale: 1 }}
                        />
                        <circle cx="54" cy="53" r="2" fill="white" />

                        {/* Left Eyelid */}
                        <motion.path
                            d="M34 55 Q 50 75 66 55"
                            fill="#3b82f6"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: isBlinking ? 1 : 0 }}
                            style={{ originY: 0 }}
                        />

                        {/* Right Eye */}
                        <circle cx="90" cy="55" r="16" fill="white" stroke="#1d4ed8" strokeWidth="2" />
                        <motion.circle
                            cx="88"
                            cy="55"
                            r="6"
                            fill="#1e3a8a"
                            animate={isHovered ? { scaleY: 0.8, scaleX: 1.1 } : { scale: 1 }}
                        />
                        <circle cx="90" cy="53" r="2" fill="white" />

                        {/* Right Eyelid */}
                        <motion.path
                            d="M74 55 Q 90 75 106 55"
                            fill="#3b82f6"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: isBlinking ? 1 : 0 }}
                            style={{ originY: 0 }}
                        />
                    </g>

                    {/* Beak */}
                    <path d="M70 60 Q 60 75 70 80 Q 80 75 70 60" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />

                    {/* Wings / Hands */}

                    {/* Right Wing (Holding Book) */}
                    <g transform="translate(95, 80) rotate(-10)">
                        {/* The Book */}
                        <rect x="-5" y="-10" width="25" height="35" rx="2" fill="#7c2d12" stroke="#451a03" strokeWidth="1" />
                        <rect x="0" y="-5" width="15" height="25" fill="white" />
                        <path d="M2 0 L 13 0" stroke="black" strokeWidth="1" opacity="0.5" />
                        <path d="M2 5 L 13 5" stroke="black" strokeWidth="1" opacity="0.5" />

                        {/* The Wing wrapping around */}
                        <path d="M-15 -5 Q 5 -5 10 15 Q 5 30 -15 20" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
                    </g>

                    {/* Left Wing (Waving) */}
                    <motion.g
                        transform="translate(25, 80)"
                        animate={isHovered ? { rotate: [0, -20, 10, -20, 0] } : { rotate: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        style={{ originX: 20, originY: 0 }} // Pivot at shoulder
                    >
                        <path
                            d="M20 0 Q -10 10 -5 35 Q 10 40 25 20"
                            fill="#3b82f6"
                            stroke="#1d4ed8"
                            strokeWidth="2"
                        />
                    </motion.g>

                    {/* Graduation Cap */}
                    <g transform="translate(70, 25) rotate(-5)">
                        <path d="M-30 0 L 0 -10 L 30 0 L 0 10 Z" fill="#1f2937" stroke="black" strokeWidth="1" />
                        <rect x="-15" y="0" width="30" height="15" rx="5" fill="#1f2937" />
                        {/* Tassel */}
                        <path d="M0 0 L 20 15" stroke="#f59e0b" strokeWidth="2" />
                        <circle cx="20" cy="15" r="3" fill="#f59e0b" />
                    </g>

                </svg>
            </motion.div>
        </motion.div>
    );
};

export const AITutorOwl: React.FC<AITutorOwlProps> = ({ context = 'general' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    // Reset greeting when context changes
    useEffect(() => {
        setMessages([{
            id: Date.now().toString(),
            text: getGreeting(context),
            sender: 'astra'
        }]);
    }, [context]);

    function getGreeting(ctx: AITutorOwlContext) {
        switch (ctx) {
            case 'physics': return "Hoo-Hoo! Ready to explore the laws of the universe? Ask me about forces, energy, or circuits!";
            case 'math': return "Mathematics is the language of nature. Need help with angles or equations?";
            case 'chemistry': return "Welcome to the molecular level! Ask me about atoms, bonds, or elements.";
            default: return "Greetings Cadet! I'm Prof Owl. How can I assist your studies today?";
        }
    }

    const getSystemPrompt = (ctx: AITutorOwlContext) => {
        const basePrompt = "You are Prof Owl, a wise, slightly eccentric, but helpful AI tutor for students in a virtual STEM lab called 'brAIn'. You often use owl-related puns like 'Hoo-Hoo' or 'Let's fly through this'.";
        const formatting = "Use Markdown for formatting. Use bold for key terms. Use bullet points for lists. Keep answers concise (under 3 sentences) unless asked for detail.";

        switch (ctx) {
            case 'physics': return `${basePrompt} You specialize in Physics. Explain concepts using real-world examples (gravity, forces, electricity). ${formatting}`;
            case 'math': return `${basePrompt} You specialize in Mathematics. Help solve problems step-by-step and explain the logic clearly. Use LaTeX formatting for equations where necessary. ${formatting}`;
            case 'chemistry': return `${basePrompt} You specialize in Chemistry. Explain molecular structures, reactions, and periodic table elements in a fun way. ${formatting}`;
            default: return `${basePrompt} Answer general questions briefly and politely. ${formatting}`;
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        try {
            if (!genAI) {
                throw new Error("API Key not configured");
            }

            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            // Construct history for context (last 5 messages)
            const history = messages.slice(-5).map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: `System Instruction: ${getSystemPrompt(context)}` }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "Understood. I am Prof Owl, ready to help with " + context + "." }],
                    },
                    ...history
                ],
            });

            const result = await chat.sendMessage(userMsg.text);
            const response = await result.response;
            const text = response.text();

            const astraMsg: Message = { id: (Date.now() + 1).toString(), text: text, sender: 'astra' };
            setMessages(prev => [...prev, astraMsg]);

        } catch (error) {
            console.error("Gemini API Error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: !genAI ? "My brain link is missing (API Key). Please check configuration." : "I'm having trouble connecting to the mainframe. Please try again.",
                sender: 'astra',
                isError: true
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Mascot Owl Trigger */}
            <OwlAvatar onClick={() => setIsOpen(true)} isOpen={isOpen} />

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
                                <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white border-2 border-black">
                                    <Book className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-brand-black">Prof Owl</h3>
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
                                        "max-w-[85%] p-3 rounded-xl text-sm font-medium border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                                        msg.sender === 'user'
                                            ? "ml-auto bg-brand-blue text-white rounded-br-none"
                                            : msg.isError
                                                ? "mr-auto bg-red-100 text-red-800 rounded-bl-none border-red-500"
                                                : "mr-auto bg-gray-100 text-brand-black rounded-bl-none"
                                    )}
                                >
                                    {msg.sender === 'astra' && !msg.isError ? (
                                        <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-white prose-pre:p-2 prose-pre:rounded-lg">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
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
                                    placeholder={`Ask Prof Owl about ${context}...`}
                                    className="flex-1 bg-white border-2 border-black rounded-xl px-4 py-2 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none transition-all"
                                />
                                <Button type="submit" variant="primary" size="sm" className="rounded-xl px-3" disabled={isTyping}>
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
