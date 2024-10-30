const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  assignedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignedMentors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  evaluators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
  // ... other fields ...
});

module.exports = mongoose.model('Lab', LabSchema);
