const express = require('express');
const router = express.Router();
const Lab = require('../models/Lab');
const Reservation = require('../models/Reservation');
const Attendance = require('../models/Attendance');
const Ticket = require('../models/Ticket');
const Grade = require('../models/Grade');
const auth = require('../middleware/auth');
const { sendNotification, scheduleNotification } = require('../utils/notifications');
const User = require('../models/User');

// Get assigned labs
router.get('/labs', auth, async (req, res) => {
  try {
    const labs = await Lab.find({ students: req.user.id });
    res.json(labs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Reserve a lab slot
router.post('/reserve', auth, async (req, res) => {
  try {
    const { labId, startDate, endDate, time, isWeekly } = req.body;
    
    // Check if the lab exists
    const lab = await Lab.findById(labId);
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    // Convert startDate and endDate strings to Date objects
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Create new reservation
    const reservation = new Reservation({
      student: req.user.id,
      lab: labId,
      startDate: startDateObj,
      endDate: endDateObj,
      time,
      isWeekly
    });

    await reservation.save();

    // Schedule notification
    const reservationTime = new Date(`${startDate}T${time}`);
    scheduleNotification(req.user.id, labId, reservationTime);

    res.json({ message: 'Reservation successful', reservation });
  } catch (err) {
    console.error('Reservation error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get lab attendance
router.get('/attendance/:labId', auth, async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.user.id, lab: req.params.labId });
    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get grades
router.get('/grades/:labId', auth, async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.user.id, lab: req.params.labId });
    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Request additional lab hours
router.post('/request-hours', auth, async (req, res) => {
  try {
    const { labId, hours, reason } = req.body;
    // Logic to handle the request (e.g., notify admin)
    res.json({ message: 'Request submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Submit a ticket
router.post('/ticket', auth, async (req, res) => {
  try {
    const { labId, issue } = req.body;
    const newTicket = new Ticket({
      student: req.user.id,
      lab: labId,
      issue,
    });
    await newTicket.save();
    res.json(newTicket);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Launch a lab
router.post('/launch-lab', auth, async (req, res) => {
  try {
    const { labId } = req.body;
    const student = await User.findById(req.user.id);
    const lab = await Lab.findById(labId);

    if (!student.labHours) {
      student.labHours = {};
    }

    if (!student.labHours[labId]) {
      student.labHours[labId] = 0;
    }

    if (student.labHours[labId] >= lab.maxHours) {
      return res.status(403).json({ message: 'You have exceeded the maximum hours for this lab.' });
    }

    // Increment lab hours
    student.labHours[labId] += 1;
    await student.save();

    // Logic to launch the lab (e.g., return lab access URL)
    res.json({ message: 'Lab launched successfully', accessUrl: lab.accessUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
