// src/pages/BinaryTreeCalculator.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, SaveIcon, HistoryIcon, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TreeVisualization } from "@/components/TreeVisualization";
import { useCalculator } from '@/hooks/useCalculator';

interface TreeNode {
    value: number;
    left?: TreeNode;
    right?: TreeNode;
}

interface TreeResult {
    maxLeafPath: number[];
    maxPath: number[];
    maxLeafSum: number;
    maxPathSum: number;
}

export default function BinaryTreeCalculator() {
    const [nodes, setNodes] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TreeResult | null>(null);
    const [savedTrees, setSavedTrees] = useState<Array<{ nodes: string; result: TreeResult }>>([]);
    const { toast } = useToast();
    const { calculateTree } = useCalculator();


    const parseNodes = (input: string): (number | null)[] | null => {
        try {
            return input.split(',').map(n => {
                const trimmed = n.trim();
                return trimmed.toLowerCase() === 'null' ? null : Number(trimmed);
            });
        } catch {
            return null;
        }
    };

    const validateInput = (input: string): boolean => {
        const nodes = parseNodes(input);
        if (!nodes) return false;

        return nodes.every(node =>
            node === null || (typeof node === 'number' && !isNaN(node))
        );
    };

    const handleCalculate = async () => {
        if (!nodes.trim()) {
            toast({
                title: "Error",
                description: "Please enter tree nodes",
                variant: "destructive",
            });
            return;
        }

        if (!validateInput(nodes)) {
            toast({
                title: "Error",
                description: "Invalid input format. Use numbers or 'null' separated by commas",
                variant: "destructive",
            });
            return;
        }

        try {
            const nodeArray = parseNodes(nodes);
            if (!nodeArray) throw new Error("Invalid input");

            const data = await calculateTree(nodeArray);
            setResult(data);
        } catch (error) {
            // Error handled by hook
            setResult(null);
        }
    };

    const handleSave = () => {
        if (result) {
            setSavedTrees(prev => [...prev, { nodes, result }]);
            toast({
                title: "Success",
                description: "Tree saved successfully",
            });
        }
    };

    const TreeVisualizer = ({ nodes }: { nodes: string }) => {
        // This is a simplified visualization. You might want to use a proper tree visualization library
        return (
            <div className="p-4 bg-muted rounded-lg">
                <pre className="font-mono text-sm overflow-x-auto">
                    {nodes.split(',').join(' -> ')}
                </pre>
            </div>
        );
    };

    return (
        <div className="container max-w-6xl mx-auto py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Input Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Binary Tree Calculator</CardTitle>
                        <CardDescription>
                            Calculate maximum sum paths in binary trees.
                            Enter nodes as comma-separated values (e.g., 10,5,-3,3,2,null,11)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    placeholder="Enter nodes (e.g., 10,5,-3,3,2,null,11)"
                                    value={nodes}
                                    onChange={(e) => setNodes(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Use 'null' for empty nodes
                                </p>
                            </div>
                            {nodes && <TreeVisualizer nodes={nodes} />}
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleCalculate}
                                    disabled={loading}
                                    className="flex-1"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Calculating...
                                        </>
                                    ) : (
                                        "Calculate Paths"
                                    )}
                                </Button>
                                {result && (
                                    <Button
                                        variant="outline"
                                        onClick={handleSave}
                                        className="w-12"
                                    >
                                        <SaveIcon className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Result Section */}
                <AnimatePresence mode="wait">
                    {result && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Results</CardTitle>
                                    <CardDescription>
                                        Maximum path and leaf-to-node sums
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-muted rounded-lg">
                                            <h4 className="font-medium mb-2">Maximum Path Sum</h4>
                                            <div className="flex items-center justify-between">
                                                <Badge variant="secondary" className="text-lg">
                                                    {result.maxPathSum}
                                                </Badge>
                                                <p className="text-sm text-muted-foreground">
                                                    Path: {result.maxPath.join(' → ')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-muted rounded-lg">
                                            <h4 className="font-medium mb-2">Maximum Leaf Path Sum</h4>
                                            <div className="flex items-center justify-between">
                                                <Badge variant="secondary" className="text-lg">
                                                    {result.maxLeafSum}
                                                </Badge>
                                                <p className="text-sm text-muted-foreground">Path: {result.maxLeafPath.join(' → ')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Tree Visualization */}
                                        <div className="mt-6">
                                            <h4 className="font-medium mb-4">Tree Visualization</h4>
                                            <motion.div
                                                className="relative p-4 bg-muted/50 rounded-lg overflow-x-auto"
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                            >
                                                <TreeVisualization
                                                    nodes={nodes.split(',').map(n => n === 'null' ? null : Number(n))}
                                                    highlightedPath={result.maxPath}
                                                />
                                            </motion.div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* History Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2"
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <HistoryIcon className="h-5 w-5" />
                                    Saved Trees
                                </CardTitle>
                                {savedTrees.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSavedTrees([])}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Clear History
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {savedTrees.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No saved trees yet. Calculate and save trees to see them here.
                                </div>
                            ) : (
                                <ScrollArea className="h-[300px]">
                                    <div className="space-y-4">
                                        {savedTrees.map((saved, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="p-4 bg-muted rounded-lg"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-medium">Tree #{savedTrees.length - index}</h4>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setNodes(saved.nodes)}
                                                    >
                                                        Load Tree
                                                    </Button>
                                                </div>
                                                <div className="space-y-2">
                                                    <TreeVisualization
                                                        nodes={saved.nodes.split(',').map(n => n === 'null' ? null : Number(n))}
                                                        highlightedPath={saved.result.maxPath}
                                                        small
                                                    />
                                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Max Path Sum</p>
                                                            <Badge variant="secondary">
                                                                {saved.result.maxPathSum}
                                                            </Badge>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Max Leaf Sum</p>
                                                            <Badge variant="secondary">
                                                                {saved.result.maxLeafSum}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}