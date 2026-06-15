const mongoose = require('mongoose');
const { Schema } = mongoose;

const workoutGuideSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['general', 'wheelchair', 'crutches', 'other'],
    },
    name: { type: String, required: true },
    difficulty: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    steps: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const WorkoutGuide = mongoose.model('WorkoutGuide', workoutGuideSchema);

module.exports = WorkoutGuide;
