const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lab: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lab',
    required: true
  },
  assignment: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  comments: String
});

module.exports = mongoose.model('Grade', GradeSchema);
