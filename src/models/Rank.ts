import mongoose, {Document, Schema} from "mongoose";
import { IRank } from "../utils/interface";

const RankSchema = new Schema ({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true}, 
    title: {type: String, required: true}, 
    description: {type: String}, 
    achievedOn: {type: Date, default: Date.now}
})

export default mongoose.model<IRank>('Achievement', RankSchema)

