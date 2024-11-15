import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { AuthRequest } from '../types/express';

// Generic create function
export const createEntry = (model: Model<any>) => async (req: AuthRequest, res: Response) => {
  try {
    const entry = new model({
      userId: req.user?.userId,
      ...req.body,
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Error creating entry' });
  }
};

// Generic get all entries function
export const getEntries = (model: Model<any>) => async (req: AuthRequest, res: Response) => {
  try {
    const entries = await model.find({ userId: req.user?.userId });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching entries' });
  }
};

// Generic update entry function
export const updateEntry = (model: Model<any>) => 
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const entry = await model.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true }
      );
      if (!entry) {
         res.status(404).json({ error: 'Entry not found' });
      return;
        }
       res.json(entry);
    } catch (error) {
       res.status(500).json({ error: 'Error updating entry' });
    }
  };

// Generic delete entry function
export const deleteEntry = (model: Model<any>) => async (req: Request, res: Response): Promise<void>=> {
  const { id } = req.params;
  try {
    const entry = await model.findByIdAndDelete(id);
    if (!entry)  res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting entry' });
  }
};
