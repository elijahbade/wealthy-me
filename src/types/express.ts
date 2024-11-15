


import { Request } from "express";
import mongoose, { Types } from "mongoose";

export interface AuthRequest extends Request {
  user?: {
    _id: mongoose.Types.ObjectId; // For MongoDB ObjectId type
    userId: string;
  };
}



// import express, {Request} from 'express'

// declare global {
//   namespace Express {
//     export interface AuthRequest {
//       user?: {
//         _id: Types.ObjectId; // Use this for ObjectId
//         userId: string;
//       };
//     }
//   }
// }

