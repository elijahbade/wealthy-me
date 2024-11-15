import { Request, Response } from 'express';
import { Expense } from '../models/Expense';
import Budget from '../models/Budget';
import { AuthRequest } from '../types/express';
import { promiseHooks } from 'v8';

export const setBudget = async (req: AuthRequest, res: Response) => {
    try {
        const { monthlyLimit, categoryLimits } = req.body;
        const budget = new Budget({ userId: req.body.userId, monthlyLimit, categoryLimits });
        
        await budget.save();
        res.status(201).json({ message: 'Budget set successfully' });
    } catch (error) {
      console.log(error);
        res.status(500).json({ error: 'Error Setting Budget' });
    }
};

export const getRemainingBudget = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const budget = await Budget.findOne({ userId: req.user?.userId });
        if (!budget) {
              res.status(404).json({ error: 'Budget not found' });
              return; 
        }

        const expenses = await Expense.aggregate([
            { $match: { userId: req.user?.userId } }, 
            { $group: { _id: '₦category', totalSpent: { $sum: '₦amount' } } }
        ]);

        const getRemainingByCategory = budget.categoryLimits.map(category => {
            const spent = expenses.find(e => e._id === category.category)?.totalSpent || 0;
            return {
                category: category.category, 
                remaining: category.limit - spent
            };
        });

        const totalSpent = expenses.reduce((acc, curr) => acc + curr.totalSpent, 0);
        const remainingMonthly = budget.monthlyLimit - totalSpent;

        res.json({ getRemainingByCategory, remainingMonthly });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error calculating remaining budget' });
    }
};


// Get user's budget
export const getBudget = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const budget = await Budget.findOne({ userId: req.user?.userId });
      if (!budget)  res.status(404).json({ error: 'No budget found' });
      res.json(budget);
      return; 
      
    } catch (error) {
      res.status(500).json({ error: 'Error fetching budget' });
    }
  };



  
  export const updateBudget = async (req: AuthRequest, res: Response): Promise<void> => {
  //   const userId = req.user?.userId;
  //   const { monthlyBudget, categoryBudgets } = req.body;
  
  //   try {
  //     const budget = await Budget.findOne({ userId });
  
  //     if (!budget) {
  //       res.status(404).json({ error: 'Budget not found' });
  //       return;
  //     }
  
  //     // Update monthly budget if provided
  //     if (monthlyBudget !== undefined) {
  //       budget.monthlyLimit = monthlyBudget;
  //     }
  
  //     // Update category budgets if provided (spread works now because it's an object or Map)
  //     if (categoryBudgets) {
  //       budget.categoryBudgets = { ...budget.categoryBudgets, ...categoryBudgets };
  //     }
  
  //     const updatedBudget = await budget.save();
  //     res.json(updatedBudget);
  //   } catch (error) {
  //     res.status(500).json({ error: 'Failed to update budget' });
  //   }
  };
  

  // Delete budget
  export const deleteBudget = async (req: AuthRequest, res: Response) => {
    try {
      await Budget.findOneAndDelete({ userId: req.user?.userId });
      res.json({ message: 'Budget deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting budget' });
    }
  };