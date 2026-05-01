

import type { Customer } from "./custTypes";

// mock function to generate mock real customer 
export const generateMockCustomers = (): Customer[] => {
    const names = [
        'John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis',
        'James Wilson', 'Lisa Anderson', 'David Martinez', 'Jennifer Garcia',
        'Robert Taylor', 'Mary Thomas', 'William Moore', 'Patricia Jackson',
        'Richard White', 'Linda Harris', 'Joseph Martin', 'Barbara Thompson',
        'Thomas Garcia', 'Elizabeth Robinson', 'Christopher Lee', 'Susan Walker'
    ];

    const accountTypes: Customer['accountType'][] = ['savings', 'checking', 'business'];
    const statuses: Customer['status'][] = ['active', 'inactive', 'suspended'];
    const riskLevels: Customer['riskLevel'][] = ['low', 'medium', 'high'];

    return names.map((name, i) => {
        const joinDate = new Date();
        joinDate.setMonth(joinDate.getMonth() - Math.floor(Math.random() * 60)); // Last 5 years
        const lastTransaction = new Date();
        lastTransaction.setDate(lastTransaction.getDate() - Math.floor(Math.random() * 90));

        return {
            id: `CUST${String(i + 1).padStart(6, '0')}`,
            name,
            email: name.toLowerCase().replace(' ', '.') + '@email.com',
            phone: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
            accountNumber: `ACC${String(Math.floor(Math.random() * 1000000000)).padStart(10, '0')}`,
            accountType: accountTypes[Math.floor(Math.random() * accountTypes.length)],
            balance: parseFloat((Math.random() * 100000 + 1000).toFixed(2)),
            status: i < 17 ? 'active' : statuses[Math.floor(Math.random() * statuses.length)],
            joinDate: joinDate.toISOString(),
            lastTransaction: lastTransaction.toISOString(),
            totalTransactions: Math.floor(Math.random() * 500 + 10),
            riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        };
    });
}; 