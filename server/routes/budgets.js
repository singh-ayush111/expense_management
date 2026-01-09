const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Budget = require('../models/Budget');

router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


router.post('/', auth, async (req, res) => {
  const { category, limit } = req.body;
  try {
    const budget = await Budget.findOneAndUpdate(
      { user: req.user.id, category },
      { limit },
      { new: true, upsert: true }
    );
    res.json(budget);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ msg: 'Budget not found' });

    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Budget.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Budget removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;