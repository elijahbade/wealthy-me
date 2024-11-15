import mongoose, {Document, Schema}from "mongoose";
import { EntrySchema } from "./Schema/EntrySchema";
import { ITransaction } from "../utils/interface";




export const Expense = mongoose.model<ITransaction>('Expense', EntrySchema); 
