import {Request, Response} from 'express';
import { Income } from '../models/Income';
import { Expense } from '../models/Expense';
import { AuthRequest } from '../types/express';


export const getSummary = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.user!;
    
        // Get total income
        const totalIncomeResult = await Income.aggregate([
          { $match: { userId } },
          { $group: { _id: null, totalIncome: { $sum: "$amount" } } },
        ]);
        const totalIncome = totalIncomeResult[0]?.totalIncome || 0;
    
        // Get total expenses
        const totalExpensesResult = await Expense.aggregate([
          { $match: { userId } },
          { $group: { _id: null, totalExpenses: { $sum: "$amount" } } },
        ]);
        const totalExpenses = totalExpensesResult[0]?.totalExpenses || 0;
    
        // Calculate balance
        const balance = totalIncome - totalExpenses;
    
        res.status(200).json({
          totalIncome,
          totalExpenses,
          balance,
        });
      } catch (error) {
        console.error("Error fetching financial summary:", error);
        res.status(500).json({ error: "Error fetching financial summary" });
      }
    };




    export const detailedSummary = async (req: AuthRequest, res: Response) => {
        try {
            const { userId } = req.user!;
        
            // General Overview - Total Income and Expenses
            const totalIncomeResult = await Income.aggregate([
              { $match: { userId } },
              { $group: { _id: null, totalIncome: { $sum: "$amount" } } },
            ]);
            const totalIncome = totalIncomeResult[0]?.totalIncome || 0;
        
            const totalExpensesResult = await Expense.aggregate([
              { $match: { userId } },
              { $group: { _id: null, totalExpenses: { $sum: "$amount" } } },
            ]);
            const totalExpenses = totalExpensesResult[0]?.totalExpenses || 0;
        
            const balance = totalIncome - totalExpenses;
        
            // Month-by-Month Summary
            const incomeByMonth = await Income.aggregate([
              { $match: { userId } },
              {
                $group: {
                  _id: { month: { $month: { $toDate: "$date" } }, year: { $year: { $toDate: "$date" } } },
                  totalIncome: { $sum: "$amount" },
                },
              },
            ]);
        
            const expenseByMonth = await Expense.aggregate([
              { $match: { userId } },
              {
                $group: {
                  _id: { month: { $month: { $toDate: "$date" } }, year: { $year: { $toDate: "$date" } } },
                  totalExpenses: { $sum: "$amount" },
                },
              },
            ]);
        
            // Combine income and expense data by month
            const monthlySummary: Record<string, any>[] = [];
        
            const monthsMap = new Map<string, { month: number; year: number; totalIncome: number; totalExpenses: number }>();
        
            incomeByMonth.forEach(({ _id, totalIncome }) => {
              const key = `${_id.year}-${_id.month}`;
              monthsMap.set(key, { month: _id.month, year: _id.year, totalIncome, totalExpenses: 0 });
            });
        
            expenseByMonth.forEach(({ _id, totalExpenses }) => {
              const key = `${_id.year}-${_id.month}`;
              if (monthsMap.has(key)) {
                monthsMap.get(key)!.totalExpenses = totalExpenses;
              } else {
                monthsMap.set(key, { month: _id.month, year: _id.year, totalIncome: 0, totalExpenses });
              }
            });
        
            monthsMap.forEach(({ month, year, totalIncome, totalExpenses }) => {
              monthlySummary.push({
                month,
                year,
                totalIncome,
                totalExpenses,
                balance: totalIncome - totalExpenses,
              });
            });
        
            res.status(200).json({
              generalOverview: { totalIncome, totalExpenses, balance },
              monthlySummary,
            });
          } catch (error) {
            console.error("Error fetching financial summary:", error);
            res.status(500).json({ error: "Error fetching financial summary" });
          }
        };