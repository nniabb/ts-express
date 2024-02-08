"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs = require("fs");
var app = (0, express_1.default)();
var port = 3000;
var expensesFilePath = 'expenses.json';
var expenses = [];
function saveExpensesToFile() {
    fs.writeFileSync(expensesFilePath, JSON.stringify(expenses), 'utf8');
}
if (fs.existsSync(expensesFilePath)) {
    var fileContent = fs.readFileSync(expensesFilePath, 'utf8');
    if (fileContent.trim() !== '') {
        expenses = JSON.parse(fileContent);
    }
}
else {
    fs.writeFileSync(expensesFilePath, '[]');
}
app.use(express_1.default.json());
app.get('/expenses', function (req, res) {
    res.json(expenses);
});
app.get('/expenses/:id', function (req, res) {
    var id = req.params.id;
    var expense = expenses.find(function (expense) { return expense.id === Number(id); });
    if (!expense) {
        res.status(404);
        res.json({ success: false });
    }
    else {
        res.json(expense);
        res.send({ success: true });
    }
});
app.post('/expenses', function (req, res) {
    var _a = req.body, name = _a.name, cost = _a.cost;
    var newId = expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1;
    var newExpense = { id: newId, name: name, cost: cost, createdAt: new Date() };
    expenses.push(newExpense);
    saveExpensesToFile();
    res.status(201).json({ success: true, newExpense: newExpense });
});
app.put('/expenses/:id', function (req, res) {
    var id = req.params.id;
    var _a = req.body, name = _a.name, cost = _a.cost;
    var index = expenses.findIndex(function (expense) { return expense.id === Number(id); });
    if (index !== -1) {
        expenses[index] = __assign(__assign({}, expenses[index]), { name: name, cost: cost });
        saveExpensesToFile();
        res.json({ success: true, updatedExpense: expenses[index] });
    }
    else {
        res.status(404).json({ success: false, message: 'not found' });
    }
});
app.delete('/expenses/:id', function (req, res) {
    var id = req.params.id;
    var index = expenses.findIndex(function (expense) { return expense.id === Number(id); });
    if (index !== -1) {
        saveExpensesToFile();
        res.json({ success: true, message: 'deleted' });
    }
    else {
        res.status(404).json({ success: false, message: 'not found' });
    }
});
app.listen(port, function () {
    console.log("http://localhost:".concat(port));
});
