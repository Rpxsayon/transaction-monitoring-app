

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    accountNumber: string;
    accountType: 'savings' | 'checking' | 'business';
    balance: number;
    status: 'active' | 'inactive' | 'suspended';
    joinDate: string;
    lastTransaction: string;
    totalTransactions: number;
    riskLevel: 'low' | 'medium' | 'high';
    avatar?: string;
}