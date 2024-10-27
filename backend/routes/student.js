const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lab = require('../models/Lab');
const Reservation = require('../models/Reservation');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const Ticket = require('../models/Ticket');

// Middleware to check if the user is a student
const isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access denied. Student only.' });
  }
  next();
};

router.use(auth);
router.use(isStudent);

// Get assigned labs
router.get('/assigned-labs', async (req, res) => {
  try {
    const labs = await Lab.find({ assignedStudents: req.user.id });
    res.json(labs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get grades
router.get('/grades', async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.user.id }).populate('lab', 'name');
    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get reports (attendance and usage)
router.get('/reports', async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.user.id }).populate('lab', 'name');
    const reservations = await Reservation.find({ student: req.user.id }).populate('lab', 'name');
    
    const usage = reservations.reduce((acc, reservation) => {
      const labName = reservation.lab.name;
      const hours = (reservation.endDate - reservation.startDate) / (1000 * 60 * 60);
      
      if (acc[labName]) {
        acc[labName] += hours;
      } else {
        acc[labName] = hours;
      }
      
      return acc;
    }, {});

    const usageReport = Object.entries(usage).map(([lab, hours]) => ({ lab, hours }));

    res.json({ attendance, usage: usageReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Make a reservation
router.post('/reservations', async (req, res) => {
  try {
    const { labId, startDate, time } = req.body;
    const reservation = new Reservation({
      student: req.user.id,
      lab: labId,
      startDate,
      time
    });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Submit a ticket
router.post('/tickets', async (req, res) => {
  try {
    const { labId, issue } = req.body;
    const ticket = new Ticket({
      student: req.user.id,
      lab: labId,
      issue
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
