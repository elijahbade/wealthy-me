import express from 'express';
import { loginUser, registerUser } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';
import { getSummary } from '../controllers/summaryController';
import { getAchievements } from '../controllers/achievementController';
import { setBudget, getRemainingBudget, updateBudget, getBudget } from '../controllers/budgetController';
import {createEntry, getEntries, updateEntry, deleteEntry,} from '../controllers/transactionsCRUD';
import { Income } from '../models/Income';
import { Expense } from '../models/Expense';
import { toggleDarkMode } from '../controllers/SettingsController';
import { convertCurrency } from '../controllers/currencyController';
import { getTransactionReport } from '../controllers/filterTransactions';
import { downloadAllData } from '../controllers/downloadTransactionData';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.use(authenticate);

// income routes
router.post('/income', createEntry(Income)); 
router.get('/income', getEntries(Income)); 
router.put('/income/:id', updateEntry(Income));
router.delete('/income/:id', deleteEntry(Income)); 

// Expense routes
router.post('/expense', createEntry(Expense));
router.get('/expense', getEntries(Expense));
router.put('/expense/:id', updateEntry(Expense));
router.delete('/expense/:id', deleteEntry(Expense));



//Budget Routes
router.post('/budget', setBudget)
// router.put('/budget/:id', updateBudget)
router.get('/budget/:id', getBudget);
router.get('/budget/remaining', getRemainingBudget);


router.get('/summary', getSummary);
router.get('/achievements', getAchievements);


// EXTRA ROUTES
router.post('/dark-mode', toggleDarkMode);
router.post('/currency-convert', convertCurrency);

//Filter Transactions
router.get('/reports/transactions', getTransactionReport);

// Route to download all financial data
router.get('/download', authenticate, downloadAllData);

export default router; 