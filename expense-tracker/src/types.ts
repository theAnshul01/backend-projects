export interface Expense {
    id: number;
    date: string;
    description: string;
    amount: number;
    category?: string;
}

export interface Budget {
    year: number;
    month: string;
    amount: number;
}