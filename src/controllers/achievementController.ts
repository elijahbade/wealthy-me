import {Request, Response} from 'express'; 
import Achievment from '../models/Achievment';
import { AuthRequest } from '../types/express';


export const CreateAchievement = async (req: AuthRequest, res: Response) => {
const {title, description} = req.body;
try {
    
    const newAchievement = new Achievment ({
        userId: req.user?.userId, 
        title, 
        description
    });

    await newAchievement.save()
    res.status(201).json({message: 'Achievement unlocked', achievment: newAchievement});

} catch (error) {
    res.status(201).json({error: 'Error encounterd, while creating achievement'});
    
}};


export const getAchievements = async (req: AuthRequest, res: Response) => {
    try {
    const achievements = await Achievment.find({userId: req.user?.userId})
    res.json(achievements);
} catch (error) {
    res.status(500).json({error: 'Error loading achievements'})
    
}
};
