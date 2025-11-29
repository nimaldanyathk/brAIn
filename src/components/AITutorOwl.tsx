import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { X, Send, Book, BrainCircuit } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { QuizInterface, type Question } from './QuizInterface';

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

// --- "Simple & Nice" Mascot Owl ---
const OwlAvatar = ({ onClick, isOpen }: { onClick: () => void, isOpen: boolean }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    const controls = useAnimation();

    // Blinking Logic
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 200);
        }, 3500);
        return () => clearInterval(blinkInterval);
    }, []);

    // Entrance Animation - Smooth Bounce
    useEffect(() => {
        controls.start({
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 90,
                damping: 14,
                delay: 0.3
            }
        });
    }, [controls]);

    return (
        <motion.div
            className="fixed bottom-8 right-8 z-50 cursor-pointer"
            initial={{ x: 150, y: 20, opacity: 0, scale: 0.8 }}
            animate={controls}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ display: isOpen ? 'none' : 'block' }}
        >
            {/* Gentle Float */}
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Soft Shadow */}
                    <ellipse cx="60" cy="110" rx="35" ry="5" fill="black" fillOpacity="0.15" />

                    {/* Body - Clean Rounded Shape */}
                    <path
                        d="M60 105 C 35 105, 25 75, 25 60 C 25 35, 40 20, 60 20 C 80 20, 95 35, 95 60 C 95 75, 85 105, 60 105 Z"
                        fill="#3b82f6"
                    />

                    {/* Belly - Soft Oval */}
                    <ellipse cx="60" cy="75" rx="25" ry="22" fill="#bfdbfe" />

                    {/* Eyes - Friendly & Bright */}
                    <g transform="translate(0, -2)">
                        {/* Left Eye */}
                        <circle cx="48" cy="50" r="14" fill="white" />
                        <circle cx="48" cy="50" r="5" fill="#1e3a8a" />
                        <circle cx="50" cy="48" r="2" fill="white" />

                        {/* Left Eyelid */}
                        <motion.path
                            d="M34 50 Q 48 64 62 50"
                            fill="#3b82f6"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: isBlinking ? 1 : 0 }}
                            style={{ originY: 0 }}
                        />

                        {/* Right Eye */}
                        <circle cx="72" cy="50" r="14" fill="white" />
                        <circle cx="72" cy="50" r="5" fill="#1e3a8a" />
                        <circle cx="74" cy="48" r="2" fill="white" />

                        {/* Right Eyelid */}
                        <motion.path
                            d="M58 50 Q 72 64 86 50"
                            fill="#3b82f6"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: isBlinking ? 1 : 0 }}
                            style={{ originY: 0 }}
                        />
                    </g>

                    {/* Beak - Simple Rounded Triangle */}
                    <path d="M60 58 Q 55 65 60 68 Q 65 65 60 58" fill="#f59e0b" />

                    {/* Right Wing (Holding Book) */}
                    <path d="M85 60 Q 98 60 92 80 Q 80 85 75 75" fill="#3b82f6" />
                    {/* Book */}
                    <rect x="78" y="65" width="18" height="24" rx="2" fill="#7c2d12" transform="rotate(-10, 87, 77)" />
                    <rect x="80" y="67" width="14" height="20" rx="1" fill="white" transform="rotate(-10, 87, 77)" />

                    {/* Left Wing (Waving) */}
                    <motion.g
                        transform="translate(25, 65)"
                        animate={isHovered ? { rotate: [0, -25, 0, -25, 0] } : { rotate: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        style={{ originX: 10, originY: 5 }}
                    >
                        <path d="M10 0 Q -5 10 0 25 Q 15 25 20 10" fill="#3b82f6" />
                    </motion.g>

                    {/* Feet - Simple Nubs */}
                    <path d="M50 102 Q 45 110 55 110 Q 60 105 55 102" fill="#f59e0b" />
                    <path d="M70 102 Q 65 110 75 110 Q 80 105 75 102" fill="#f59e0b" />

                    {/* Cap - Clean Icon Style */}
                    <g transform="translate(60, 15) rotate(-5)">
                        <rect x="-20" y="0" width="40" height="4" fill="#1f2937" rx="2" />
                        <rect x="-12" y="-8" width="24" height="10" fill="#1f2937" rx="2" />
                        <path d="M0 -8 L 15 5" stroke="#f59e0b" strokeWidth="1.5" />
                        <circle cx="15" cy="5" r="2" fill="#f59e0b" />
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

    // Quiz State
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [isQuizSetup, setIsQuizSetup] = useState(false); // New: Setup Mode
    const [quizTopic, setQuizTopic] = useState(""); // New: Topic Input
    const [quizCount, setQuizCount] = useState(3); // New: Question Count
    const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
    const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

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
        setQuizTopic(context.charAt(0).toUpperCase() + context.slice(1)); // Default topic
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

    const handleQuizSetup = () => {
        setIsQuizSetup(true);
        setIsQuizMode(true);
    };

    const startQuiz = async () => {
        setIsQuizSetup(false);
        setIsLoadingQuiz(true);

        try {
            if (!genAI) throw new Error("API Key missing");
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            const prompt = `Generate ${quizCount} multiple-choice questions about ${quizTopic} for a student.
            Return ONLY a JSON array with this structure:
            [{ "id": 1, "text": "Question?", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "Why A is correct" }]`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean up code blocks if present
            const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const questions = JSON.parse(jsonString);

            setQuizQuestions(questions);
        } catch (error) {
            console.error("Quiz Error:", error);
            setIsQuizMode(false);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                text: "Hoo-no! I couldn't generate a quiz right now. Let's stick to chatting.",
                sender: 'astra',
                isError: true
            }]);
        } finally {
            setIsLoadingQuiz(false);
        }
    };

    return (
        <>
            {/* Simple & Nice Owl Trigger */}
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
                            <div className="flex gap-2">
                                {!isQuizMode && (
                                    <Button variant="ghost" size="sm" onClick={handleQuizSetup} title="Start Quiz">
                                        <BrainCircuit className="w-5 h-5 text-brand-blue" />
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-hidden bg-white relative">
                            {isQuizMode ? (
                                isQuizSetup ? (
                                    // Quiz Setup Form
                                    <div className="flex flex-col items-center justify-center h-full p-6 space-y-6">
                                        <div className="text-center space-y-2">
                                            <BrainCircuit className="w-16 h-16 text-brand-blue mx-auto mb-2" />
                                            <h2 className="text-2xl font-black text-brand-black">Quiz Setup</h2>
                                            <p className="text-sm text-gray-500 font-medium">Customize your challenge!</p>
                                        </div>

                                        <div className="w-full space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-gray-400">Topic</label>
                                                <input
                                                    type="text"
                                                    value={quizTopic}
                                                    onChange={(e) => setQuizTopic(e.target.value)}
                                                    className="w-full border-2 border-black rounded-xl px-4 py-2 font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-gray-400">Questions: {quizCount}</label>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="10"
                                                    value={quizCount}
                                                    onChange={(e) => setQuizCount(parseInt(e.target.value))}
                                                    className="w-full accent-brand-blue h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                />
                                                <div className="flex justify-between text-xs font-bold text-gray-400">
                                                    <span>1</span>
                                                    <span>5</span>
                                                    <span>10</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 w-full">
                                            <Button variant="ghost" onClick={() => setIsQuizMode(false)} className="flex-1">
                                                Cancel
                                            </Button>
                                            <Button variant="primary" onClick={startQuiz} className="flex-1">
                                                Start Quiz
                                            </Button>
                                        </div>
                                    </div>
                                ) : isLoadingQuiz ? (
                                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                                        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
                                        <p className="font-bold text-brand-black animate-pulse">Generating Quiz...</p>
                                    </div>
                                ) : (
                                    <QuizInterface
                                        questions={quizQuestions}
                                        onComplete={(score) => {
                                            // TODO: Award XP
                                            console.log("Quiz Score:", score);
                                        }}
                                        onClose={() => setIsQuizMode(false)}
                                    />
                                )
                            ) : (
                                <>
                                    <div className="absolute inset-0 overflow-y-auto p-4 space-y-4">
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
                                </>
                            )}
                        </div>

                        {/* Input Area (Only show in Chat Mode) */}
                        {!isQuizMode && (
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
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
