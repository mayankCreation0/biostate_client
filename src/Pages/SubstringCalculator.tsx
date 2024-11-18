import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CopyIcon, SaveIcon, HistoryIcon, Loader2, XCircle } from "lucide-react";
import { useCalculator } from '@/hooks/useCalculator';
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SubstringResult {
    longestLength: ReactNode;
    id: string;
    longestSubstring: string;
    length: number;
    allSubstrings: string[];
    calculationTime: number;
}

const VALID_INPUT_REGEX = /^[a-zA-Z0-9\s.,!?-]*$/;

export default function SubstringCalculator() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState<SubstringResult | null>(null);
    const [savedResults, setSavedResults] = useState<Array<{ input: string; result: SubstringResult }>>([]);
    const { toast } = useToast();
    const { loading, calculateSubstring } = useCalculator();

    // Input validation
    const isValidInput = (value: string) => VALID_INPUT_REGEX.test(value);
    const [inputError, setInputError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);

        if (!isValidInput(value)) {
            setInputError("Only letters, numbers, and basic punctuation allowed");
        } else if (value.length > 1000) {
            setInputError("Input too long (max 1000 characters)");
        } else {
            setInputError(null);
        }
    };

    const handleCalculate = async () => {
        if (!input.trim()) {
            toast({
                title: "Error",
                description: "Please enter a string",
                variant: "destructive",
            });
            return;
        }

        if (!isValidInput(input)) {
            toast({
                title: "Error",
                description: "Input contains invalid characters",
                variant: "destructive",
            });
            return;
        }

        try {
            const data = await calculateSubstring(input.trim());
            setResult(data);
            toast({
                title: "Success",
                description: `Calculation completed in ${data.calculationTime.toFixed(2)}ms`,
            });
        } catch (error) {
            // Error is already handled by the hook
            setResult(null);
        }
    };

    const handleSave = () => {
        if (result) {
            setSavedResults(prev => [...prev, { input, result }]);
            toast({
                title: "Success",
                description: "Result saved successfully",
            });
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied",
            description: "Text copied to clipboard",
        });
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
                        <CardTitle>Substring Calculator</CardTitle>
                        <CardDescription>
                            Find the longest substring without repeating characters
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Input
                                        placeholder="Enter a string..."
                                        value={input}
                                        onChange={handleInputChange}
                                        className={cn(
                                            "pr-20",
                                            inputError && "border-red-500"
                                        )}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <Badge
                                            variant={inputError ? "destructive" : "secondary"}
                                        >
                                            {input.length}/1000
                                        </Badge>
                                    </div>
                                </div>
                                {inputError && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-sm text-red-500 flex items-center gap-1"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        {inputError}
                                    </motion.p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleCalculate}
                                    disabled={loading || !!inputError}
                                    className="flex-1"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Calculating...
                                        </>
                                    ) : (
                                        "Calculate"
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
                                        Longest substring length: {result.longestLength}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="p-3 bg-muted rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium">
                                                    Longest Substring:
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(result.longestSubstring)}
                                                >
                                                    <CopyIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-lg font-mono">{result.longestSubstring}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium mb-2">All Unique Substrings:</h4>
                                            <ScrollArea className="h-48 rounded-md border">
                                                <div className="p-4 grid grid-cols-2 gap-2">
                                                    {result.allSubstrings.map((substring, index) => (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            className="flex items-center justify-between p-2 bg-muted rounded"
                                                        >
                                                            <span className="font-mono truncate">
                                                                {substring}
                                                            </span>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => copyToClipboard(substring)}
                                                            >
                                                                <CopyIcon className="h-3 w-3" />
                                                            </Button>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* History Section */}
                <AnimatePresence>
                    {savedResults.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="md:col-span-2"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <HistoryIcon className="h-5 w-5" />
                                        Calculation History
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-48">
                                        <div className="space-y-2">
                                            {savedResults.map((saved, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="p-3 bg-muted rounded-lg flex justify-between items-center"
                                                >
                                                    <div>
                                                        <p className="font-medium">Input: {saved.input}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Longest: {saved.result.longestSubstring}
                                                            {" "}
                                                            <Badge variant="secondary">
                                                                Length: {saved.result.longestLength}
                                                            </Badge>
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setInput(saved.input)}
                                                    >
                                                        Use
                                                    </Button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}