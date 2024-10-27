const express = require('express');
const router = express.Router();
const Lab = require('../models/Lab');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const Grade = require('../models/Grade');
const auth = require('../middleware/auth');

router.use(auth);

// Get assigned labs
router.get('/labs', async (req, res) => {
  try {
    const labs = await Lab.find({ evaluators: req.user.id });
    res.json(labs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// View assigned labs
router.get('/assigned-labs', async (req, res) => {
  try {
    const labs = await Lab.find({ assignedEvaluators: req.user.id });
    res.json(labs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Grade students
router.post('/grade', async (req, res) => {
  try {
    const { studentId, labId, score, comments } = req.body;
    const grade = new Grade({ student: studentId, lab: labId, score, comments });
    await grade.save();
    res.json(grade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ... (include other routes from mentor.js)

module.exports = router;
