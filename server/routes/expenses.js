const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');


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
    const savedExpense = await newExpense.save();

    const budget = await Budget.findOne({ user: req.user.id, category });

    let alertObj = { overBudget: false, message: '' };

    if (budget) {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      
      const aggregation = await Expense.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(req.user.id),
            category: category,
            date: { $gte: startOfMonth }
          }
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: "$amount" }
          }
        }
      ]);

      const totalSpent = aggregation.length > 0 ? aggregation[0].totalSpent : 0;

      if (totalSpent > budget.limit) {
        alertObj = {
          overBudget: true,
          message: `Warning: You have exceeded your $${budget.limit} limit for ${category}!`
        };
      }
    }
    res.json({ ...savedExpense._doc, alert: alertObj });

  } catch (err) {
    console.error(err);
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