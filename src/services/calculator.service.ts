import api from './api'
import { SubstringResult, TreeResult, CalculationHistory } from './api.types'

interface APIResponse<T> {
    status: string;
    message: string;
    data: T;
}

export const calculatorService = {
    // Substring Calculator Services
    calculateSubstring: async (input: string): Promise<SubstringResult> => {
        const { data } = await api.post<APIResponse<SubstringResult>>('/api/substring/calculate', {
            input
        });
        return data.data;
    },


    getSubstringHistory: async (): Promise<CalculationHistory[]> => {
        const { data } = await api.get<APIResponse<CalculationHistory[]>>('/api/substring/history');
        return data.data;
    },

    saveSubstringResult: async (input: string, result: SubstringResult): Promise<CalculationHistory> => {
        const { data } = await api.post<APIResponse<CalculationHistory>>('/api/substring/save', {
            input,
            result
        });
        return data.data;
    },

    deleteSubstringHistory: async (id: string): Promise<void> => {
        await api.delete(`/api/substring/history/${id}`);
    },

    // Binary Tree Calculator Services
    calculateTree: async (nodes: (number | null)[]): Promise<TreeResult> => {
        const { data } = await api.post<APIResponse<TreeResult>>('/api/tree/calculate', {
            nodes
        });
        return data.data;
    },

    saveTree: async (nodes: (number | null)[], name: string): Promise<void> => {
        await api.post('/api/tree/save', {
            nodes,
            name
        });
    },

    getTreeHistory: async (): Promise<CalculationHistory[]> => {
        const { data } = await api.get<APIResponse<CalculationHistory[]>>('/api/tree/history');
        return data.data;
    },

    saveTreeResult: async (nodes: (number | null)[], result: TreeResult): Promise<CalculationHistory> => {
        const { data } = await api.post<APIResponse<CalculationHistory>>('/api/tree/save', {
            nodes,
            result
        });
        return data.data;
    },

    deleteTreeHistory: async (id: string): Promise<void> => {
        await api.delete(`/api/tree/history/${id}`);
    },

    // General History Services
    getAllHistory: async (): Promise<CalculationHistory[]> => {
        const { data } = await api.get<APIResponse<CalculationHistory[]>>('/api/calculator/history');
        return data.data;
    },

    clearAllHistory: async (): Promise<void> => {
        await api.delete('/api/calculator/history');
    },

    // Statistics Services
    getCalculationStats: async (): Promise<{
        totalCalculations: number;
        substringCalculations: number;
        treeCalculations: number;
        averageSubstringLength: number;
        averageTreeNodes: number;
        mostUsedInputs: { input: string; count: number }[];
    }> => {
        const { data } = await api.get<APIResponse<any>>('/api/calculator/stats');
        return data.data;
    },

    // Batch Operations
    batchCalculateSubstring: async (inputs: string[]): Promise<SubstringResult[]> => {
        const { data } = await api.post<APIResponse<SubstringResult[]>>('/api/substring/batch-calculate', {
            inputs
        });
        return data.data;
    },

    batchCalculateTree: async (nodesList: (number | null)[][]): Promise<TreeResult[]> => {
        const { data } = await api.post<APIResponse<TreeResult[]>>('/api/tree/batch-calculate', {
            nodesList
        });
        return data.data;
    },

    // Export/Import Services
    exportHistory: async (type?: 'substring' | 'tree'): Promise<Blob> => {
        const response = await api.get(`/api/calculator/export${type ? `?type=${type}` : ''}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    importHistory: async (file: File): Promise<CalculationHistory[]> => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post<APIResponse<CalculationHistory[]>>('/api/calculator/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data.data;
    }
};