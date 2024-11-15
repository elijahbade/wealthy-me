import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();  // Load ing the environment variables

// An async function to connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    // Check if the MONGO_URI is defined
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
