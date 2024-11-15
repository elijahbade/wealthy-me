import { Request, Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../types/express";




export const toggleDarkMode = async (req: AuthRequest, res: Response): Promise<void>=> {

    try {
        const user = await User.findById(req.user?.userId)
        
        if (!user) {
            res.status(404).json({error: 'User not found'})
            return;
        }

    
 user.darkMode = !user.darkMode;
 await user.save(); 
res.json({darkMode: user.darkMode})

    } catch (error) {

        res.status(500).json({error: 'Error toggling dark mode'})
        
    }

};
