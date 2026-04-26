

export interface Transaction {
    id: string;
    transactionDate: string;
    customerName: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed' | 'processing';
    type: 'debit' | 'credit';
    category: string;
    merchantName: string;
    paymentMethod: string;
    currency: string;
    description: string;
}

export interface TransactionFilters {
    searchTerm: string;
    status: string;
    type: string;
    category: string;
}
