import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { AuthRequest } from '../types/express';
import Transaction from '../models/Transaction';


export const getTransactionReport = async (req: AuthRequest, res: Response): Promise<void> =>  {
  try {
    // Check if req.user is defined
    if (!req.user || !req.user._id) {
       res.status(401).json({ success: false, message: 'User not authenticated.' });
       return
    }

    const { category, startDate, endDate, minAmount, maxAmount } = req.query;
    const userId = req.user._id as mongoose.Types.ObjectId; // Assert _id as ObjectId

    // Initialize the query object
    const query: any = { userId };

    // Filter by category
    if (category) query.category = category;

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    // Filter by amount range
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount as string);
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount as string);
    }

    // Execute the query
    const transactions = await Transaction.find(query);

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving transactions.' });
  }
};
