export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface UserLocation {
    country?: string;
    city?: string;
    ip?: string;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    profileImage?: string;
    lastLogin?: Date;
    isActive: boolean;
    location?: UserLocation;
    createdAt: Date;
    updatedAt: Date;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    country?: string;
    city?: string;
}

export interface AuthResponse {
    data: any;
    token: string;
    user: User;
}

export interface SubstringResult {
    id: string;
    longestSubstring: string;
    length: number;
    allSubstrings: string[];
    calculationTime: number;
}

export interface TreeNode {
    value: number;
    left?: number;
    right?: number;
}

export interface TreeInput {
    nodes: (number | null)[];
}

export interface TreeResult {
    id: string;
    maxLeafPath: number[];
    maxPath: number[];
    maxLeafSum: number;
    maxPathSum: number;
    calculationTime: number;
}
export interface CalculationHistory {
    id: string;
    type: 'substring' | 'tree';
    input: string;
    result: SubstringResult | TreeResult;
    userId: string;
    createdAt: string;
}

export interface TreeHistory {
    id: string
    input: string
    result: string
    createdAt: string
    userId: string
}

export interface SubstringHistory {
    id: string
    input: string
    result: string
    createdAt: string
    userId: string
}

export interface HistoryParams {
    limit?: number
    page?: number
    startDate?: string
    endDate?: string
}