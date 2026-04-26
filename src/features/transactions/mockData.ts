

import type { Transaction } from "./types";

// Generate 100 mock transactions 
export const generateMockTransactions = (): Transaction[] => {
    return Array.from({ length: 100 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 180)); // Last 6 months 
        const statuses: Transaction['status'][] = ['completed', 'pending', 'failed', 'processing'];
        const types: Transaction['type'][] = ['debit', 'credit'];
        const categories = ['Shopping', 'Food & Dining', 'Travel', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Transportation', 'Education'];
        const paymentMethods = ['Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Wallet'];
        const merchants = ['Amazon', 'Walmart', 'Target', 'Starbucks', 'McDonald\'s', 'Netflix', 'Spotify', 'Uber', 'Airbnb', 'Apple'];
        const names = ['John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis', 'James Wilson', 'Lisa Anderson', 'David Martinez', 'Jennifer Garcia', 'Robert Taylor', 'Mary Thomas'];

        return {
            id: `TXN${String(i + 1).padStart(6, '0')}`,
            transactionDate: date.toISOString(),
            customerName: names[Math.floor(Math.random() * names.length)],
            amount: parseFloat((Math.random() * 5000 + 10).toFixed(2)),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            type: types[Math.floor(Math.random() * types.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            merchantName: merchants[Math.floor(Math.random() * merchants.length)],
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            currency: 'USD',
            description: `Payment for ${categories[Math.floor(Math.random() * categories.length)].toLowerCase()} services`,
        }
    }).sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
}