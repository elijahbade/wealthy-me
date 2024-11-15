// import app from "./app";
// import routes from "./routes";

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`The server is running on port ${PORT}`);
// });


// app.use('/api', routes);


import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import router from './routes/index';
import './types/express'

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Use routes
app.use('/api/', router);



// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
