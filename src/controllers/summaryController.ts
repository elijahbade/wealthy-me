import {Request, Response} from 'express';
import { Income } from '../models/Income';
import { Expense } from '../models/Expense';
import { AuthRequest } from '../types/express';


export const getSummary = async (req: AuthRequest, res: Response) => {
    try {
        const income = await Income.aggregate([
            {$match: {userId: req.user?.userId}}, 
            {$group: {_id:null, totalIncome: {$sum: '₦amount'}}}
        ]);

const expenses = await Expense.aggregate ([
    {$match: {userId: req.user?.userId}}, 
    {$group: {_id: `$category`, totalExpenses: {$sum: `$amount`}}}

])

const totalIncome = income[0]?.totalincome || 0;
const spendingbyCategory = expenses.map(e => ({

    category: e._id,
    amount: e.totalExpenses
}))

res.json({totalIncome, spendingbyCategory})

    } 
catch {
    res.status(500).json({error: 'Error encounterd while generating summary'})

}

};