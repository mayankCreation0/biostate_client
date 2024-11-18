// src/components/ui/background.tsx
"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps {
    children: ReactNode;
    className?: string;
}

export const BackgroundCells = ({ children, className }: AuroraBackgroundProps) => {
    return (
        <div className="min-h-screen w-full relative">
            {/* Background effect */}
            <div className="fixed inset-0 z-0">
                <div className={cn(
                    `absolute inset-0 
          [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
          [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
          [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
          [background-image:var(--white-gradient),var(--aurora)]
          dark:[background-image:var(--dark-gradient),var(--aurora)]
          [background-size:300%,_200%]
          [background-position:50%_50%,50%_50%]
          filter blur-[10px] invert dark:invert-0
          after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
          after:dark:[background-image:var(--dark-gradient),var(--aurora)]
          after:[background-size:200%,_100%] 
          after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
          pointer-events-none opacity-50`,
                    className
                )} />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen w-full">
                {children}
            </div>
        </div>
    );
};