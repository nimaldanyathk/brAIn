import React from 'react';
import { cn } from '../../lib/utils';

interface SliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    color?: 'blue' | 'purple' | 'green' | 'red';
    onChange: (value: number) => void;
    className?: string;
}

export const Slider: React.FC<SliderProps> = ({
    label,
    value,
    min,
    max,
    step = 1,
    unit = '',
    color = 'blue',
    onChange,
    className,
}) => {
    const colorClasses = {
        blue: "accent-neon-blue",
        purple: "accent-neon-purple",
        green: "accent-neon-green",
        red: "accent-red-500",
    };

    return (
        <div className={cn("w-full", className)}>
            <div className="flex justify-between mb-2">
                <label className="font-bold text-gray-300">{label}</label>
                <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded">
                    {value} {unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className={cn(
                    "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer",
                    colorClasses[color]
                )}
            />
        </div>
    );
};
