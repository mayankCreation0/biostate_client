import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface CounterProps {
    value: number;
    direction?: "up" | "down";
}

export const AnimatedCounter = ({ value, direction = "up" }: CounterProps) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);

    useEffect(() => {
        const animation = animate(count, direction === "up" ? value : 0, {
            duration: 1.5,
            ease: "easeOut",
        });

        return animation.stop;
    }, [value, direction]);

    return <motion.span>{rounded}</motion.span>;
};