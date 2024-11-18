import { cn } from "@/lib/utils";
import {motion} from 'framer-motion'

interface TreeVisualizationProps {
    nodes: (number | null)[];
    highlightedPath: number[];
    small?: boolean;
}

export const TreeVisualization = ({ nodes, highlightedPath, small = false }: TreeVisualizationProps) => {
    const maxDepth = Math.floor(Math.log2(nodes.length + 1));
    const width = small ? 240 : 400;
    const height = small ? 120 : 200;
    const nodeRadius = small ? 12 : 20;

    const getNodePosition = (index: number) => {
        const depth = Math.floor(Math.log2(index + 1));
        const maxNodesInDepth = Math.pow(2, depth);
        const position = index - (Math.pow(2, depth) - 1);
        const x = ((position + 0.5) * width) / maxNodesInDepth;
        const y = (depth * height) / maxDepth;
        return { x, y };
    };

    const drawLines = () => {
        return nodes.map((_, index) => {
            if (index === 0) return null;
            const parentIndex = Math.floor((index - 1) / 2);
            if (!nodes[parentIndex] || !nodes[index]) return null;

            const parent = getNodePosition(parentIndex);
            const current = getNodePosition(index);
            const isHighlighted =
                highlightedPath.includes(nodes[parentIndex]!) &&
                highlightedPath.includes(nodes[index]!);

            return (
                <motion.line
                    key={`line-${index}`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    x1={parent.x}
                    y1={parent.y}
                    x2={current.x}
                    y2={current.y}
                    stroke={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--border))"}
                    strokeWidth={isHighlighted ? 2 : 1}
                />
            );
        });
    };

    return (
        <svg width={width} height={height}>
            <g>
                {drawLines()}
                {nodes.map((value, index) => {
                    if (value === null) return null;
                    const { x, y } = getNodePosition(index);
                    const isHighlighted = highlightedPath.includes(value);

                    return (
                        <motion.g
                            key={index}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <circle
                                cx={x}
                                cy={y}
                                r={nodeRadius}
                                fill={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                                className="stroke-border"
                            />
                            <text
                                x={x}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className={cn(
                                    "text-xs font-medium",
                                    isHighlighted ? "fill-primary-foreground" : "fill-foreground"
                                )}
                            >
                                {value}
                            </text>
                        </motion.g>
                    );
                })}
            </g>
        </svg>
    );
};