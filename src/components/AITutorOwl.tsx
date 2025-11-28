import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { X, Send, Brain, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { gemini } from '../lib/gemini';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AITutorOwlProps {
    context?: 'physics' | 'math' | 'chemistry' | 'general';
}

export const AITutorOwl: React.FC<AITutorOwlProps> = ({ context = 'general' }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [blink, setBlink] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [hasLanded, setHasLanded] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: `Hoot! I'm Professor Owl. Ask me anything about ${context}!` }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll Logic for "Scroll Mask" effect
    const { scrollY } = useScroll();
    // Move up as we scroll down. 
    // At scrollY=0, y=0. At scrollY=500, y=-500.
    // This makes the fixed element behave like it's absolute positioned at the top.
    const scrollYPos = useTransform(scrollY, [0, 1000], [0, -1000]);

    // Blinking logic
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 200);
        }, 4000);
        return () => clearInterval(blinkInterval);
    }, []);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = inputValue;
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);

        try {
            const response = await gemini.chat(userMessage, context);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Hoot! My feathers are ruffled. I couldn't reach the library. Try again?" }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Owl Character Container - Wrapped in Scroll Transform */}
            <motion.div
                style={{ y: isOpen ? 0 : scrollYPos }} // Only scroll away if chat is CLOSED
                className={`fixed bottom-0 right-0 z-50 pointer-events-none ${isOpen && !isMinimized ? 'hidden' : 'block'}`}
            >
                <motion.div
                    initial={{ x: -window.innerWidth, y: -200, scale: 0.5 }}
                    animate={{ 
                        x: 0, 
                        y: 0, 
                        scale: 1,
                        transition: { 
                            type: "spring", 
                            stiffness: 40, 
                            damping: 15, 
                            mass: 1,
                            duration: 2.5
                        }
                    }}
                    onAnimationComplete={() => setHasLanded(true)}
                >
                    {/* Flight Path Animation Wrapper */}
                    <motion.div
                        animate={{
                            y: hasLanded ? 0 : [0, -20, 0, -15, 0],
                            rotate: hasLanded ? 0 : [0, 5, -5, 2, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: hasLanded ? 0 : Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <div 
                            className="relative w-48 h-48 sm:w-64 sm:h-64 pointer-events-auto cursor-pointer"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={() => setIsOpen(true)}
                        >
                            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
                                {/* Tree Branch (Only visible when landed or near end) */}
                                <motion.path
                                    d="M200 180 C 150 180, 100 170, 50 190"
                                    stroke="#4b5563"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1, delay: 2 }}
                                />
                                
                                {/* Owl Group */}
                                <motion.g
                                    initial={{ y: -50 }}
                                    animate={{ y: 0 }}
                                    transition={{ type: "spring", bounce: 0.5, delay: 2.2 }}
                                >
                                    {/* Body */}
                                    <motion.ellipse 
                                        cx="100" cy="100" rx="40" ry="50" 
                                        fill="white" stroke="#111827" strokeWidth="3"
                                        animate={{ 
                                            ry: isHovered ? 52 : 50,
                                            rotate: isHovered ? [0, -2, 2, 0] : 0 
                                        }}
                                    />
                                    
                                    {/* Belly Feathers */}
                                    <path d="M80 110 Q100 120 120 110" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                                    <path d="M85 120 Q100 130 115 120" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                                    <path d="M90 130 Q100 135 110 130" fill="none" stroke="#e5e7eb" strokeWidth="2" />

                                    {/* Wings (Flapping during flight) */}
                                    <motion.path 
                                        d="M60 100 Q 40 120 60 140" 
                                        fill="white" stroke="#111827" strokeWidth="3"
                                        animate={{ 
                                            d: !hasLanded 
                                                ? ["M60 100 Q 20 80 60 60", "M60 100 Q 40 120 60 140"] 
                                                : isHovered ? "M60 90 Q 30 110 60 130" : "M60 100 Q 40 120 60 140" 
                                        }}
                                        transition={{
                                            duration: !hasLanded ? 0.3 : 0.5,
                                            repeat: !hasLanded ? Infinity : 0,
                                            repeatType: "reverse"
                                        }}
                                    />
                                    <motion.path 
                                        d="M140 100 Q 160 120 140 140" 
                                        fill="white" stroke="#111827" strokeWidth="3"
                                        animate={{ 
                                            d: !hasLanded 
                                                ? ["M140 100 Q 180 80 140 60", "M140 100 Q 160 120 140 140"] 
                                                : isHovered ? "M140 90 Q 170 110 140 130" : "M140 100 Q 160 120 140 140" 
                                        }}
                                        transition={{
                                            duration: !hasLanded ? 0.3 : 0.5,
                                            repeat: !hasLanded ? Infinity : 0,
                                            repeatType: "reverse"
                                        }}
                                    />

                                    {/* Head/Face */}
                                    <circle cx="85" cy="80" r="12" fill="white" stroke="#111827" strokeWidth="2" />
                                    <circle cx="115" cy="80" r="12" fill="white" stroke="#111827" strokeWidth="2" />
                                    
                                    {/* Eyes (Pupils) */}
                                    <motion.circle 
                                        cx="85" cy="80" r="4" fill="#111827" 
                                        animate={{ scaleY: blink ? 0.1 : 1 }}
                                    />
                                    <motion.circle 
                                        cx="115" cy="80" r="4" fill="#111827" 
                                        animate={{ scaleY: blink ? 0.1 : 1 }}
                                    />

                                    {/* Glasses */}
                                    <path d="M73 80 A 12 12 0 1 1 97 80" fill="none" stroke="#111827" strokeWidth="1" />
                                    <path d="M103 80 A 12 12 0 1 1 127 80" fill="none" stroke="#111827" strokeWidth="1" />
                                    <line x1="97" y1="80" x2="103" y2="80" stroke="#111827" strokeWidth="1" />

                                    {/* Beak */}
                                    <path d="M100 90 L 95 98 L 105 98 Z" fill="#fbbf24" stroke="#111827" strokeWidth="1" />

                                    {/* Graduation Cap (Professor Look) */}
                                    <motion.g
                                        animate={{ rotate: isHovered ? 5 : 0 }}
                                        style={{ originX: "100px", originY: "60px" }}
                                    >
                                        <path d="M70 60 L 100 45 L 130 60 L 100 75 Z" fill="#111827" stroke="#111827" strokeWidth="2" />
                                        <path d="M130 60 L 130 70" fill="none" stroke="#fbbf24" strokeWidth="2" />
                                        <circle cx="130" cy="72" r="2" fill="#fbbf24" />
                                    </motion.g>

                                    
                                    {/* Legs/Talons */}
                                    <path d="M90 145 L 90 155 L 85 160" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
                                    <path d="M90 155 L 95 160" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
                                    <path d="M110 145 L 110 155 L 105 160" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
                                    <path d="M110 155 L 115 160" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />

                                    {/* Book */}
                                    <motion.g transform="translate(120, 120) scale(0.6)">
                                        <rect x="0" y="0" width="30" height="40" fill="#3b82f6" stroke="#111827" strokeWidth="2" />
                                        <path d="M5 5 L 25 5" stroke="white" strokeWidth="2" />
                                        <path d="M5 15 L 25 15" stroke="white" strokeWidth="2" />
                                    </motion.g>
                                </motion.g>
                                
                                {/* Speech Bubble (On Hover) */}
                                <motion.g
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: isHovered && hasLanded ? 1 : 0, scale: isHovered && hasLanded ? 1 : 0 }}
                                    transition={{ type: "spring" }}
                                >
                                    <path d="M140 50 Q 140 20 170 20 L 190 20 Q 200 20 200 30 L 200 60 Q 200 70 190 70 L 160 70 L 140 80 Z" fill="white" stroke="#111827" strokeWidth="2" />
                                    <text x="155" y="50" fontSize="10" fontFamily="sans-serif" fill="#111827">Hoot! Click</text>
                                    <text x="155" y="62" fontSize="10" fontFamily="sans-serif" fill="#111827">to chat!</text>
                                </motion.g>
                            </svg>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Chat Interface (Expanded) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            height: isMinimized ? 'auto' : '600px',
                            width: isMinimized ? '300px' : '400px'
                        }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-4 right-4 z-50 bg-white rounded-2xl shadow-2xl border-2 border-black flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-brand-black text-white p-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-black">
                                    <Brain className="w-5 h-5 text-brand-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Professor Owl</h3>
                                    <p className="text-xs text-gray-400 capitalize">{context} Tutor</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="p-1 hover:bg-gray-800 rounded transition-colors"
                                >
                                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                                </button>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-red-500 rounded transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        {!isMinimized && (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                    {messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] p-3 rounded-xl text-sm ${
                                                    msg.role === 'user'
                                                        ? 'bg-brand-blue text-white rounded-br-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black'
                                                        : 'bg-white text-brand-black rounded-bl-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] border border-gray-200'
                                                }`}
                                            >
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-white p-3 rounded-xl rounded-bl-none shadow-sm border border-gray-200">
                                                <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-4 bg-white border-t-2 border-black">
                                    <form onSubmit={handleSend} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder={`Ask about ${context}...`}
                                            className="flex-1 bg-gray-100 border-2 border-transparent focus:border-brand-blue rounded-xl px-4 py-2 text-sm font-medium focus:outline-none transition-all"
                                        />
                                        <button 
                                            type="submit" 
                                            disabled={isTyping || !inputValue.trim()}
                                            className="bg-brand-black text-white p-2 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

