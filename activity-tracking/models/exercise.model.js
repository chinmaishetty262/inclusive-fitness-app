const mongoose = require('mongoose');
const { Schema } = mongoose;

const exerciseSchema = new Schema(
  {
    username: { type: String, required: true },
    exerciseType: {
      type: String,
      required: true,
      enum: ['Running', 'Cycling', 'Swimming', 'Gym', 'Other']
    },
    description: { type: String, required: false },
    distance: {
      type: Number,
      required: false,
      min: [0, 'Distance should be non-negative.']
    },
    steps: {
      type: Number,
      required: false,
      validate: {
        validator: Number.isInteger,
        message: 'Steps should be an integer.'
      },
      min: [0, 'Steps should be non-negative.']
    },
    duration: { 
        type: Number, 
        required: true,
        validate: {
            validator: Number.isInteger,
            message: 'Duration should be an integer.'
        },
        min: [1, 'Duration should be positive.']
    },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
