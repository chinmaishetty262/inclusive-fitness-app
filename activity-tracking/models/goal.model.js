const mongoose = require('mongoose');
const { Schema } = mongoose;

const goalSchema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    goalType: {
      type: String,
      required: true,
      enum: ['Steps', 'Reps', 'Laps', 'Distance', 'Active Minutes']
    },
    targetValue: {
      type: Number,
      required: true,
      min: [1, 'Target value should be positive.']
    },
    period: {
      type: String,
      required: true,
      enum: ['Daily', 'Weekly', 'Monthly']
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    targetDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Completed'],
      default: 'Active'
    }
  },
  { timestamps: true }
);

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
