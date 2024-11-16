import mongoose, { Model } from 'mongoose';
import { Request, Response } from 'express';
import { AuthRequest } from '../types/express';
import Transaction from '../models/Transaction';
import { Income } from '../models/Income';
import { Expense } from '../models/Expense';
import { ITransaction } from '../utils/interface';




export const filterTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { date, startDate, endDate, minAmount, maxAmount, description } = req.query;

    // Build the query object
    const query: Record<string, any> = {};

    query.userId = req.user?.userId; // Ensure userId filter is applied

    if (date) query.date = date;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }
    if (description) {
      query.description = { $regex: description, $options: "i" };
    }

    // Fetch results from both Income and Expense collections
    const [incomeResults, expenseResults] = await Promise.all([
      Income.find(query) as Promise<ITransaction[]>,
      Expense.find(query) as Promise<ITransaction[]>,
    ]);

    // Combine results and sort by date
    const combinedResults = [...incomeResults, ...expenseResults].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    res.status(200).json(combinedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error filtering transactions" });
  }
};



 export const getTransactionReport = async (req: AuthRequest, res: Response): Promise<void> =>  {
//   try {
//     // Check if req.user is defined
//     if (!req.user || !req.user._id) {
//        res.status(401).json({ success: false, message: 'User not authenticated.' });
//        return
//     }

//     const { category, startDate, endDate, minAmount, maxAmount } = req.query;
//     const userId = req.user._id as mongoose.Types.ObjectId; // Assert _id as ObjectId

//     // Initialize the query object
//     const query: any = { userId };

//     // Filter by category
//     if (category) query.category = category;

//     // Filter by date range
//     if (startDate || endDate) {
//       query.date = {};
//       if (startDate) query.date.$gte = new Date(startDate as string);
//       if (endDate) query.date.$lte = new Date(endDate as string);
//     }

//     // Filter by amount range
//     if (minAmount || maxAmount) {
//       query.amount = {};
//       if (minAmount) query.amount.$gte = parseFloat(minAmount as string);
//       if (maxAmount) query.amount.$lte = parseFloat(maxAmount as string);
//     }

//     // Execute the query
//     const transactions = await Transaction.find(query);

//     res.status(200).json({
//       success: true,
//       data: transactions,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Error retrieving transactions.' });
//   }
 };
