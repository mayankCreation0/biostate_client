import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const AnimatedCard = ({ children, className, ...props }: AnimatedCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
            }}
            className={cn(
                "group relative overflow-hidden rounded-xl border bg-background p-6 hover:shadow-lg transition-all",
                className
            )}
            {...props}
        >
            {children}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
            </div>
        </motion.div>
    );
};