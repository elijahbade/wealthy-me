import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongoose";
import { AuthRequest } from "../types/express";
import mongoose from "mongoose";


// export const authenticate = (req: Request, res: Response, next: NextFunction) => {

//     const token = req.headers['authorization']?.split('')[1];
//     if (!token) return res.status(403).json({error: 'Validation error'})

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
//         req.user = decoded as {userId: string};
//         next();
//         } catch {
//             res.status(401).json({error: 'Token is invalid'})
//         }
        
// };


export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    // Check for the token in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];  // Correct split to access the token after "Bearer "

    if (!token) {
         res.status(403).json({ error: 'Validation error: Token missing' });
         return 
    }

    try {
        // Verify token and attach decoded user ID to req.user
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
            _id: mongoose.Types.ObjectId;
            userId: string;
};
        req.user = { _id: decoded._id, userId: decoded.userId };

        next();  // Proceed to the next middleware
    } catch (error) {
        res.status(401).json({ error: 'Token is invalid' });
    }
};