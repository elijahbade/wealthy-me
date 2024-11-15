import mongoose, {Document, Schema}from "mongoose";
import { IUser } from "../utils/interface";


const UserSchema: Schema = new Schema ({
    username: {type: String, required: true}, 
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    achievements: [{type:String}],
    darkMode: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt:  { type: Date, default: Date.now }
    }); 

export default mongoose.model<IUser>('User', UserSchema)