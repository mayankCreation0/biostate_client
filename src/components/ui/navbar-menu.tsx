// src/components/ui/navbar-menu.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const transition = {
    type: "spring",
    mass: 0.5,
    damping: 11.5,
    stiffness: 100,
    restDelta: 0.001,
    restSpeed: 0.001,
};

export const MenuItem = ({
    setActive,
    active,
    item,
    children,
}: {
    setActive: (item: string) => void;
    active: string | null;
    item: string;
    children?: React.ReactNode;
}) => {
    return (
        <div onMouseEnter={() => setActive(item)} className="relative">
            <motion.p
                transition={{ duration: 0.3 }}
                className="cursor-pointer text-foreground hover:text-primary"
            >
                {item}
            </motion.p>
            {active !== null && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={transition}
                >
                    {active === item && (
                        <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
                            <motion.div
                                transition={transition}
                                layoutId="active"
                                className="bg-popover backdrop-blur-sm rounded-2xl overflow-hidden border shadow-lg"
                            >
                                <motion.div
                                    layout
                                    className="w-max h-full p-4"
                                >
                                    {children}
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export const Menu = ({
    setActive,
    children,
}: {
    setActive: (item: string | null) => void;
    children: React.ReactNode;
}) => {
    return (
        <nav
            onMouseLeave={() => setActive(null)}
            className={cn(
                "relative rounded-full border",
                "bg-background hover:bg-accent",
                "transition-colors duration-300",
                "flex justify-center space-x-4 px-8 py-2",
                "max-sm:hidden"
            )}
        >
            {children}
        </nav>
    );
};

export const HoveredLink = ({ children, className, ...rest }: any) => {
    return (
        <Link
            {...rest}
            className={cn(
                "block p-2 rounded-lg",
                "text-muted-foreground hover:text-foreground",
                "hover:bg-accent transition-colors duration-200",
                className
            )}
        >
            {children}
        </Link>
    );
};