import { Request, Response } from 'express';
import { Income } from '../models/Income';
import {Expense} from '../models/Expense';
import {Budget} from '../models/Budget';
import Rank from '../models/Rank';
import { ObjectId } from 'mongoose';
import { AuthRequest } from '../types/express';
import { Parser } from 'json2csv';  // To generate CSV from JSON
import PDFDocument from 'pdfkit';  // To generate PDF

import { parse } from "json2csv"; // Library for CSV generation


export const downloadData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query; // Query parameter to determine file type
    const incomeData = await Income.find({});
    const expenseData = await Expense.find({});
    const rankData = await Rank.find({});

    if (type === "pdf") {
      // Generate PDF
      const doc = new PDFDocument();
      res.setHeader("Content-Disposition", "attachment; filename=data-export.pdf");
      res.setHeader("Content-Type", "application/pdf");
      doc.pipe(res);

      // Add title
      doc.fontSize(20).text("Data Export Summary", { align: "center" }).moveDown();

      // Add Income Section
      doc.fontSize(16).text("Incomes").moveDown(0.5);
      if (incomeData.length > 0) {
        incomeData.forEach((income) => {
          doc.fontSize(12).text(
            `Date: ${income.date}, Amount: ${income.amount}, Description: ${income.description}`
          );
        });
      } else {
        doc.fontSize(12).text("No income data available.");
      }
      doc.moveDown();

      // Add Expense Section
      doc.fontSize(16).text("Expenses").moveDown(0.5);
      if (expenseData.length > 0) {
        expenseData.forEach((expense) => {
          doc.fontSize(12).text(
            `Date: ${expense.date}, Amount: ${expense.amount}, Description: ${expense.description}`
          );
        });
      } else {
        doc.fontSize(12).text("No expense data available.");
      }
      doc.moveDown();

      // Add Rank Section
      doc.fontSize(16).text("Ranks").moveDown(0.5);
      if (rankData.length > 0) {
        rankData.forEach((rank) => {
          doc.fontSize(12).text(
            `Rank Name: ${rank.title}, Description: ${rank.description || "N/A"}`
          );
        });
      } else {
        doc.fontSize(12).text("No rank data available.");
      }
      doc.moveDown();

      // Finalize PDF
      doc.end();
    } else if (type === "csv") {
      // Generate CSV
      const csvFields = [
        { label: "Type", value: (row: any) => row.type || "Income/Expense/Rank" },
        { label: "Date", value: "date" },
        { label: "Amount", value: "amount" },
        { label: "Description", value: "description" },
        { label: "Rank Name", value: "name" },
      ];

      const combinedData = [
        ...incomeData.map((income) => ({ ...income.toObject(), type: "Income" })),
        ...expenseData.map((expense) => ({ ...expense.toObject(), type: "Expense" })),
        ...rankData.map((rank) => ({ ...rank.toObject(), type: "Rank" })),
      ];

      const csv = parse(combinedData, { fields: csvFields });
      res.setHeader("Content-Disposition", "attachment; filename=data-export.csv");
      res.setHeader("Content-Type", "text/csv");
      res.status(200).send(csv);
    } else {
      res.status(400).json({ error: "Invalid type. Use 'pdf' or 'csv'." });
    }
  } catch (error) {
    console.error("Error generating file:", error);
    res.status(500).json({ error: "An error occurred while preparing the file" });
  }
};
