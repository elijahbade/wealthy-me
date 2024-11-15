import mongoose, {Schema, Document} from "mongoose";
import { ITransaction } from "../utils/interface";
import { EntrySchema } from "./Schema/EntrySchema";


const TransactionSchema: Schema = new Schema({ 
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    amount: {type: Number, required: true}, 
    category: {type: String, required: true}, 
    description: {type: String}, 
    date: {type: Date, default: Date.now}


})

export default mongoose.model<ITransaction>('Transaction', TransactionSchema)
