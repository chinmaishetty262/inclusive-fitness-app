const express = require('express');
const router = express.Router();
const Goal = require('../models/goal.model');

const isValidTargetValue = (value) => Number.isFinite(Number(value)) && Number(value) > 0;
const isValidDate = (value) => value && !Number.isNaN(Date.parse(value));

const validateGoalPayload = ({ username, goalType, targetValue, period, targetDate }) => {
  if (!username || !goalType || !targetValue || !period || !targetDate) {
    return 'Username, goal type, target value, period, and target date are required.';
  }

  if (!isValidTargetValue(targetValue)) {
    return 'Target value must be greater than 0.';
  }

  if (!isValidDate(targetDate)) {
    return 'Target date must be a valid date.';
  }

  return '';
};

router.get('/:username', async (req, res) => {
  try {
    const goals = await Goal.find({ username: req.params.username }).sort({ createdAt: -1 });
    res.json({ goals });
  } catch (error) {
    console.error('Error loading goals:', error);
    res.status(500).json({ error: 'Unable to load goals. Please try again later.' });
  }
});

router.post('/add', async (req, res) => {
  const validationError = validateGoalPayload(req.body);

  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  try {
    const { username, goalType, targetValue, period, startDate, targetDate, status } = req.body;

    const newGoal = new Goal({
      username,
      goalType,
      targetValue: Number(targetValue),
      period,
      startDate: isValidDate(startDate) ? new Date(startDate) : new Date(),
      targetDate: new Date(targetDate),
      status: status || 'Active'
    });

    await newGoal.save();
    res.json({ message: 'Goal added!', goal: newGoal });
  } catch (error) {
    console.error('Error saving goal:', error);
    res.status(400).json({ error: 'Unable to save goal. Please check the goal details and try again.' });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    const { goalType, targetValue, period, startDate, targetDate, status } = req.body;

    if (goalType !== undefined) goal.goalType = goalType;
    if (targetValue !== undefined) {
      if (!isValidTargetValue(targetValue)) {
        res.status(400).json({ error: 'Target value must be greater than 0.' });
        return;
      }
      goal.targetValue = Number(targetValue);
    }
    if (period !== undefined) goal.period = period;
    if (startDate !== undefined) goal.startDate = new Date(startDate);
    if (targetDate !== undefined) {
      if (!isValidDate(targetDate)) {
        res.status(400).json({ error: 'Target date must be a valid date.' });
        return;
      }
      goal.targetDate = new Date(targetDate);
    }
    if (status !== undefined) goal.status = status;

    await goal.save();
    res.json({ message: 'Goal updated!', goal });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(400).json({ error: 'Unable to update goal. Please check the goal details and try again.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id);

    if (!deletedGoal) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    res.json({ message: 'Goal deleted.' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(400).json({ error: 'Unable to delete goal.' });
  }
});

module.exports = router;
