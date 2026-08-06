#!/usr/bin/env node
import { Command } from "commander";
import { loadExpenses, getNextId, saveExpenses, loadBudget, saveBudget } from "./storage";
import { Budget, Expense } from "./types";

const program = new Command();

program
    .name("expense-tracker")
    .description("A simple CLI to track your expenses")
    .version("1.0.0")

const MONTHS: string[] = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

program
    .command("add")
    .description("Add a new expense")
    .requiredOption("-d, --description <description>", "description of the expense")
    .requiredOption("-a, --amount <amount>", "amount spent")
    .option("-c, --category <category>", "category")
    .action((options) => {
        const description: string = options.description.trim();
        const amount: number = Number(options.amount)
        const category: string = options.category?.trim();
        const month: string = new Date().toISOString().slice(5,7);
        
        const fullMonthName = MONTHS.at(Number(month)-1);
        const shortMonthName = MONTHS.at(Number(month) + 11);
        


        if(description.length === 0){
            console.error("Error: description cannot be empty")
            process.exitCode = 1;
            return;
        }
        if(Number.isNaN(amount) || amount <= 0){
            console.error("Error: amount must be a positive number.")
            process.exitCode = 1;
            return;
        }

        const expenses = loadExpenses();
        const budget = loadBudget();

        const filteredBudget: Budget[] = budget.filter((e) => (e.month.toUpperCase() === fullMonthName) || (e.month.toUpperCase() === shortMonthName))
        
        const allowedBudget: number = filteredBudget.reduce((sum, e) => sum + e.amount, 0);

        const filteredExpenses = expenses.filter((e) =>  e.date.slice(5,7) === month )
       
        const sum = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
        
        if(sum + amount > allowedBudget){
            console.log(`Warning: Expenses: $${sum + amount} exceeded the budget: $${allowedBudget} for the month: ${shortMonthName}.`)
        }

        const newExpense: Expense = {
            id: getNextId(expenses),
            date: new Date().toISOString().slice(0,10),
            description,
            amount,
            category
        };

        expenses.push(newExpense);
        saveExpenses(expenses);

        console.log(`Expense added successfully (ID: ${newExpense.id})`);

    })

program
    .command("list")
    .description("List all expenses")
    .option("-f, --filter <filter>", "filter expenses by category")
    .action((options) => {
        const expenses = loadExpenses();

        if (expenses.length === 0) {
            console.log("No expense found.");
            return;
        }
        let filteredExpenses: Expense[] = []
        if(options.filter){
            filteredExpenses = expenses.filter((e) => e.category === options.filter)
        } else {
            filteredExpenses = expenses
        }


        const idWidth = 5;
        const dateWidth = 12;
        const descWidth = Math.max(11, ...filteredExpenses.map((e) => e.description.length)) + 2;
        const amountWidth = Math.max(6, ...filteredExpenses.map((e) => `${e.amount}`.length)) + 2;

        console.log(
            "ID".padEnd(idWidth) + 
            "Date".padEnd(dateWidth) + 
            "Description".padEnd(descWidth) +
            "Amount".padEnd(amountWidth) +
            "Category"
        )

        for (const expense of filteredExpenses) {
            console.log(
                String(expense.id).padEnd(idWidth) +
                expense.date.padEnd(dateWidth) +
                expense.description.padEnd(descWidth) + 
                `${expense.amount}`.padEnd(amountWidth) +
                `${expense.category ? expense.category : "-"}`
            )
        }

    })

program
    .command("delete")
    .description("Delete an expense")
    .requiredOption("-i, --id <id>", "ID of the expense to delete")
    .action((options) => {
        const id: number = Number(options.id);

        if(!Number.isInteger(id) || id <= 0){
            console.error("Error: id must be a positive integer.");
            process.exitCode = 1;
            return;
        }

        const expenses = loadExpenses()
        const index = expenses.findIndex((e) => e.id === id);

        if(index === -1){
            console.error(`Error: expense with ID ${id} not found.`);
            process.exitCode = 1;
            return;
        }

        expenses.splice(index, 1);
        saveExpenses(expenses);

        console.log(`Expense deleted successfully (ID: ${id})`);

    });

