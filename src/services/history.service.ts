import api from './api';

export interface TreeHistory {
    id: string;
    input: string;
    result: string;
    createdAt: string;
    userId: string;
}

export interface SubstringHistory {
    id: string;
    input: string;
    result: string;
    createdAt: string;
    userId: string;
}

export interface HistoryParams {
    limit?: number;
    page?: number;
    startDate?: string;
    endDate?: string;
}

// Add response types to match your API structure
interface ApiResponse<T> {
    data: {
        calculations: T[];
    };
}

export const historyService = {
    getTreeHistory: async (params?: HistoryParams): Promise<TreeHistory[]> => {
        try {
            const { data } = await api.get<ApiResponse<TreeHistory>>('/api/tree/history', { params });
            console.log("Tree History", data.data.calculations);
            return data.data.calculations;
        } catch (error) {
            console.error('Error fetching tree history:', error);
            return [];
        }
    },

    getSubstringHistory: async (params?: HistoryParams): Promise<SubstringHistory[]> => {
        try {
            const { data } = await api.get<ApiResponse<SubstringHistory>>('/api/substring/history', { params });
            console.log("Substring History", data.data.calculations);
            return data.data.calculations;
        } catch (error) {
            console.error('Error fetching substring history:', error);
            return [];
        }
    },

    getAllHistory: async (params?: HistoryParams): Promise<(TreeHistory | SubstringHistory & { type: 'tree' | 'substring' })[]> => {
        try {
            const [treeHistory, substringHistory] = await Promise.all([
                historyService.getTreeHistory(params),
                historyService.getSubstringHistory(params)
            ]);

            const combinedHistory = [
                ...treeHistory.map(item => ({ ...item, type: 'tree' as const })),
                ...substringHistory.map(item => ({ ...item, type: 'substring' as const }))
            ].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            console.log("Combined History", combinedHistory);
            return combinedHistory;
        } catch (error) {
            console.error('Error combining history:', error);
            return [];
        }
    }
};