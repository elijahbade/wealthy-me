import {Request, Response} from 'express'; 
import { AuthRequest } from '../types/express';
import Rank from '../models/Rank';


export const createRank = async (req: AuthRequest, res: Response) => {
const {title, description} = req.body;
try {
    
    const newRank = new Rank ({
        userId: req.user?.userId, 
        title, 
        description
    });

    await newRank.save()
    res.status(201).json({message: 'New Rank Unlocked', ranks: newRank});

} catch (error) {
    res.status(201).json({error: 'Error encounterd, while creating achievement'});
    
}};


export const displayRank = async (req: AuthRequest, res: Response) => {
    try {
    const ranks = await Rank.find({userId: req.user?.userId})
    res.json(ranks);
} catch (error) {
    res.status(500).json({error: 'Error loading achievements'})
    
}
};