program
    .command("update")
    .description("Update an existing expense")
    .requiredOption("-i, --id <id>", "ID of the expense to update")
    .option("-d, --description <description>", "new description")
    .option("-a, --amount <amount>", "new amount")
    .action((options) => {
        const id: number = Number(options.id)

        if(!Number.isInteger(id) || id < 0){
            console.error("Error: id must be a positive integer");
            process.exitCode = 1;
            return;
        }

        if(options.description === undefined && options.amount === undefined){
            console.error(
                "Error: provide at least one of --description or --amount to update."
            );
            process.exitCode = 1;
            return;
        }

        const expenses = loadExpenses()
        const expense = expenses.find((e) => e.id === id);

        if(!expense){
            console.error(`Error: expense with ID ${id} not found.`);
            process.exitCode = 1;
            return;
        }

        if (options.description !== undefined){
            const description: string = options.description.trim()
            if(description.length === 0){
                console.error("Error: description cannot be empty.");
                process.exitCode = 1;
                return;
            }
            expense.description = description;
        }

        if (options.amount !== undefined) {
            const amount: number = Number(options.amount);
            if (Number.isNaN(amount) || amount <= 0) {
                console.error("Error: amount must be a positive number.");
                process.exitCode = 1;
                return;
            }
            expense.amount = amount;
        }

        saveExpenses(expenses);
        console.log("Expense updated succefully.");

    });

program
    .command("summary")
    .description("View a summary of expense")
    .option("-m --month <month>", "filter by month (1-12) of the current year")
    .action((options) => {
        const expenses = loadExpenses();

        if(options.month === undefined) {
            const total = expenses.reduce((sum, e) => sum + e.amount, 0);
            console.log(`Total expenses: $${total}`);
            return;
        }

        const month: number = Number(options.month)

        if(!Number.isInteger(month) || month < 1 || month > 12){
            console.error("Error: month must be an integer between 1 and 12");
            process.exitCode = 1;
            return;
        }

        const currentYear = new Date().getFullYear();

        const filtered = expenses.filter((e) => {
            const [year, expenseMonth] = e.date.split("-").map(Number);
            return year === currentYear && expenseMonth === month;
        });

        const total = filtered.reduce((sum, e) => sum + e.amount, 0);
        const monthName = new Date(currentYear, month-1).toLocaleString("default", { month: "long" });

        console.log(`Total expenses for ${monthName} : $${total}`);

    });



program.
    command("budget")
    .description("Add/Update budget for a month")
    .requiredOption("-m, --month <month>", "Full month name or short month name of the current year")
    .requiredOption("-a, --amount <budget>" , "budget for the month")
    .action((options) => {
        const budget = loadBudget();

        const month: string = options.month.trim();
        const budgetAmount: number = Number(options.amount);

        if(Number.isNaN(budgetAmount) || budgetAmount <= 0){
            console.log("Budget Amount should be a positive number");
            process.exitCode = 1;
            return;
        }

        if(!MONTHS.includes(month.toUpperCase())){
            console.log(`Not a valid month of the year: ${month}, use a valid month`)
            process.exitCode = 1;
            return;
        }

        const monthBudget = budget.find((e) => e.month === month);
        if(monthBudget){
            console.log(`Budget already exist for the month: ${month}. You can only update it.`);
            console.log(monthBudget);
            process.exitCode = 1;
            return;
        }

        const newBudget: Budget = {
            year: new Date().getFullYear(),
            month: month,
            amount: budgetAmount,
        }

        budget.push(newBudget);
        saveBudget(budget);

        console.log(`Budget added successfully. month: ${month} budget: ${budgetAmount}`);

    })

program
    .command("list-budget")
    .description("list the budgets")
    .action(() => {
        const budget = loadBudget();
        if(budget.length === 0){
            console.log("No budget found.")
            return;
        }

        const yearWidth = 6;
        const monthWidth = Math.max(8, ...budget.map((b) => b.month.length)) + 2
        const budgetWidth = Math.max(6, ...budget.map((b) => `${b.amount}`.length)) + 2

        console.log(
            "Year".padEnd(yearWidth) + 
            "Month".padEnd(monthWidth) +
            "Budget".padEnd(budgetWidth)
        )
        console.log("------------------------")

        for(const b of budget){
            console.log(
                `${b.year}`.padEnd(yearWidth) +
                b.month.padEnd(monthWidth) +
                `${b.amount}`
                
            )
        }
    })
    

program
    .command("update-budget")
    .requiredOption("-m, --month <month>", "full month name of the current year")
    .requiredOption("-a, --amount <amount>", "budget amount for the month")
    .action((options) => {
        const month: string = options.month;
        const updatedAmount: number = Number(options.amount);

        if(Number.isNaN(updatedAmount) || updatedAmount < 0 || updatedAmount === undefined){
            console.log("amount should be a positive number");
            process.exitCode = 1;
            return;
        }

        const budget = loadBudget();

        const monthBudget = budget.find((b) => b.month === month)
        if(!monthBudget){
            console.log(`Budget for the month: ${month} does not exists.`)
            process.exitCode = 1;
            return;
        }

        monthBudget["amount"] = updatedAmount;

        saveBudget(budget);

        console.log(`budget amount updated to ${updatedAmount} for the month: ${month} ${new Date().getFullYear()}`);

    })

program.parse(process.argv);