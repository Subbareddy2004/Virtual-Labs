const express = require('express');
const router = express.Router();
const Lab = require('../models/Lab');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');
const csv = require('csv-express');

// Get assigned labs
router.get('/labs', auth, async (req, res) => {
  try {
    const labs = await Lab.find({ mentors: req.user.id });
    res.json(labs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get active users for a lab
router.get('/active-users/:labId', auth, async (req, res) => {
  try {
    const activeUsers = await User.find({
      currentLab: req.params.labId,
      role: 'student',
      lastActive: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // Active in the last 30 minutes
    }).select('name startTime');
    res.json(activeUsers);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get student utilization for a lab
router.get('/utilization/:labId', auth, async (req, res) => {
  try {
    const utilization = await Attendance.aggregate([
      { $match: { lab: req.params.labId } },
      { $group: {
        _id: '$student',
        totalHours: { $sum: '$duration' },
        lastAccess: { $max: '$date' }
      }},
      { $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'studentInfo'
      }},
      { $unwind: '$studentInfo' },
      { $project: {
        studentName: '$studentInfo.name',
        totalHours: 1,
        lastAccess: 1
      }}
    ]);
    res.json(utilization);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get attendance for a lab
router.get('/attendance/:labId', auth, async (req, res) => {
  try {
    const attendance = await Attendance.find({ lab: req.params.labId })
      .populate('student', 'name')
      .sort('-date');
    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Download attendance report
router.get('/attendance/:labId/download', auth, async (req, res) => {
  try {
    const attendance = await Attendance.find({ lab: req.params.labId })
      .populate('student', 'name')
      .sort('-date');
    
    const csvData = attendance.map(record => ({
      'Student Name': record.student.name,
      'Date': record.date.toLocaleDateString(),
      'Duration (minutes)': record.duration
    }));

    res.csv(csvData, true, {'Content-Type': 'text/csv'});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// View student's lab environment
router.get('/student-lab/:labId/:studentId', auth, async (req, res) => {
  try {
    // This is a placeholder. In a real implementation, you would need to integrate
    // with your lab environment system to get a URL or connection details.
    const labUrl = `https://lab-environment.example.com/lab/${req.params.labId}/student/${req.params.studentId}`;
    res.json({ labUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get active users in current session
router.get('/active-users/:labId', auth, async (req, res) => {
  try {
    const activeReservations = await Reservation.find({
      lab: req.params.labId,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    }).populate('student', 'name email');
    res.json(activeReservations);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// View student's lab environment (placeholder)
router.get('/student-lab/:studentId/:labId', auth, async (req, res) => {
  // Implement logic to view student's lab environment
  res.json({ message: 'Viewing student lab environment' });
});

// Get student utilization report
router.get('/utilization/:labId', auth, async (req, res) => {
  try {
    const utilization = await User.aggregate([
      { $match: { role: 'student' } },
      { $project: { name: 1, labHours: `$labHours.${req.params.labId}` } }
    ]);
    res.json(utilization);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
