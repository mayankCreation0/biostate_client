import { useState } from 'react';
import { calculatorService } from '@/services/calculator.service';
import { useToast } from './use-toast';
import { SubstringResult, TreeResult } from '@/services/api.types';

export const useCalculator = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const calculateSubstring = async (input: string): Promise<SubstringResult> => {
        setLoading(true);
        try {
            const result = await calculatorService.calculateSubstring(input);
            return result;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to calculate";
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const calculateTree = async (nodes: (number | null)[]): Promise<TreeResult> => {
        setLoading(true);
        try {
            const result = await calculatorService.calculateTree(nodes);
            toast({
                title: "Success",
                description: `Calculation completed in ${result.calculationTime.toFixed(2)}ms`,
            });
            return result;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to calculate tree";
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        calculateSubstring,
        calculateTree,
        // Add more methods as needed
    };
};