import express, { Request, Response } from 'express';
import * as fs from 'fs';

const app = express();
const port = 3000;
const expensesFilePath = 'expenses.json';

interface Expense {
    id: number;
    name: string; 
    cost: number;
    createdAt: Date;
}

let expenses: Expense[] = []

function saveExpensesToFile(){
    fs.writeFileSync(expensesFilePath, JSON.stringify(expenses), 'utf8')
}

if (fs.existsSync(expensesFilePath)) {
    const fileContent = fs.readFileSync(expensesFilePath, 'utf8');
    if (fileContent.trim() !== '') {
        expenses = JSON.parse(fileContent)
    }
} else {
    fs.writeFileSync(expensesFilePath, '[]')
}

app.use(express.json())
app.get('/expenses', (req: Request, res: Response) => {
    res.json(expenses)
})

app.get('/expenses/:id', (req: Request, res: Response) => {
    const id = req.params.id
    const expense = expenses.find(expense => expense.id === Number(id))
    if (!expense) {
        res.status(404)
        res.json({success: false})
    } else {
        res.json(expense);
        res.send({success: true})
    }
})

app.post('/expenses', (req: Request, res: Response) => {
    const {name, cost }: Expense = req.body;
    const newId: number = expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1;
    const newExpense: Expense = {id: newId, name, cost, createdAt: new Date()}
    expenses.push(newExpense)
    saveExpensesToFile();
    res.status(201).json({success: true, newExpense});
})

app.put('/expenses/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const {name, cost}: Expense = req.body;
    const index: number = expenses.findIndex(expense => expense.id === Number (id))
    if (index !== -1) {
        expenses[index] = { ...expenses[index], name, cost }
        saveExpensesToFile()
        res.json({ success: true, updatedExpense: expenses[index] })
    } else {
        res.status(404).json({success: false, message: 'not found'});
    }
})

app.delete('/expenses/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const index: number = expenses.findIndex(expense => expense.id === Number(id))
    if (index !== -1) {
        expenses.splice(index, 1);
        res.json({ success: true, message: 'deleted' })
    } else {
        res.status(404).json({success: false, message: 'not found'});
    }
})




app.listen(port, () => {
    console.log(`http://localhost:${port}`)})

