import express from 'express';
import { loginUser, registerUser } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware.';
import { addEntry, getEntries, updateEntry, deleteEntry} from '../controllers/transactionsCRUD';
import { Income } from '../models/Income';
import { Expense } from '../models/Expense';
import { toggleDarkMode } from '../controllers/SettingsController';
import { convertCurrency } from '../controllers/currencyController';
import { filterTransactions, getTransactionReport } from '../controllers/filterTransactions';
// import { downloadAllData } from '../controllers/downloadTransactionData';
import { getMonthlyBudget, getMonthlyBudgetStatus, setMonthlyBudget } from '../controllers/budgetController';
import { Model, Document, Types } from 'mongoose';
import { downloadData } from '../controllers/downloadTransactionData';
import { createRank, displayRank } from '../controllers/Ranks';
import { detailedSummary, getSummary } from '../controllers/summaryController';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.use(authenticate);

// income routes
router.post('/income', addEntry(Income)); 
router.get('/income', getEntries(Income)); 
router.put('/income/:id', updateEntry(Income));
router.delete('/income/:id', deleteEntry(Income)); 

// Expense routes
router.post('/expense', addEntry(Expense));
router.get('/expense', getEntries(Expense)); 
router.put('/expense/:id', updateEntry(Expense));
router.delete('/expense/:id', deleteEntry(Expense));



//Budget Routes
router.post('/budget', setMonthlyBudget);
router.get('/budget/status', getMonthlyBudgetStatus)
router.get('/budget/', getMonthlyBudget);

//Filter Transactions
router.get('/reports/', filterTransactions);



router.get('/summary', getSummary);
router.get('/detailed-summary', detailedSummary);
router.post('/create-rank',createRank);
router.get('/show-rank', displayRank);
router.get('/download',  downloadData);


router.post('/convert', convertCurrency);


// EXTRA ROUTE ?? TO BE WORKED ON LATER! 
router.post('/dark-mode', toggleDarkMode);



export default router; 

