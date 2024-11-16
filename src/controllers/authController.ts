import { Request, RequestHandler, Response } from "express";
import bcrypt, {genSalt} from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import User from "../models/User";
import  {AuthRequest}  from "../types/express";

export const registerUser = async (req: AuthRequest, res: Response) => {
  try {
    
    const {username, email, password} = req.body; 
    const saltRounds = 15;
    const salt = await genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, salt);

    //create the new user with the hashed password

const newUser = new User ({username, email, password: hashedPassword});
    await newUser.save();
    res.status(201).json({message: 'User has been registered successfully'});
}
    catch (error) {
        res.status(500).json({error: 'An error occured while registering a user'})
    
    } 
}



export const loginUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        if ((!email && !username) || !password) {
            res.status(400).json({ error: true, message: 'Invalid email/username or password' });
            return; // Early return
        }

        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (!user) {
            res.status(400).json({ error: true, message: 'Invalid email/username or password' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(400).json({ error: true, message: 'Invalid email/username or password' });
            return;
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', { expiresIn: '12h' });
        
        res.json({ error: false, message: 'Login successful', data: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'An error occurred during login', data: null });
    }
};


//Update User 
export const updateUser = async (req: AuthRequest, res: Response) => {
const {username, email} = req.body

try {
    const user = await User.findByIdAndUpdate(req.user?.userId, {username, email}, {new: true})
    res.json(user);
} catch (error) {
    res.status(500).json({error: 'Error updating usser'})
}

}

// Delete user

export const deleteUser = async (req: AuthRequest, res:Response) => {

    try {
    await User.findByIdAndUpdate(req.user?.userId)
    res.json({message: 'User deleted successfully'})
        
    } catch (error) {
        res.status(500).json({error: 'Error deleting user'})
 }
};