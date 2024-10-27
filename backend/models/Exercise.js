const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  lab: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lab',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Exercise', ExerciseSchema);
