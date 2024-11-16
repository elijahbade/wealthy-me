import mongoose, {Document, Schema} from "mongoose"


export const EntrySchema = new Schema ({
userId: { type: String, ref: "User", required: true },
month: { type: String, required: true },
year: { type: Number, required: true },
amount: { type: Number, required: true },
description: { type: String, required: true  },
date: {type: String}
});



// export const EntrySchema = new Schema({
//     userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
//     amount: {type: Number, required: true}, 
//     category: {type: String, required: true},
//     description: {type: String, required: true},
//     date: {type: String}
// })