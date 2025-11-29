import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, ArrowRight } from 'lucide-react';
import { UltramodernButton } from './ui/UltramodernButton';

export interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number; // Index of correct option
    explanation: string;
}

interface QuizInterfaceProps {
    questions: Question[];
    onComplete: (score: number) => void;
    onClose: () => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({ questions, onComplete, onClose }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionClick = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);

        if (index === currentQuestion.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
            onComplete(score + (selectedOption === currentQuestion.correctAnswer ? 0 : 0)); // Score already updated
        }
    };

    if (showResult) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6"
            >
                <div className="relative">
                    <Trophy className="w-24 h-24 text-accent-yellow fill-accent-yellow animate-bounce" />
                    <div className="absolute inset-0 bg-accent-yellow/20 blur-3xl rounded-full" />
                </div>

                <div>
                    <h2 className="text-3xl font-display font-black text-brand-black mb-2">Quiz Complete!</h2>
                    <p className="text-gray-500 font-medium">You scored</p>
                    <div className="text-6xl font-black text-brand-blue my-4">
                        {score} / {questions.length}
                    </div>
                </div>

                <div className="flex gap-4">
                    <UltramodernButton onClick={onClose}>
                        Close
                    </UltramodernButton>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Progress Bar */}
            <div className="h-2 bg-gray-100 w-full">
                <motion.div
                    className="h-full bg-brand-blue"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold text-brand-black leading-relaxed">
                            {currentQuestion.text}
                        </h3>

                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => {
                                let buttonClass = "w-full p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 ";

                                if (isAnswered) {
                                    if (index === currentQuestion.correctAnswer) {
                                        buttonClass += "bg-green-100 border-green-500 text-green-800";
                                    } else if (index === selectedOption) {
                                        buttonClass += "bg-red-100 border-red-500 text-red-800";
                                    } else {
                                        buttonClass += "bg-gray-50 border-gray-200 text-gray-400 opacity-50";
                                    }
                                } else {
                                    buttonClass += "bg-white border-black hover:bg-brand-blue hover:text-white hover:border-brand-blue shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]";
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleOptionClick(index)}
                                        disabled={isAnswered}
                                        className={buttonClass}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {isAnswered && index === currentQuestion.correctAnswer && (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            )}
                                            {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && (
                                                <XCircle className="w-5 h-5 text-red-600" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {isAnswered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100 text-sm text-blue-800"
                            >
                                <span className="font-bold block mb-1">Explanation:</span>
                                {currentQuestion.explanation}
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 border-t-2 border-black bg-gray-50 flex justify-end">
                <UltramodernButton
                    onClick={handleNext}
                    disabled={!isAnswered}
                    className={!isAnswered ? "opacity-50 cursor-not-allowed" : ""}
                >
                    {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"} <ArrowRight className="w-4 h-4 ml-2" />
                </UltramodernButton>
            </div>
        </div>
    );
};
