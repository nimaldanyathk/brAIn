import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLMotionProps<"div"> {
    hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
    className,
    children,
    hoverEffect = false,
    ...props
}) => {
    return (
        <motion.div
            whileHover={hoverEffect ? { y: -2, x: -2, boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)" } : undefined}
            className={cn(
                "tactile-card p-6",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};
