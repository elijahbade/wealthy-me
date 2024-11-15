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
    userId: string, 
    amount: number, 
    category: string, 
    description: string, 
    date: Date;
}

interface ICategoryBudget {
    [category: string]: number;  // Assuming the categoryBudgets are key-value pairs
  }

export interface IBudget extends Document {
    userId: string, 
    category: string; 
    categorize: string;
    monthlyLimit: number, 
    categoryLimits: {category: string, limit: number}[];
    categoryBudgets: ICategoryBudget;
    monthlyBudget: number;
}


export interface IAchievement extends Document {
    userId: string;
    title: string; 
    description: string, 
    achievedOn: Date;
}