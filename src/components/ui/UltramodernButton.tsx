import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface UltramodernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

export const UltramodernButton: React.FC<UltramodernButtonProps> = ({ children, className, ...props }) => {
    return (
        <motion.button
            className={cn(
                "relative px-8 py-4 rounded-full font-display font-bold text-lg tracking-wide overflow-hidden group bg-brand-black text-white shadow-lg",
                className
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            {...props as any}
        >
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-gray-900 to-brand-black z-0" />

            {/* Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shine" />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-3">
                {children}
            </span>
        </motion.button>
    );
};
