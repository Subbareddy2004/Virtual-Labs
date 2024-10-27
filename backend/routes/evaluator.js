const express = require('express');
const router = express.Router();
const Lab = require('../models/Lab');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const Grade = require('../models/Grade');
const auth = require('../middleware/auth');

// Get assigned labs
router.get('/labs', auth, async (req, res) => {
  try {
    const labs = await Lab.find({ evaluators: req.user.id });
    res.json(labs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Grade a student
router.post('/grade', auth, async (req, res) => {
  try {
    const { studentId, labId, grade, feedback } = req.body;
    const newGrade = new Grade({
      student: studentId,
      lab: labId,
      evaluator: req.user.id,
      grade,
      feedback
    });
    await newGrade.save();
    res.json(newGrade);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// ... (include other routes from mentor.js)

module.exports = router;
