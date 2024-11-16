import { Request, Response } from 'express';
import { Expense } from '../models/Expense';
import {Budget} from '../models/Budget';
import { AuthRequest } from '../types/express';
import '../utils/types'



export const setMonthlyBudget = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.user!;
    const { month, year, monthlyLimit } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { userId, month, year },
      { monthlyLimit },
      { new: true, upsert: true }
    );

    res.status(201).json({ message: "Budget set successfully", budget });
  } catch (error) {
    res.status(500).json({ error: "Error setting budget" });
  }
};


export const getMonthlyBudgetStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.user!; // Authenticated user ID
   

    // Step 1: Fetch all budgets for the user
    const budgets = await Budget.find({ userId });
    if (!budgets.length) {
      res.status(404).json({ error: "No budgets found" });
      return;
    }


    // Step 2: Aggregate expenses grouped by month and year
    const expenses = await Expense.aggregate([
      { $match: {userId} }, // Match only the user's expenses
      {
        $group: {
          _id: { month: "$month", year: "$year" }, // Group by month and year
          totalSpent: { $sum: "$amount" }, // Sum the amount spent
        },
      },
    ]);



    // Step 3: Map budgets to include spent and remaining amounts
    const budgetStatus = budgets.map((budget) => {
      // Find matching expense for the current budget
      const expense = expenses.find(
        (e) =>
          e._id.month === budget.month && e._id.year === budget.year // Match month and year
      );

      const spent = expense?.totalSpent || 0; // Default to 0 if no expenses
      const remaining = budget.monthlyLimit - spent;

      return {
        month: budget.month,
        year: budget.year,
        monthlyLimit: budget.monthlyLimit,
        spent,
        remaining,
      };
    });

    res.status(200).json(budgetStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving monthly budget status" });
  }
};




export const getMonthlyBudget = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.user!;  // Get the userId from the authenticated user
    const { month, year, id } = req.query;  // Get parameters from query (month, year or id)

    let budget;

    // Check if an ID is provided; if so, find the budget by ID
    if (id) {
      budget = await Budget.findById(id);
    } 
    // If no ID, then check for month and year parameters to find budget
    else if (month && year) {
      budget = await Budget.findOne({ userId, month, year });
    } 
    else {
      res.status(400).json({ error: "Please provide either an ID or both month and year" });
      return;
    }

    if (!budget) {
      res.status(404).json({ error: "Budget not found" });
    } else {
      res.status(200).json({ budget });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching monthly budget" });
  }
};
