const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');


router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/', auth, async (req, res) => {
  const { description, amount, category } = req.body;
  try {
    const newExpense = new Expense({
      description,
      amount,
      category,
      user: req.user.id
    });
    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });
    
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await Expense.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Expense removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;