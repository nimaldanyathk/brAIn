import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
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
            case 'physics': return "Ready to explore the laws of the universe? Ask me about forces, energy, or circuits!";
            case 'math': return "Mathematics is the language of nature. Need help with angles or equations?";
            case 'chemistry': return "Welcome to the molecular level! Ask me about atoms, bonds, or elements.";
            default: return "Hello Cadet! I'm Astra. How can I help you today?";
        }
    }

    const getSystemPrompt = (ctx: AITutorOwlContext) => {
        const basePrompt = "You are Astra, a helpful, enthusiastic AI tutor for students in a virtual STEM lab called 'brAIn'.";
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
                        parts: [{ text: "Understood. I am Astra, ready to help with " + context + "." }],
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
                                    placeholder={`Ask about ${context}...`}
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
