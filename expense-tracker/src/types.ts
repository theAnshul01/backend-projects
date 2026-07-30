export interface Expense {
    id: number;
    date: string;
    description: string;
    amount: number;
    category?: string;
}

export interface DataFile {
    expenses: Expense[];
    budgets: Record<number, number>;
    nextId: number;
}