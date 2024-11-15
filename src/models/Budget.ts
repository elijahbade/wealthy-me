import mongoose, { Document, Schema } from "mongoose";
import { IBudget } from "../utils/interface";
import { timeStamp } from "console";

const BudgetSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    monthlyLimit: { type: Number, required: true },
    categorize: { type: String, required: true },
    categoryLimits: 

        [{
            category: { type: String, required: true },
            limit: { type: Number, required: true }

        }],
        
// categoryBudgets: { type: Map, of: Number } // Change this to a Map or Object

}, 

{timestamps: true}
)


export default mongoose.model<IBudget>('Budget', BudgetSchema); 
