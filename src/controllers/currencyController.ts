import { Request, Response } from "express"
import axios from "axios"

export const convertCurrency = async (req: Request, res: Response) => {

    const {amount, from, to} = req.body

try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`)
    const rate = response.data.rates[to]; 
    const convertedAmount = amount * rate; 
    res.json({convertedAmount})


} catch (error) {

    res.status(500).json({error: 'Error converting currency'})
}
};

