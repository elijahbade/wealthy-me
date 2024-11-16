import mongoose, { Document, Schema } from "mongoose";
import { IBudget } from "../utils/interface";


const BudgetSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  monthlyLimit: { type: Number, required: true },
  spent: { type: Number, default: 0 },
});

export const Budget = mongoose.model<IBudget>("Budget", BudgetSchema);




// import { timeStamp } from "console";

// const BudgetSchema = new Schema({
//     userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

//     monthlyLimit: { type: Number, required: true },
//     categorize: { type: String, required: true},
//     categoryLimits: 

//         [{
//             category: { type: String, required: true },
//             limit: { type: Number, required: true }

//         }],
        
// // categoryBudgets: { type: Map, of: Number } // Change this to a Map or Object

// }, 

// {timestamps: true}
// );

// BudgetSchema.pre('save', function (next) {
//     const totalCategoryLimits = this.categoryLimits.reduce((sum, cat) => sum + cat.limit, 0);
//     if (totalCategoryLimits > this.monthlyLimit) {
//         return next(new Error('Total category limits cannot exceed monthly budget.'));
//     }
//     next();
// });




// export default mongoose.model<IBudget>('Budget', BudgetSchema); 
