import mongoose, {Document, Schema} from "mongoose";
import { IAchievement } from "../utils/interface";


const AchievementSchema = new Schema ({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true}, 
    title: {type: String, required: true}, 
    description: {type: String}, 
    achievedOn: {type: Date, default: Date.now}
})

export default mongoose.model<IAchievement>('Achievement', AchievementSchema)

