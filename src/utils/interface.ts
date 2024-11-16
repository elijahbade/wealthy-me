import mongoose from "mongoose";
import { ObjectIdOrString } from "./types";

export interface IUser extends Document {
    userId: string;
    username: string;
    email: string;
    password: string;
    achievements: string[];
    darkMode: boolean,
    createdAt: Date,
    updatedAt: Date;
    
}

export interface ITransaction extends Document {
userId:   string;

    month: string;
    year: number; 
    amount: number; 
    description: string;
    date: string; 
}

// export interface ITransaction extends Document {
//     userId: ObjectIdOrString, 
//     amount: number, 
//     category: string, 
//     description: string, 
//     date: Date;
// }

// export interface ICategoryBudget {
//     [category: string]: number;  // Assuming the categoryBudgets are key-value pairs
//   }

  export interface IBudget extends Document {
    userId: string;
    month: string; // Example: 'January'
    year: number; // Example: 2024
    monthlyLimit: number; // The budget set for this month
    spent: number; // The amount spent for the month
  }
  


export interface IRank extends Document {
    userId: string;
    title: string; 
    description: string, 
    achievedOn: Date;
}