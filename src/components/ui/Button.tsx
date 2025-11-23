import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    children,
    ...props
}) => {
    const baseStyles = "relative font-sans font-bold flex items-center justify-center gap-2 tactile-button";

    const variants = {
        primary: "bg-brand-black text-white hover:bg-gray-800",
        secondary: "bg-white text-brand-black hover:bg-gray-50",
        outline: "bg-transparent border-2 border-black text-brand-black hover:bg-gray-100",
        ghost: "bg-transparent border-transparent shadow-none hover:bg-gray-100 text-gray-600",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm rounded-lg",
        md: "px-6 py-3 text-base rounded-xl",
        lg: "px-8 py-4 text-lg rounded-2xl",
    };

    return (
        <motion.button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children as React.ReactNode}
        </motion.button>
    );
};
