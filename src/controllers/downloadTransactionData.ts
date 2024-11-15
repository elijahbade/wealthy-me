import { Request, Response } from 'express';
import { Income } from '../models/Income';
import {Expense} from '../models/Expense';
import Budget from '../models/Budget';
import Achievement from '../models/Achievment';
import { ObjectId } from 'mongoose';
import { AuthRequest } from '../types/express';
import { Parser } from 'json2csv';  // To generate CSV from JSON
import PDFDocument from 'pdfkit';  // To generate PDF

// Function to fetch financial data for the user
export const downloadAllData = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;  // Get user ID from the authenticated user (from JWT)

        if (!userId) {
            res.status(400).json({ error: 'User not authenticated' });
            return;
        }

        // Fetch all data for the authenticated user
        const incomes = await Income.find({ userId });
        const expenses = await Expense.find({ userId });
        const budgets = await Budget.find({ userId });
        const achievements = await Achievement.find({ userId });

        // Combine all the data into one object for easier management
        const financialData = {
            incomes,
            expenses,
            budgets,
            achievements,
        };

        // Check if the user has requested CSV or PDF format
        const fileType = req.query.type?.toString().toLowerCase(); // 'csv' or 'pdf'

        if (fileType === 'csv') {
            // Convert data into CSV format using json2csv
            const json2csvParser = new Parser();
            const csvData = json2csvParser.parse(financialData);

            // Set the response header to indicate a downloadable file
            res.header('Content-Type', 'text/csv');
            res.attachment('financial_data.csv');
            res.send(csvData);
        } else if (fileType === 'pdf') {
            // Create PDF document
            const doc = new PDFDocument();

            // Pipe the PDF output to the response
            res.setHeader('Content-Type', 'application/pdf');
            res.attachment('financial_data.pdf');
            doc.pipe(res);

            // Add title to the PDF
            doc.fontSize(16).text('Financial Data', { align: 'center' });

            // Incomes section
            doc.moveDown().fontSize(12).text('Incomes:');
            incomes.forEach((income) => {
                doc.text(`Amount: ${income.amount}, Category: ${income.category}, Description: ${income.description}, Date: ${income.date}`);
            });

            // Expenses section
            doc.moveDown().fontSize(12).text('Expenses:');
            expenses.forEach((expense) => {
                doc.text(`Amount: ${expense.amount}, Category: ${expense.category}, Description: ${expense.description}, Date: ${expense.date}`);
            });

            // Budgets section
            doc.moveDown().fontSize(12).text('Budgets:');
            budgets.forEach((budget) => {
                doc.text(`Category: ${budget.category}, Monthly Budget: ${budget.monthlyBudget}`);
            });

            // Achievements section
            doc.moveDown().fontSize(12).text('Achievements:');
            achievements.forEach((achievement) => {
                doc.text(`Title: ${achievement.title}, Description: ${achievement.description}`);
            });

            // End the PDF document
            doc.end();
        } else {
            res.status(400).json({ error: 'Invalid file type. Please request "csv" or "pdf".' });
        }

    } catch (error) {
        console.error('Error downloading data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
