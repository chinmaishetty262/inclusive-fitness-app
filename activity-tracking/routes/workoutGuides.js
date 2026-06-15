const express = require('express');
const router = express.Router();
const WorkoutGuide = require('../models/workoutGuide.model');

// GET all guides, optionally filtered by ?category=
router.get('/', async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const guides = await WorkoutGuide.find(filter).sort({ category: 1, name: 1 });
    res.json({ guides });
  } catch (error) {
    res.status(500).json({ error: 'Error: ' + error.message });
  }
});

module.exports = router;
